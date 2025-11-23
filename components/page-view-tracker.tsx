'use client'

import { useEffect } from 'react'
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

  useEffect(() => {
    // Track page view
    trackPageView(contentType, contentId)
  }, [pathname, contentType, contentId])

  return null
}

