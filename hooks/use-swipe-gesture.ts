'use client'

import { useEffect, useRef, useState } from 'react'

interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  preventDefault?: boolean
}

export function useSwipeGesture(options: SwipeGestureOptions) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefault = false,
  } = options

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleTouchStart = (e: TouchEvent) => {
      if (preventDefault) {
        e.preventDefault()
      }
      const touch = e.touches[0]
      touchStartX.current = touch.clientX
      touchStartY.current = touch.clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartX.current
      const deltaY = touch.clientY - touchStartY.current

      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      // Determine if horizontal or vertical swipe
      if (absX > absY) {
        // Horizontal swipe
        if (absX > threshold) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight()
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft()
          }
        }
      } else {
        // Vertical swipe
        if (absY > threshold) {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown()
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp()
          }
        }
      }

      touchStartX.current = null
      touchStartY.current = null
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault })
    element.addEventListener('touchend', handleTouchEnd, { passive: !preventDefault })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, preventDefault])

  return elementRef
}
