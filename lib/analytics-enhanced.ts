/**
 * Enhanced analytics tracking
 * Tracks conversions, user journeys, and engagement metrics
 */

import { trackClick } from './analytics'

export interface ConversionEvent {
  type: 'resume_download' | 'contact_form' | 'newsletter_signup' | 'project_view' | 'blog_read'
  value?: number
  currency?: string
  metadata?: Record<string, any>
}

export interface UserJourneyStep {
  action: string
  page: string
  timestamp: number
  metadata?: Record<string, any>
}

/**
 * Track conversion events
 */
export function trackConversion(event: ConversionEvent) {
  if (typeof window === 'undefined') return

  // Track in Vercel Analytics (if available)
  if (window.va) {
    window.va('event', {
      name: 'conversion',
      params: {
        type: event.type,
        value: event.value,
        currency: event.currency,
        ...event.metadata,
      },
    })
  }

  // Track in localStorage for later analysis
  const conversions = JSON.parse(localStorage.getItem('conversions') || '[]')
  conversions.push({
    ...event,
    timestamp: Date.now(),
  })
  localStorage.setItem('conversions', JSON.stringify(conversions.slice(-100))) // Keep last 100

  // Track click event
  trackClick('conversion', event.type, event.metadata)
}

/**
 * Track user journey
 */
export function trackUserJourney(step: UserJourneyStep) {
  if (typeof window === 'undefined') return

  const journey = JSON.parse(localStorage.getItem('user_journey') || '[]')
  journey.push(step)
  localStorage.setItem('user_journey', JSON.stringify(journey.slice(-50))) // Keep last 50 steps
}

/**
 * Track engagement metrics
 */
export interface EngagementMetrics {
  scrollDepth: number // 0-100
  timeOnPage: number // seconds
  interactions: number
  contentRead: boolean
}

export function trackEngagement(metrics: EngagementMetrics) {
  if (typeof window === 'undefined') return

  // Track in Vercel Analytics
  if (window.va) {
    window.va('event', {
      name: 'engagement',
      params: {
        scroll_depth: metrics.scrollDepth,
        time_on_page: metrics.timeOnPage,
        interactions: metrics.interactions,
        content_read: metrics.contentRead,
      },
    })
  }

  // Store in localStorage
  const engagement = JSON.parse(localStorage.getItem('engagement') || '[]')
  engagement.push({
    ...metrics,
    timestamp: Date.now(),
    page: window.location.pathname,
  })
  localStorage.setItem('engagement', JSON.stringify(engagement.slice(-100)))
}

/**
 * Track scroll depth
 */
export function trackScrollDepth() {
  if (typeof window === 'undefined') return

  let maxScroll = 0
  const checkScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = Math.round((scrollTop / docHeight) * 100)

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent

      // Track milestones (25%, 50%, 75%, 100%)
      if ([25, 50, 75, 100].includes(scrollPercent)) {
        trackEngagement({
          scrollDepth: scrollPercent,
          timeOnPage: Math.round((Date.now() - (window.pageLoadTime || Date.now())) / 1000),
          interactions: 0,
          contentRead: scrollPercent >= 75,
        })
      }
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true })
  window.addEventListener('beforeunload', () => {
    if (maxScroll > 0) {
      trackEngagement({
        scrollDepth: maxScroll,
        timeOnPage: Math.round((Date.now() - (window.pageLoadTime || Date.now())) / 1000),
        interactions: 0,
        contentRead: maxScroll >= 75,
      })
    }
  })
}

/**
 * Initialize enhanced analytics
 */
export function initEnhancedAnalytics() {
  if (typeof window === 'undefined') return

  // Track page load time
  window.pageLoadTime = Date.now()

  // Track scroll depth
  trackScrollDepth()

  // Track time on page
  const startTime = Date.now()
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000)
    trackEngagement({
      scrollDepth: 0,
      timeOnPage,
      interactions: 0,
      contentRead: false,
    })
  })

  // Track user journey - page view
  trackUserJourney({
    action: 'page_view',
    page: window.location.pathname,
    timestamp: Date.now(),
  })
}

// Extend Window interface
declare global {
  interface Window {
    va?: (action: string, params?: any) => void
    pageLoadTime?: number
  }
}

