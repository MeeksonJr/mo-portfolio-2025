import { useEffect, useRef } from 'react'

/**
 * Hook to add keyboard navigation to tab components
 * Supports arrow keys for tab navigation
 */
export const useTabKeyboardNavigation = (
  tabs: Array<{ value: string }>,
  activeTab: string,
  onTabChange: (value: string) => void,
  containerId?: string
) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerId 
      ? document.getElementById(containerId)
      : containerRef.current

    if (!container) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if focus is within the tab container
      if (!container?.contains(document.activeElement)) return

      const currentIndex = tabs.findIndex(tab => tab.value === activeTab)
      if (currentIndex === -1) return

      let newIndex = currentIndex

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          newIndex = (currentIndex + 1) % tabs.length
          onTabChange(tabs[newIndex].value)
          // Focus the new tab
          setTimeout(() => {
            const newTab = container.querySelector(`[id="${tabs[newIndex].value}-tab"]`) as HTMLElement
            newTab?.focus()
          }, 0)
          break

        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          newIndex = (currentIndex - 1 + tabs.length) % tabs.length
          onTabChange(tabs[newIndex].value)
          // Focus the new tab
          setTimeout(() => {
            const newTab = container.querySelector(`[id="${tabs[newIndex].value}-tab"]`) as HTMLElement
            newTab?.focus()
          }, 0)
          break

        case 'Home':
          e.preventDefault()
          if (tabs.length > 0) {
            onTabChange(tabs[0].value)
            setTimeout(() => {
              const firstTab = container.querySelector(`[id="${tabs[0].value}-tab"]`) as HTMLElement
              firstTab?.focus()
            }, 0)
          }
          break

        case 'End':
          e.preventDefault()
          if (tabs.length > 0) {
            const lastTab = tabs[tabs.length - 1]
            onTabChange(lastTab.value)
            setTimeout(() => {
              const lastTabElement = container.querySelector(`[id="${lastTab.value}-tab"]`) as HTMLElement
              lastTabElement?.focus()
            }, 0)
          }
          break
      }
    }

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [tabs, activeTab, onTabChange, containerId])

  return containerRef
}

