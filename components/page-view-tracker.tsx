'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'

interface PageViewTrackerProps {
  contentType?: 'blog_post' | 'case_study' | 'resource' | 'project'
  contentId?: string
}

export default function PageViewTracker({
  contentType,
  contentId,
}: PageViewTrackerProps) {
  const pathname = usePathname()
  const startTimeRef = useRef<number>(Date.now())
  const maxScrollRef = useRef<number>(0)
  const hasTrackedExit = useRef<boolean>(false)

  useEffect(() => {
    // Reset tracking on route change
    startTimeRef.current = Date.now()
    maxScrollRef.current = 0
    hasTrackedExit.current = false

    // Track page view
    trackPageView(contentType, contentId)
  }, [pathname, contentType, contentId])

  // Track scroll depth
  useEffect(() => {
    if (!contentType || !contentId) return

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = documentHeight > 0 
        ? Math.round((scrollTop / documentHeight) * 100) 
        : 0
      
      maxScrollRef.current = Math.max(maxScrollRef.current, scrollPercentage)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [contentType, contentId, pathname])

  // Track time on page and scroll depth on exit
  useEffect(() => {
    if (!contentType || !contentId) return

    const trackExit = () => {
      if (hasTrackedExit.current) return
      hasTrackedExit.current = true

      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000)
      const scrollDepth = maxScrollRef.current

      // Send analytics with metadata
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
          event_type: 'view',
          metadata: {
            timeOnPage,
            scrollDepth,
          },
        }),
      }).catch(console.error)
    }

    // Track on page unload
    window.addEventListener('beforeunload', trackExit)
    
    // Track on visibility change (tab switch)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackExit()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Track on route change (Next.js navigation)
    return () => {
      trackExit()
      window.removeEventListener('beforeunload', trackExit)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [contentType, contentId, pathname])

  return null
}

