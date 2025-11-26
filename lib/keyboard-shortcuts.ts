/**
 * Keyboard Shortcuts System
 * Handles all keyboard shortcuts for navigation and actions
 */

import { useRouter } from 'next/navigation'

export interface KeyboardShortcut {
  key: string
  description: string
  category: 'navigation' | 'hubs' | 'actions' | 'global'
  action: () => void
  modifiers?: {
    ctrl?: boolean
    meta?: boolean
    shift?: boolean
    alt?: boolean
  }
}

export const SHORTCUTS: Record<string, KeyboardShortcut> = {
  // Global shortcuts
  'ctrl+k': {
    key: 'Ctrl+K / Cmd+K',
    description: 'Open command palette',
    category: 'global',
    action: () => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      })
      document.dispatchEvent(event)
    },
  },
  'ctrl+s': {
    key: 'Ctrl+S / Cmd+S',
    description: 'Open global search',
    category: 'global',
    action: () => {
      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true,
      })
      document.dispatchEvent(event)
    },
  },
  'escape': {
    key: 'Esc',
    description: 'Close modals/overlays',
    category: 'global',
    action: () => {
      // Close any open modals
      const modals = document.querySelectorAll('[role="dialog"]')
      modals.forEach((modal) => {
        const closeButton = modal.querySelector('[aria-label*="close" i], [aria-label*="Close"]')
        if (closeButton instanceof HTMLElement) {
          closeButton.click()
        }
      })
    },
  },

  // Navigation shortcuts (g + key)
  'g+h': {
    key: 'g h',
    description: 'Go to home',
    category: 'navigation',
    action: () => {
      window.location.href = '/'
    },
  },
  'g+a': {
    key: 'g a',
    description: 'Go to About Hub',
    category: 'navigation',
    action: () => {
      window.location.href = '/about'
    },
  },
  'g+p': {
    key: 'g p',
    description: 'Go to projects',
    category: 'navigation',
    action: () => {
      window.location.href = '/projects'
    },
  },
  'g+b': {
    key: 'g b',
    description: 'Go to blog',
    category: 'navigation',
    action: () => {
      window.location.href = '/blog'
    },
  },
  'g+c': {
    key: 'g c',
    description: 'Go to Code Hub',
    category: 'hubs',
    action: () => {
      window.location.href = '/code'
    },
  },
  'g+r': {
    key: 'g r',
    description: 'Go to Resume Hub',
    category: 'hubs',
    action: () => {
      window.location.href = '/resume'
    },
  },
  'g+t': {
    key: 'g t',
    description: 'Go to Tools Hub',
    category: 'hubs',
    action: () => {
      window.location.href = '/tools'
    },
  },
  'g+i': {
    key: 'g i',
    description: 'Go to Insights Hub',
    category: 'hubs',
    action: () => {
      window.location.href = '/insights'
    },
  },

  // Action shortcuts
  '?': {
    key: '?',
    description: 'Show keyboard shortcuts help',
    category: 'actions',
    action: () => {
      // Trigger keyboard shortcuts modal
      const event = new CustomEvent('show-keyboard-shortcuts')
      window.dispatchEvent(event)
    },
  },
  '/': {
    key: '/',
    description: 'Focus search',
    category: 'actions',
    action: () => {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
      } else {
        // Open command palette if no search input found
        const event = new KeyboardEvent('keydown', {
          key: 'k',
          ctrlKey: true,
          bubbles: true,
        })
        document.dispatchEvent(event)
      }
    },
  },
  'r': {
    key: 'r',
    description: 'Download resume',
    category: 'actions',
    action: () => {
      window.location.href = '/resume?tab=view'
    },
  },
}

// Hub-specific tab shortcuts (context-aware)
// Format: 'g hub tab' (e.g., 'g c p' for code playground)
export const HUB_TAB_SHORTCUTS: Record<string, Record<string, () => void>> = {
  code: {
    'g c p': () => (window.location.href = '/code?tab=playground'),
    'g c r': () => (window.location.href = '/code?tab=review'),
    'g c o': () => (window.location.href = '/code?tab=portfolio'),
    'g c t': () => (window.location.href = '/code?tab=terminal'),
    'g c l': () => (window.location.href = '/code?tab=library'),
  },
  resume: {
    'g r v': () => (window.location.href = '/resume?tab=view'),
    'g r g': () => (window.location.href = '/resume?tab=generate'),
    'g r s': () => (window.location.href = '/resume?tab=summary'),
  },
  tools: {
    'g t a': () => (window.location.href = '/tools?tab=analyzer'),
    'g t s': () => (window.location.href = '/tools?tab=skills'),
    'g t r': () => (window.location.href = '/tools?tab=roi'),
    'g t e': () => (window.location.href = '/tools?tab=assessment'),
    'g t c': () => (window.location.href = '/tools?tab=contact'),
    'g t b': () => (window.location.href = '/tools?tab=card'),
  },
  insights: {
    'g i a': () => (window.location.href = '/insights?tab=analytics'),
    'g i c': () => (window.location.href = '/insights?tab=activity'),
    'g i r': () => (window.location.href = '/insights?tab=recommendations'),
    'g i t': () => (window.location.href = '/insights?tab=timeline'),
    'g i s': () => (window.location.href = '/insights?tab=skills'),
  },
  about: {
    'g a b': () => (window.location.href = '/about?tab=bio'),
    'g a u': () => (window.location.href = '/about?tab=uses'),
    'g a o': () => (window.location.href = '/about?tab=office'),
    'g a s': () => (window.location.href = '/about?tab=activity'),
    'g a p': () => (window.location.href = '/about?tab=progress'),
    'g a l': () => (window.location.href = '/about?tab=learning'),
    'g a d': () => (window.location.href = '/about?tab=dashboard'),
  },
}

/**
 * Get all shortcuts grouped by category
 */
export const getShortcutsByCategory = () => {
  const categories: Record<string, KeyboardShortcut[]> = {
    global: [],
    navigation: [],
    hubs: [],
    actions: [],
  }

  Object.values(SHORTCUTS).forEach((shortcut) => {
    categories[shortcut.category].push(shortcut)
  })

  return categories
}

/**
 * Get hub-specific shortcuts for current page
 */
export const getHubShortcuts = (hub: 'code' | 'resume' | 'tools' | 'insights' | 'about' | null) => {
  if (!hub || !HUB_TAB_SHORTCUTS[hub]) return []
  
  return Object.entries(HUB_TAB_SHORTCUTS[hub]).map(([key, action]) => ({
    key,
    action,
    description: `Navigate to ${key.split(' ').pop()} tab`,
  }))
}

