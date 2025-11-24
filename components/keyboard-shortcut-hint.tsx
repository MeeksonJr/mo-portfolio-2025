'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function KeyboardShortcutHint() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasSeenHint, setHasSeenHint] = useState(false)

  useEffect(() => {
    // Check if user has seen the hint before
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('keyboard-shortcut-hint-seen')
      if (!seen) {
        // Show hint after 3 seconds on first visit
        const timer = setTimeout(() => {
          setIsVisible(true)
        }, 3000)
        return () => clearTimeout(timer)
      } else {
        setHasSeenHint(true)
      }
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('keyboard-shortcut-hint-seen', 'true')
      setHasSeenHint(true)
    }
  }

  if (hasSeenHint) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-4 z-50 w-full max-w-sm"
        >
          <div className="relative rounded-lg border bg-card p-4 shadow-lg">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={handleDismiss}
              aria-label="Dismiss hint"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex items-start gap-3 pr-8">
              <Keyboard className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <div className="mb-1 text-sm font-semibold">Keyboard Shortcut</div>
                <div className="text-sm text-muted-foreground mb-2">
                  Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Ctrl+K</kbd> or <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Cmd+K</kbd> to open the command palette
                </div>
                <div className="text-xs text-muted-foreground">
                  Quick navigation and actions
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

