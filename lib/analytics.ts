/**
 * Analytics utility functions for tracking events
 */

export interface AnalyticsEvent {
  content_type?: 'blog_post' | 'case_study' | 'resource' | 'project'
  content_id?: string
  event_type: 'view' | 'click' | 'share' | 'download' | 'search' | 'form_submit'
  metadata?: Record<string, any>
}

/**
 * Track an analytics event
 */
export async function trackEvent(event: AnalyticsEvent) {
  try {
    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
      credentials: 'include',
    })

    if (!response.ok) {
      console.error('Failed to track event:', response.statusText)
    }
  } catch (error) {
    // Silently fail - analytics should not break the app
    console.error('Analytics tracking error:', error)
  }
}

/**
 * Track page view
 */
export function trackPageView(contentType?: AnalyticsEvent['content_type'], contentId?: string) {
  trackEvent({
    content_type: contentType,
    content_id: contentId,
    event_type: 'view',
  })
}

/**
 * Track content click
 */
export function trackClick(contentType: AnalyticsEvent['content_type'], contentId: string) {
  trackEvent({
    content_type: contentType,
    content_id: contentId,
    event_type: 'click',
  })
}

/**
 * Track share event
 */
export function trackShare(
  contentType: AnalyticsEvent['content_type'],
  contentId: string,
  platform: string
) {
  trackEvent({
    content_type: contentType,
    content_id: contentId,
    event_type: 'share',
    metadata: { platform },
  })
}

