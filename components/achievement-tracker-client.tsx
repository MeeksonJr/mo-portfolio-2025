'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface AchievementTrackerClientProps {
  achievementId?: string
  progressId?: string
  progress?: number
  maxProgress?: number
}

export default function AchievementTrackerClient({
  achievementId,
  progressId,
  progress,
  maxProgress,
}: AchievementTrackerClientProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Track achievement unlock
    if (achievementId && (window as any).unlockAchievement) {
      ;(window as any).unlockAchievement(achievementId)
    }

    // Track progress
    if (progressId && progress !== undefined && maxProgress !== undefined && (window as any).updateAchievementProgress) {
      ;(window as any).updateAchievementProgress(progressId, progress, maxProgress)
    }
  }, [achievementId, progressId, progress, maxProgress, pathname])

  return null
}

