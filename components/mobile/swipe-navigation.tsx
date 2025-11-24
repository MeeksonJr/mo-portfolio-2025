'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSwipeGesture } from '@/hooks/use-swipe-gesture'

interface SwipeNavigationProps {
  enabled?: boolean
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

export function SwipeNavigation({ enabled = true, onSwipeLeft, onSwipeRight }: SwipeNavigationProps) {
  const router = useRouter()
  const swipeRef = useSwipeGesture({
    onSwipeLeft: onSwipeLeft || (() => {
      // Default: go back in history
      if (window.history.length > 1) {
        router.back()
      }
    }),
    onSwipeRight: onSwipeRight || (() => {
      // Default: go forward in history
      if (window.history.length > 1) {
        router.forward()
      }
    }),
    threshold: 100, // Minimum swipe distance
    velocity: 0.3, // Minimum swipe velocity
    preventDefault: false, // Don't prevent default to allow scrolling
  })

  useEffect(() => {
    if (!enabled) return

    // Apply swipe gesture to the main content area
    const mainContent = document.querySelector('main')
    if (mainContent && swipeRef.current === null) {
      // @ts-ignore - We'll attach the ref manually
      swipeRef.current = mainContent
    }

    return () => {
      // Cleanup if needed
    }
  }, [enabled, swipeRef])

  // This component doesn't render anything, it just adds gesture handlers
  return null
}

