import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendScheduledNewsletter } from '@/lib/newsletter/scheduled-send'

// This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions, etc.)
// to check for scheduled newsletters and send them
export async function GET(request: NextRequest) {
  try {
    // Optional: Add authentication for cron job
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminClient = createAdminClient()
    const now = new Date().toISOString()

    // Find scheduled campaigns that are ready to send
    const { data: scheduledCampaigns, error } = await adminClient
      .from('newsletter_campaigns')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_at', now)

    if (error) {
      console.error('Error fetching scheduled campaigns:', error)
      return NextResponse.json({ error: 'Failed to fetch scheduled campaigns' }, { status: 500 })
    }

    if (!scheduledCampaigns || scheduledCampaigns.length === 0) {
      return NextResponse.json({ message: 'No scheduled campaigns to send', sent: 0 })
    }

    let sentCount = 0
    const results = []

    for (const campaign of scheduledCampaigns) {
      try {
        const result = await sendScheduledNewsletter(campaign.id)
        results.push({ campaignId: campaign.id, success: result.success })
        if (result.success) sentCount++
      } catch (error) {
        console.error(`Error sending scheduled campaign ${campaign.id}:`, error)
        results.push({ campaignId: campaign.id, success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    return NextResponse.json({
      message: `Processed ${scheduledCampaigns.length} scheduled campaigns`,
      sent: sentCount,
      results,
    })
  } catch (error) {
    console.error('Error in GET scheduled:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

