import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createServerClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    // Check for Authorization header first
    const authHeader = request.headers.get('authorization')
    let session = null

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      const supabase = await createServerClient()
      const { data: { session: sessionData } } = await supabase.auth.getSession()
      // Verify token matches session
      if (sessionData?.access_token === token) {
        session = sessionData
      }
    } else {
      const supabase = await createServerClient()
      const { data: { session: sessionData } } = await supabase.auth.getSession()
      session = sessionData
    }

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminClient = createAdminClient()
    const { data: userRole } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!userRole || userRole.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!resend) {
      return NextResponse.json({ error: 'Resend API key not configured' }, { status: 500 })
    }

    const body = await request.json()
    const {
      title,
      subject,
      content_html,
      content_text,
      preview_text,
      featured_image_url,
      images,
      content_type,
      content_id,
    } = body

    if (!title || !subject || !content_html) {
      return NextResponse.json(
        { error: 'Title, subject, and content are required' },
        { status: 400 }
      )
    }

    // Get confirmed subscribers
    const { data: subscribers, error: subscribersError } = await adminClient
      .from('newsletter_subscribers')
      .select('id, email, name, unsubscribe_token')
      .eq('status', 'confirmed')

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError)
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'No confirmed subscribers found' }, { status: 400 })
    }

    // Create campaign
    const { data: campaign, error: campaignError } = await adminClient
      .from('newsletter_campaigns')
      .insert({
        title,
        subject,
        content_html,
        content_text: content_text || null,
        preview_text: preview_text || null,
        featured_image_url: featured_image_url || null,
        images: images || [],
        content_type: content_type || 'custom',
        content_id: content_id || null,
        status: 'sending',
        sent_to_count: subscribers.length,
        created_by: session.user.id,
      })
      .select()
      .single()

    if (campaignError) {
      console.error('Error creating campaign:', campaignError)
      return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
    let sentCount = 0
    let errorCount = 0

    // Send emails
    for (const subscriber of subscribers) {
      try {
        const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?token=${subscriber.unsubscribe_token}`
        
        // Create email HTML with unsubscribe link
        const emailHtml = `
          ${content_html}
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e6ebf1;" />
          <p style="font-size: 14px; color: #8898aa; text-align: center;">
            You're receiving this because you subscribed to my newsletter.<br />
            <a href="${unsubscribeUrl}" style="color: #22c55e; text-decoration: underline;">
              Unsubscribe
            </a>
          </p>
        `

        await resend.emails.send({
          from: 'Mohamed Datt <newsletter@mohameddatt.com>',
          to: [subscriber.email],
          subject,
          html: emailHtml,
          text: content_text || content_html.replace(/<[^>]*>/g, ''),
        })

        // Create send record
        await adminClient.from('newsletter_campaign_sends').insert({
          campaign_id: campaign.id,
          subscriber_id: subscriber.id,
          status: 'sent',
          sent_at: new Date().toISOString(),
        })

        sentCount++
      } catch (error) {
        console.error(`Error sending to ${subscriber.email}:`, error)
        
        // Create failed send record
        await adminClient.from('newsletter_campaign_sends').insert({
          campaign_id: campaign.id,
          subscriber_id: subscriber.id,
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
        })

        errorCount++
      }
    }

    // Update campaign status
    await adminClient
      .from('newsletter_campaigns')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        sent_to_count: sentCount,
      })
      .eq('id', campaign.id)

    return NextResponse.json({
      success: true,
      campaign,
      sent: sentCount,
      errors: errorCount,
      message: `Newsletter sent to ${sentCount} subscribers${errorCount > 0 ? ` (${errorCount} failed)` : ''}`,
    })
  } catch (error) {
    console.error('Error in POST send:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

