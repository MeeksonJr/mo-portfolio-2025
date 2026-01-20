'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { Keyboard, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { hasKeyboard } from '@/lib/pwa-utils'

export default function KeyboardShortcutHint() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasSeenHint, setHasSeenHint] = useState(false)
  const [hasKeyboardDevice, setHasKeyboardDevice] = useState(false)
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if device has a keyboard
    if (typeof window !== 'undefined') {
      const checkKeyboard = () => {
        const hasKb = hasKeyboard()
        setHasKeyboardDevice(hasKb)
        
        // Only proceed if device has keyboard
        if (!hasKb) {
          setHasSeenHint(true)
          return
        }
        
        // Check if user has seen the hint before
        const seen = localStorage.getItem('keyboard-shortcut-hint-seen')
        if (!seen) {
          // Show hint after 3 seconds on first visit
          timerRef.current = setTimeout(() => {
            setIsVisible(true)
            
            // Auto-close after 3 seconds
            timerRef.current = setTimeout(() => {
              setIsVisible(false)
              setTimeout(() => {
                localStorage.setItem('keyboard-shortcut-hint-seen', 'true')
                setHasSeenHint(true)
              }, 300) // Wait for animation to complete
            }, 3000)
          }, 3000)
        } else {
          setHasSeenHint(true)
        }
      }
      
      checkKeyboard()
      
      // Re-check on resize (e.g., device rotation, window resize)
      const handleResize = () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
        checkKeyboard()
      }
      
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('resize', handleResize)
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
      }
    }
  }, [])

  const handleDismiss = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setIsVisible(false)
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        localStorage.setItem('keyboard-shortcut-hint-seen', 'true')
        setHasSeenHint(true)
      }, 300) // Wait for animation to complete
    }
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50
    const velocityThreshold = 500

    // Check horizontal swipe (left or right)
    if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > velocityThreshold) {
      // Swiped left or right - close the notification
      handleDismiss()
    }
  }

  // Don't show if device doesn't have keyboard or user has seen it
  if (!hasKeyboardDevice || hasSeenHint) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9, x: dragDirection === 'left' ? -100 : dragDirection === 'right' ? 100 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-20 sm:bottom-24 left-4 z-[100] w-full max-w-sm"
          drag="x"
          dragConstraints={{ left: -200, right: 200 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          onDrag={(event, info) => {
            // Track drag direction for exit animation
            if (info.offset.x > 0) {
              setDragDirection('right')
            } else if (info.offset.x < 0) {
              setDragDirection('left')
            }
          }}
          style={{ touchAction: 'pan-y' }}
        >
          <div className="relative rounded-lg border bg-card p-4 shadow-lg">
            {/* Swipe indicator */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/50 pointer-events-none">
              ← Swipe to dismiss →
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6 z-10"
              onClick={handleDismiss}
              aria-label="Dismiss hint"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex items-start gap-3 pr-8 mt-2">
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
