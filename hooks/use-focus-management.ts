import { useEffect, useRef } from 'react'

/**
 * Hook to manage focus when tab content changes
 * Moves focus to the tab content panel for better accessibility
 */
export const useFocusManagement = (
  activeTab: string,
  tabContentId: string,
  options?: {
    skipFocus?: boolean
    focusDelay?: number
  }
) => {
  const previousTabRef = useRef<string | null>(null)
  const contentRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Skip if this is the initial render or focus should be skipped
    if (previousTabRef.current === null || options?.skipFocus) {
      previousTabRef.current = activeTab
      return
    }

    // Only move focus if tab actually changed
    if (previousTabRef.current !== activeTab) {
      const delay = options?.focusDelay ?? 100

      setTimeout(() => {
        // Try to find the tab content element
        const contentElement = document.getElementById(tabContentId)
        
        if (contentElement) {
          // Find the first focusable element in the content
          const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
          ].join(', ')

          const firstFocusable = contentElement.querySelector(focusableSelectors) as HTMLElement

          if (firstFocusable) {
            firstFocusable.focus()
          } else {
            // If no focusable element, focus the content container itself
            contentElement.setAttribute('tabindex', '-1')
            contentElement.focus()
          }
        }
      }, delay)

      previousTabRef.current = activeTab
    }
  }, [activeTab, tabContentId, options?.skipFocus, options?.focusDelay])

  return contentRef
}

