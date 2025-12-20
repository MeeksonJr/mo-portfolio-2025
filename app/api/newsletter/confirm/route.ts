import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Confirmation token is required' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Find subscriber by confirmation token
    const { data: subscriber, error: findError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, status, confirmed_at, confirmation_token')
      .eq('confirmation_token', token)
      .single()

    if (findError || !subscriber) {
      console.error('Confirmation token lookup error:', findError)
      return NextResponse.json(
        { error: 'Invalid or expired confirmation token' },
        { status: 400 }
      )
    }

    if (subscriber.status === 'confirmed') {
      return NextResponse.json({
        success: true,
        message: 'Email already confirmed',
        alreadyConfirmed: true,
      })
    }

    // Use admin client to update (bypasses RLS) since we've already validated the token
    // This ensures the update always works even if RLS policies are restrictive
    const adminClient = createAdminClient()
    
    // Confirm subscription
    const { data: updatedSubscriber, error: updateError } = await adminClient
      .from('newsletter_subscribers')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        confirmation_token: null, // Clear token after confirmation
      })
      .eq('id', subscriber.id)
      .eq('confirmation_token', token) // Double-check token matches
      .select()
      .single()

    if (updateError || !updatedSubscriber) {
      console.error('Newsletter confirmation error:', updateError)
      return NextResponse.json(
        { error: 'Failed to confirm subscription', details: updateError?.message },
        { status: 500 }
      )
    }

    console.log('Subscription confirmed successfully:', updatedSubscriber.email, updatedSubscriber.status)

    // Track analytics
    await adminClient.from('newsletter_analytics').insert({
      subscriber_id: updatedSubscriber.id,
      event_type: 'confirmed',
    })

    // Send welcome email
    const { data: subscriberData } = await adminClient
      .from('newsletter_subscribers')
      .select('unsubscribe_token, name, email')
      .eq('id', updatedSubscriber.id)
      .single()

    if (subscriberData?.unsubscribe_token && process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const { NewsletterWelcomeEmail } = await import('@/components/emails/newsletter-welcome-email')
        const resend = new Resend(process.env.RESEND_API_KEY)

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
        const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?token=${subscriberData.unsubscribe_token}`

        await resend.emails.send({
          from: 'Mohamed Datt <newsletter@mohameddatt.com>',
          to: [subscriberData.email],
          subject: 'Welcome to the Newsletter! 🎉',
          react: NewsletterWelcomeEmail({
            name: subscriberData.name || 'there',
            unsubscribeUrl,
          }),
        })
      } catch (error) {
        console.error('Failed to send welcome email:', error)
        // Don't fail the confirmation if welcome email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email confirmed successfully! Welcome to the newsletter.',
    })
  } catch (error) {
    console.error('Newsletter confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to confirm subscription' },
      { status: 500 }
    )
  }
}

