import { createAdminClient } from '@/lib/supabase/server'
import type { AnalyticsEvent } from '@/lib/analytics'

interface ServerAnalyticsEvent extends AnalyticsEvent {
  ip_address?: string | null
  user_agent?: string | null
  referrer?: string | null
}

export async function logServerAnalyticsEvent(event: ServerAnalyticsEvent) {
  try {
    const adminClient = createAdminClient()

    await adminClient.from('analytics').insert({
      content_type: event.content_type || null,
      content_id: event.content_id || null,
      event_type: event.event_type,
      metadata: event.metadata || {},
      ip_address: event.ip_address || null,
      user_agent: event.user_agent || null,
      referrer: event.referrer || null,
    })
  } catch (error) {
    console.error('Server analytics logging failed:', error)
  }
}

