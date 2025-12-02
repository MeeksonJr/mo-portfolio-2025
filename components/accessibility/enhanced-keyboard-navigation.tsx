'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { optimizeTabOrder, getFocusableElements } from '@/lib/keyboard-navigation'

/**
 * Enhanced Keyboard Navigation Component
 * Optimizes tab order and provides comprehensive keyboard navigation support
 */
export default function EnhancedKeyboardNavigation() {
  const pathname = usePathname()
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Wait for page to be fully loaded
    const timer = setTimeout(() => {
      const mainContent = document.getElementById('main-content')
      if (mainContent) {
        containerRef.current = mainContent

        // Optimize tab order for main content
        const config = [
          { selector: 'h1, h2', order: 1 },
          { selector: 'nav a', order: 2 },
          { selector: 'main a[href]', order: 3 },
          { selector: 'main button', order: 4 },
          { selector: 'main input', order: 5 },
          { selector: 'main textarea', order: 6 },
          { selector: 'footer a', order: 7 },
        ]

        optimizeTabOrder(mainContent, config)

        // Ensure all interactive elements have proper ARIA labels
        const interactiveElements = getFocusableElements(mainContent)
        interactiveElements.forEach((el) => {
          // Add aria-label if missing and element has no accessible name
          if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
            const textContent = el.textContent?.trim()
            const ariaLabel = el.getAttribute('aria-label')
            const title = el.getAttribute('title')

            // Only add aria-label if element has no accessible name
            if (!textContent && !ariaLabel && !title) {
              // Try to infer label from context
              const placeholder = el.getAttribute('placeholder')
              const type = el.getAttribute('type')
              const role = el.getAttribute('role')

              if (placeholder) {
                el.setAttribute('aria-label', placeholder)
              } else if (type === 'button' || role === 'button') {
                el.setAttribute('aria-label', 'Button')
              }
            }
          }

          // Ensure buttons have type attribute
          if (el.tagName === 'BUTTON' && !el.getAttribute('type')) {
            el.setAttribute('type', 'button')
          }
        })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  // Handle keyboard navigation enhancements
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // Arrow key navigation for lists and grids
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const listItem = target.closest('[role="listitem"], [role="option"], [role="gridcell"]')
        if (listItem) {
          const list = listItem.closest('[role="list"], [role="listbox"], [role="grid"]')
          if (list) {
            const items = Array.from(
              list.querySelectorAll('[role="listitem"], [role="option"], [role="gridcell"]')
            ) as HTMLElement[]

            const currentIndex = items.indexOf(listItem as HTMLElement)
            let nextIndex = currentIndex

            switch (e.key) {
              case 'ArrowDown':
              case 'ArrowRight':
                nextIndex = (currentIndex + 1) % items.length
                break
              case 'ArrowUp':
              case 'ArrowLeft':
                nextIndex = (currentIndex - 1 + items.length) % items.length
                break
            }

            if (nextIndex !== currentIndex) {
              e.preventDefault()
              items[nextIndex]?.focus()
            }
          }
        }
      }

      // Home/End key navigation
      if (e.key === 'Home' || e.key === 'End') {
        const container = target.closest('[role="list"], [role="listbox"], [role="grid"], main')
        if (container) {
          const focusableElements = getFocusableElements(container as HTMLElement)
          if (focusableElements.length > 0) {
            e.preventDefault()
            if (e.key === 'Home') {
              focusableElements[0]?.focus()
            } else {
              focusableElements[focusableElements.length - 1]?.focus()
            }
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return null // This component doesn't render anything
}

