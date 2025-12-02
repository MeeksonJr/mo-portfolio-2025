/**
 * Enhanced Keyboard Navigation Utilities
 * Provides comprehensive keyboard navigation support with tab order optimization
 */

export interface TabOrderConfig {
  selector: string
  order: number
  skip?: boolean
}

/**
 * Optimize tab order for a container
 * Ensures logical tab order for keyboard navigation
 */
export function optimizeTabOrder(container: HTMLElement, config: TabOrderConfig[]) {
  const elements = config
    .filter((c) => !c.skip)
    .sort((a, b) => a.order - b.order)
    .map((c) => container.querySelector(c.selector) as HTMLElement)
    .filter((el) => el !== null)

  elements.forEach((el, index) => {
    // Set tabindex to ensure proper order
    if (el.getAttribute('tabindex') === null) {
      el.setAttribute('tabindex', index === 0 ? '0' : String(index))
    }
  })

  return elements
}

/**
 * Get all focusable elements in a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ')

  return Array.from(container.querySelectorAll(selectors)) as HTMLElement[]
}

/**
 * Trap focus within a container (for modals, dialogs)
 */
export function trapFocus(container: HTMLElement) {
  const focusableElements = getFocusableElements(container)
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown)

  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Restore focus to a previously focused element
 */
export function restoreFocus(previousElement: HTMLElement | null) {
  if (previousElement && document.contains(previousElement)) {
    previousElement.focus()
  }
}

/**
 * Save current focus for later restoration
 */
export function saveFocus(): HTMLElement | null {
  return document.activeElement as HTMLElement
}

/**
 * Focus first element in container
 */
export function focusFirst(container: HTMLElement) {
  const focusableElements = getFocusableElements(container)
  focusableElements[0]?.focus()
}

/**
 * Focus last element in container
 */
export function focusLast(container: HTMLElement) {
  const focusableElements = getFocusableElements(container)
  const lastElement = focusableElements[focusableElements.length - 1]
  lastElement?.focus()
}

/**
 * Focus next element in tab order
 */
export function focusNext(currentElement: HTMLElement) {
  const allFocusable = getFocusableElements(document.body)
  const currentIndex = allFocusable.indexOf(currentElement)
  const nextElement = allFocusable[currentIndex + 1]
  nextElement?.focus()
}

/**
 * Focus previous element in tab order
 */
export function focusPrevious(currentElement: HTMLElement) {
  const allFocusable = getFocusableElements(document.body)
  const currentIndex = allFocusable.indexOf(currentElement)
  const previousElement = allFocusable[currentIndex - 1]
  previousElement?.focus()
}

