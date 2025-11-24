'use client'

import { useCallback } from 'react'
import { unlockAchievement, updateProgress } from '@/lib/achievements'

export const useAchievementTracking = () => {
  const trackAchievement = useCallback((achievementId: string) => {
    if (typeof window !== 'undefined') {
      const wasUnlocked = unlockAchievement(achievementId)
      if (wasUnlocked && (window as any).unlockAchievement) {
        // Trigger notification via global function
        ;(window as any).unlockAchievement(achievementId)
      }
      return wasUnlocked
    }
    return false
  }, [])

  const trackProgress = useCallback(
    (achievementId: string, progress: number, maxProgress: number) => {
      if (typeof window !== 'undefined') {
        const wasUnlocked = updateProgress(achievementId, progress, maxProgress)
        if (wasUnlocked && (window as any).unlockAchievement) {
          ;(window as any).unlockAchievement(achievementId)
        }
        return wasUnlocked
      }
      return false
    },
    []
  )

  return { trackAchievement, trackProgress }
}

