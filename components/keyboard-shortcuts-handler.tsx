'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SHORTCUTS, HUB_TAB_SHORTCUTS, getHubShortcuts } from '@/lib/keyboard-shortcuts'

export default function KeyboardShortcutsHandler() {
  const pathname = usePathname()
  const [gPressed, setGPressed] = useState(false)
  const [sequence, setSequence] = useState<string[]>([])

  // Detect current hub from pathname
  const currentHub = pathname?.startsWith('/code')
    ? 'code'
    : pathname?.startsWith('/resume')
    ? 'resume'
    : pathname?.startsWith('/tools')
    ? 'tools'
    : pathname?.startsWith('/insights')
    ? 'insights'
    : pathname?.startsWith('/about')
    ? 'about'
    : null

  useEffect(() => {
    let gTimeout: NodeJS.Timeout
    let sequenceTimeout: NodeJS.Timeout
    let currentSequence: string[] = []

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input, textarea, or contenteditable
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('[contenteditable="true"]')
      ) {
        // Allow Escape and Ctrl/Cmd shortcuts even in inputs
        if (e.key === 'Escape' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) {
          // Let these pass through
        } else {
          return
        }
      }

      // Handle 'g' key for navigation shortcuts
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        if (!gPressed) {
          e.preventDefault()
          setGPressed(true)
          currentSequence = ['g']
          gTimeout = setTimeout(() => {
            setGPressed(false)
            currentSequence = []
          }, 1000)
          return
        }
      }

      // Handle navigation shortcuts (g + key)
      if (gPressed && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        const newSequence = [...currentSequence, e.key.toLowerCase()]
        currentSequence = newSequence
        setSequence(newSequence)

        // Check for hub-specific tab shortcuts first (g + hub + tab)
        if (currentHub && newSequence.length === 3) {
          const hubShortcuts = HUB_TAB_SHORTCUTS[currentHub]
          if (hubShortcuts) {
            const sequenceKey = newSequence.join(' ')
            const hubShortcut = hubShortcuts[sequenceKey]
            
            if (hubShortcut) {
              hubShortcut()
              setGPressed(false)
              currentSequence = []
              setSequence([])
              clearTimeout(gTimeout)
              clearTimeout(sequenceTimeout)
              return
            }
          }
        }

        // Check for simple navigation shortcuts (g + key)
        if (newSequence.length === 2) {
          const shortcutKey = newSequence.join(' ')
          const shortcut = SHORTCUTS[shortcutKey]
          
          if (shortcut) {
            shortcut.action()
            setGPressed(false)
            currentSequence = []
            setSequence([])
            clearTimeout(gTimeout)
            clearTimeout(sequenceTimeout)
            return
          }
        }

        // Reset sequence after delay if no match
        clearTimeout(sequenceTimeout)
        sequenceTimeout = setTimeout(() => {
          setGPressed(false)
          currentSequence = []
          setSequence([])
        }, 1000)
        return
      }

      // Handle single-key shortcuts (only if g is not pressed)
      if (!gPressed && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        // Question mark for help
        if (e.key === '?') {
          e.preventDefault()
          const event = new CustomEvent('show-keyboard-shortcuts')
          window.dispatchEvent(event)
          return
        }

        // Slash for search
        if (e.key === '/') {
          e.preventDefault()
          const searchInput = document.querySelector(
            'input[type="search"], input[placeholder*="search" i]'
          ) as HTMLInputElement
          if (searchInput) {
            searchInput.focus()
          } else {
            // Open command palette
            const event = new KeyboardEvent('keydown', {
              key: 'k',
              ctrlKey: true,
              bubbles: true,
            })
            document.dispatchEvent(event)
          }
          return
        }

        // 'r' for resume (only if not in input)
        if (e.key === 'r') {
          e.preventDefault()
          window.location.href = '/resume?tab=view'
          return
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(gTimeout)
      clearTimeout(sequenceTimeout)
    }
  }, [gPressed, currentHub])

  return null // This component doesn't render anything
}

