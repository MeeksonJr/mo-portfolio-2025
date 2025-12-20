'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description: string
}

export function useAdminKeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const shortcuts: KeyboardShortcut[] = [
      {
        key: 'g',
        metaKey: true,
        action: () => router.push('/admin/github'),
        description: 'Go to GitHub Repos',
      },
      {
        key: 'b',
        metaKey: true,
        action: () => router.push('/admin/content/blog'),
        description: 'Go to Blog Posts',
      },
      {
        key: 'c',
        metaKey: true,
        action: () => router.push('/admin/content'),
        description: 'Go to All Content',
      },
      {
        key: 'p',
        metaKey: true,
        action: () => router.push('/admin/content/projects'),
        description: 'Go to Projects',
      },
      {
        key: 'a',
        metaKey: true,
        action: () => router.push('/admin/ai'),
        description: 'Go to AI Tools',
      },
      {
        key: 'n',
        metaKey: true,
        shiftKey: true,
        action: () => router.push('/admin/content/blog/new'),
        description: 'Create New Blog Post',
      },
      {
        key: ',',
        metaKey: true,
        action: () => router.push('/admin/settings'),
        description: 'Go to Settings',
      },
      {
        key: 'k',
        metaKey: true,
        action: () => {
          // Trigger command palette - this would need to be implemented
          const event = new KeyboardEvent('keydown', {
            key: 'k',
            metaKey: true,
            bubbles: true,
          })
          document.dispatchEvent(event)
        },
        description: 'Open Command Palette',
      },
    ]

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return
      }

      const shortcut = shortcuts.find((s) => {
        return (
          s.key.toLowerCase() === e.key.toLowerCase() &&
          !!s.ctrlKey === (e.ctrlKey || e.metaKey) &&
          !!s.metaKey === (e.metaKey || e.ctrlKey) &&
          !!s.shiftKey === e.shiftKey &&
          !!s.altKey === e.altKey
        )
      })

      if (shortcut) {
        e.preventDefault()
        shortcut.action()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [router])
}
