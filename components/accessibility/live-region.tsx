'use client'

import { useEffect, useRef } from 'react'

interface LiveRegionProps {
  message: string
  priority?: 'polite' | 'assertive'
  clearOnUnmount?: boolean
}

/**
 * LiveRegion component for screen reader announcements
 * Announces dynamic content changes to screen readers
 */
export default function LiveRegion({ message, priority = 'polite', clearOnUnmount = true }: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (message && regionRef.current) {
      // Clear previous message
      regionRef.current.textContent = ''
      // Small delay to ensure screen reader picks up the change
      setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = message
        }
      }, 100)
    }
  }, [message])

  useEffect(() => {
    return () => {
      if (clearOnUnmount && regionRef.current) {
        regionRef.current.textContent = ''
      }
    }
  }, [clearOnUnmount])

  return (
    <div
      ref={regionRef}
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

/**
 * Hook for announcing messages to screen readers
 * Uses the global live region in app layout
 */
export function useScreenReaderAnnouncement() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (typeof window === 'undefined') return
    
    const region = document.getElementById('screen-reader-announcements')
    if (region) {
      // Update priority if needed
      if (region.getAttribute('aria-live') !== priority) {
        region.setAttribute('aria-live', priority)
      }
      
      // Clear and set new message with small delay for screen reader to pick up
      region.textContent = ''
      setTimeout(() => {
        if (region) {
          region.textContent = message
        }
      }, 100)
    }
  }

  return { announce }
}
