'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { HelpCircle, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const shortcuts = [
  { keys: ['⌘', 'K'], description: 'Open Command Palette' },
  { keys: ['⌘', 'G'], description: 'Go to GitHub Repos' },
  { keys: ['⌘', 'B'], description: 'Go to Blog Posts' },
  { keys: ['⌘', 'C'], description: 'Go to All Content' },
  { keys: ['⌘', 'P'], description: 'Go to Projects' },
  { keys: ['⌘', 'A'], description: 'Go to AI Tools' },
  { keys: ['⌘', '⇧', 'N'], description: 'Create New Blog Post' },
  { keys: ['⌘', ','], description: 'Go to Settings' },
  { keys: ['?'], description: 'Show Keyboard Shortcuts' },
]

export default function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        // Don't trigger when typing in inputs
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return
        }
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Keyboard shortcuts help"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              Use these shortcuts to navigate the admin panel quickly
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <span className="text-sm text-muted-foreground">
                  {shortcut.description}
                </span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <Badge
                      key={keyIndex}
                      variant="outline"
                      className="font-mono text-xs px-2 py-1"
                    >
                      {key}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Press <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd>{' '}
              anytime to toggle this help
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
