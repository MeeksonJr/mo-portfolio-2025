'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import {
  Achievement,
  getAchievementState,
  unlockAchievement,
  updateProgress,
  trackPageVisit,
  trackTimeOnSite,
  ACHIEVEMENTS,
} from '@/lib/achievements'
import AchievementNotification from './achievement-notification'

export default function AchievementTracker() {
  const pathname = usePathname()
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  const checkAndUnlock = useCallback((achievementId: string): boolean => {
    const wasUnlocked = unlockAchievement(achievementId)
    if (wasUnlocked) {
      const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId)
      if (achievement) {
        setNewAchievement(achievement)
      }
      return true
    }
    return false
  }, [])

  useEffect(() => {
    // Track page visit
    if (pathname) {
      trackPageVisit(pathname)
    }
  }, [pathname])

  useEffect(() => {
    // Track time on site (check every minute)
    const interval = setInterval(() => {
      trackTimeOnSite()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  // Track specific page visits
  useEffect(() => {
    if (!pathname) return

    const state = getAchievementState()

    // Track About page visit
    if (pathname === '/about' && !state.unlocked.includes('read-bio')) {
      checkAndUnlock('read-bio')
    }

    // Track Resources page visit
    if (pathname === '/resources' && !state.unlocked.includes('view-resources')) {
      checkAndUnlock('view-resources')
    }
  }, [pathname, checkAndUnlock])

  // Expose functions for other components to use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).unlockAchievement = checkAndUnlock
      ;(window as any).updateAchievementProgress = updateProgress
    }
  }, [checkAndUnlock])

  return (
    <AchievementNotification
      achievement={newAchievement}
      onClose={() => setNewAchievement(null)}
    />
  )
}

