'use client'

import { useEffect, useState, useRef } from 'react'
import { Achievement } from '@/lib/achievements'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface AchievementNotificationProps {
  achievement: Achievement | null
  onClose: () => void
}

export default function AchievementNotification({
  achievement,
  onClose,
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (achievement) {
      console.log('🔔 Showing achievement notification:', achievement.title)
      setIsVisible(true)
      
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      
      // Auto-close after 3 seconds
      timerRef.current = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, 3000)

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
      }
    } else {
      setIsVisible(false)
    }
  }, [achievement, onClose])

  const handleClose = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50
    const velocityThreshold = 500

    // Check horizontal swipe (left or right)
    if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > velocityThreshold) {
      // Swiped left or right - close the notification
      handleClose()
    }
  }

  if (!achievement) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9, x: dragDirection === 'left' ? -100 : dragDirection === 'right' ? 100 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-20 sm:bottom-24 right-4 left-4 sm:left-auto z-[100] w-full sm:max-w-sm"
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
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex items-start gap-3 pr-8 mt-2">
              <div className="text-4xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="mb-1 text-sm font-semibold text-muted-foreground">
                  Achievement Unlocked!
                </div>
                <div className="mb-2 text-lg font-bold">{achievement.title}</div>
                <div className="text-sm text-muted-foreground">{achievement.description}</div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {achievement.rarity.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    +{achievement.points} points
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
