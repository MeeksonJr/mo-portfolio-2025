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
import { updateStreak, getStreakAchievement } from '@/lib/achievement-streaks'
import AchievementNotification from './achievement-notification'

export default function AchievementTracker() {
  const pathname = usePathname()
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  const checkAndUnlock = useCallback((achievementId: string): boolean => {
    console.log('🔍 Checking achievement:', achievementId)
    const state = getAchievementState()
    
    // Check if already unlocked
    if (state.unlocked.includes(achievementId)) {
      console.log('✅ Achievement already unlocked:', achievementId)
      return false
    }
    
    const wasUnlocked = unlockAchievement(achievementId)
    if (wasUnlocked) {
      const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId)
      if (achievement) {
        console.log('🎉 Achievement unlocked:', achievement.title)
        // Use setTimeout to ensure state update happens
        setTimeout(() => {
          setNewAchievement(achievement)
        }, 100)
      }
      return true
    }
    return false
  }, [])

  useEffect(() => {
    // Track page visit
    if (pathname) {
      trackPageVisit(pathname)
      // Update streak on page visit
      const { isNewStreak, streak } = updateStreak()
      if (isNewStreak && streak > 0) {
        // Check for streak achievements
        const streakAchievementId = getStreakAchievement(streak)
        if (streakAchievementId) {
          checkAndUnlock(streakAchievementId)
        }
      }
    }
  }, [pathname, checkAndUnlock])

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

    // Use a small delay to ensure page is fully loaded
    const timer = setTimeout(() => {
      const state = getAchievementState()

      // Track About page visit
      if (pathname === '/about' && !state.unlocked.includes('read-bio')) {
        console.log('📖 Tracking About page visit for achievement')
        checkAndUnlock('read-bio')
      }

      // Track Resources page visit
      if (pathname === '/resources' && !state.unlocked.includes('view-resources')) {
        console.log('📚 Tracking Resources page visit for achievement')
        checkAndUnlock('view-resources')
      }
    }, 500) // Wait 500ms for page to load

    return () => clearTimeout(timer)
  }, [pathname, checkAndUnlock])

  // Expose functions for other components to use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).unlockAchievement = (achievementId: string) => {
        console.log('🔓 Attempting to unlock achievement:', achievementId)
        return checkAndUnlock(achievementId)
      }
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

