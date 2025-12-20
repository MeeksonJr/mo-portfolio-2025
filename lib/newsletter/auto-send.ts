import { createAdminClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface ContentData {
  id: string
  title: string
  slug?: string
  name?: string
  description?: string
  excerpt?: string
  featured_image?: string
  content?: string
}

export async function sendAutoNewsletter(
  contentType: 'blog' | 'project' | 'case-study' | 'music',
  contentData: ContentData
) {
  if (!resend) {
    console.log('Resend API key not configured, skipping auto-newsletter')
    return { success: false, reason: 'Resend not configured' }
  }

  try {
    const adminClient = createAdminClient()

    // Check if auto-send is enabled for this content type
    // For now, we'll check if there's a setting or just send for all published content
    // You can add a settings table later to control this per content type

    // Get confirmed subscribers
    const { data: subscribers, error: subscribersError } = await adminClient
      .from('newsletter_subscribers')
      .select('id, email, name, unsubscribe_token')
      .eq('status', 'confirmed')

    if (subscribersError || !subscribers || subscribers.length === 0) {
      return { success: false, reason: 'No subscribers' }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
    const contentTitle = contentData.title || contentData.name || 'New Content'
    const contentDescription = contentData.description || contentData.excerpt || ''
    const contentSlug = contentData.slug || contentData.id
    const contentTypePath = contentType === 'case-study' ? 'case-studies' : `${contentType}s`
    const contentUrl = `${siteUrl}/${contentTypePath}/${contentSlug}`

    // Generate newsletter content
    const subject = `New ${contentType === 'case-study' ? 'Case Study' : contentType}: ${contentTitle}`
    const content_html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        ${contentData.featured_image ? `
          <img src="${contentData.featured_image}" alt="${contentTitle}" style="width: 100%; border-radius: 8px; margin-bottom: 24px;" />
        ` : ''}
        <h1 style="font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px;">
          ${contentTitle}
        </h1>
        ${contentDescription ? `
          <p style="font-size: 16px; line-height: 1.6; color: #484848; margin-bottom: 24px;">
            ${contentDescription}
          </p>
        ` : ''}
        <a href="${contentUrl}" style="display: inline-block; background-color: #22c55e; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: 600; margin-top: 16px;">
          Read More →
        </a>
      </div>
    `

    const content_text = `${contentTitle}\n\n${contentDescription}\n\nRead more: ${contentUrl}`

    // Create campaign
    const { data: campaign, error: campaignError } = await adminClient
      .from('newsletter_campaigns')
      .insert({
        title: `Auto: ${contentTitle}`,
        subject,
        content_html,
        content_text,
        preview_text: contentDescription.substring(0, 150) || `Check out my latest ${contentType}`,
        featured_image_url: contentData.featured_image || null,
        content_type: contentType,
        content_id: contentData.id,
        status: 'sending',
        sent_to_count: subscribers.length,
      })
      .select()
      .single()

    if (campaignError) {
      console.error('Error creating auto-newsletter campaign:', campaignError)
      return { success: false, reason: 'Campaign creation failed' }
    }

    // Send emails
    let sentCount = 0
    for (const subscriber of subscribers) {
      try {
        const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?token=${subscriber.unsubscribe_token}`
        
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
          text: content_text,
        })

        await adminClient.from('newsletter_campaign_sends').insert({
          campaign_id: campaign.id,
          subscriber_id: subscriber.id,
          status: 'sent',
          sent_at: new Date().toISOString(),
        })

        sentCount++
      } catch (error) {
        console.error(`Error sending auto-newsletter to ${subscriber.email}:`, error)
        await adminClient.from('newsletter_campaign_sends').insert({
          campaign_id: campaign.id,
          subscriber_id: subscriber.id,
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    // Update campaign
    await adminClient
      .from('newsletter_campaigns')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        sent_to_count: sentCount,
      })
      .eq('id', campaign.id)

    return { success: true, sent: sentCount, campaign }
  } catch (error) {
    console.error('Error in sendAutoNewsletter:', error)
    return { success: false, reason: 'Unknown error' }
  }
}

