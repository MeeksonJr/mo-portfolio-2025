/**
 * Analytics utility functions for tracking events
 */

export interface AnalyticsEvent {
  content_type?: 'blog_post' | 'case_study' | 'resource' | 'project'
  content_id?: string
  event_type:
    | 'view'
    | 'click'
    | 'share'
    | 'download'
    | 'search'
    | 'form_submit'
    | 'feature_use'
    | 'chat_usage'
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
export function trackClick(
  contentType: AnalyticsEvent['content_type'],
  contentId: string,
  metadata?: Record<string, any>,
) {
  trackEvent({
    content_type: contentType,
    content_id: contentId,
    event_type: 'click',
    metadata,
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

/**
 * Track downloads
 */
export function trackDownload(resourceId: string, metadata?: Record<string, any>) {
  trackEvent({
    content_type: 'resource',
    content_id: resourceId,
    event_type: 'download',
    metadata,
  })
}

/**
 * Track form submission events
 */
export function trackFormSubmit(formId: string, metadata?: Record<string, any>) {
  trackEvent({
    content_type: 'resource',
    content_id: formId,
    event_type: 'form_submit',
    metadata,
  })
}

/**
 * Track custom feature usage
 */
export function trackFeatureUsage(feature: string, metadata?: Record<string, any>) {
  trackEvent({
    content_type: 'resource',
    content_id: feature,
    event_type: 'feature_use',
    metadata: { feature, ...metadata },
  })
}

