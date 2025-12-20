import { createAdminClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendScheduledNewsletter(campaignId: string) {
  if (!resend) {
    console.log('Resend API key not configured, skipping scheduled newsletter')
    return { success: false, reason: 'Resend not configured' }
  }

  try {
    const adminClient = createAdminClient()

    // Get campaign
    const { data: campaign, error: campaignError } = await adminClient
      .from('newsletter_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()

    if (campaignError || !campaign) {
      return { success: false, reason: 'Campaign not found' }
    }

    if (campaign.status !== 'scheduled') {
      return { success: false, reason: 'Campaign is not scheduled' }
    }

    // Get confirmed subscribers
    const { data: subscribers, error: subscribersError } = await adminClient
      .from('newsletter_subscribers')
      .select('id, email, name, unsubscribe_token')
      .eq('status', 'confirmed')

    if (subscribersError || !subscribers || subscribers.length === 0) {
      return { success: false, reason: 'No subscribers' }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
    let sentCount = 0
    let errorCount = 0

    // Update status to sending
    await adminClient
      .from('newsletter_campaigns')
      .update({ status: 'sending' })
      .eq('id', campaignId)

    // Send emails
    for (const subscriber of subscribers) {
      try {
        const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?token=${subscriber.unsubscribe_token}`
        
        const emailHtml = `
          ${campaign.content_html}
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
          subject: campaign.subject,
          html: emailHtml,
          text: campaign.content_text || campaign.content_html.replace(/<[^>]*>/g, ''),
        })

        await adminClient.from('newsletter_campaign_sends').insert({
          campaign_id: campaign.id,
          subscriber_id: subscriber.id,
          status: 'sent',
          sent_at: new Date().toISOString(),
        })

        sentCount++
      } catch (error) {
        console.error(`Error sending scheduled newsletter to ${subscriber.email}:`, error)
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

    return { success: true, sent: sentCount, errors: errorCount }
  } catch (error) {
    console.error('Error in sendScheduledNewsletter:', error)
    return { success: false, reason: 'Unknown error' }
  }
}

