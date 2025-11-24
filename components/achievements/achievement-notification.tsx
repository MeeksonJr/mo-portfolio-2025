'use client'

import { useEffect, useState } from 'react'
import { Achievement } from '@/lib/achievements'
import { motion, AnimatePresence } from 'framer-motion'
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

  useEffect(() => {
    if (achievement) {
      console.log('🔔 Showing achievement notification:', achievement.title)
      setIsVisible(true)
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, 5000)

      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 right-4 z-50 w-full max-w-sm"
        >
          <div className="relative rounded-lg border bg-card p-4 shadow-lg">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={() => {
                setIsVisible(false)
                setTimeout(onClose, 300)
              }}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex items-start gap-3 pr-8">
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

