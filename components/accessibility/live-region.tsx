'use client'

import { useEffect, useRef } from 'react'

interface LiveRegionProps {
  message: string
  priority?: 'polite' | 'assertive'
  id?: string
}

export default function LiveRegion({ message, priority = 'polite', id = 'live-region' }: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (message && regionRef.current) {
      // Clear previous message
      regionRef.current.textContent = ''
      // Set new message after a brief delay to ensure screen readers pick it up
      setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = message
        }
      }, 100)
    }
  }, [message])

  const ariaProps = priority === 'assertive' 
    ? { 'aria-live': 'assertive' as const }
    : { 'aria-live': 'polite' as const }

  return (
    <div
      ref={regionRef}
      id={id}
      role="status"
      {...ariaProps}
      aria-atomic="true"
      className="sr-only"
    />
  )
}

