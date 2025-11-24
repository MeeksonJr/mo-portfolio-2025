'use client'

import { Achievement } from '@/lib/achievements'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AchievementBadgeProps {
  achievement: Achievement
  unlocked: boolean
  size?: 'sm' | 'md' | 'lg'
  showTitle?: boolean
  className?: string
}

const rarityColors = {
  common: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600',
  rare: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-600',
  epic: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-600',
  legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-600',
}

const rarityColorsLocked = {
  common: 'bg-gray-50 text-gray-400 border-gray-200 dark:bg-gray-900 dark:text-gray-600 dark:border-gray-800',
  rare: 'bg-blue-50 text-blue-400 border-blue-200 dark:bg-blue-950 dark:text-blue-600 dark:border-blue-800',
  epic: 'bg-purple-50 text-purple-400 border-purple-200 dark:bg-purple-950 dark:text-purple-600 dark:border-purple-800',
  legendary: 'bg-yellow-50 text-yellow-400 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-600 dark:border-yellow-800',
}

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
}

export default function AchievementBadge({
  achievement,
  unlocked,
  size = 'md',
  showTitle = false,
  className,
}: AchievementBadgeProps) {
  const colors = unlocked ? rarityColors[achievement.rarity] : rarityColorsLocked[achievement.rarity]
  const iconOpacity = unlocked ? 'opacity-100' : 'opacity-40'

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border p-2 transition-all',
        colors,
        !unlocked && 'grayscale',
        className
      )}
      title={achievement.description}
    >
      <span className={cn('text-lg', iconOpacity)}>{achievement.icon}</span>
      {showTitle && (
        <div className="flex flex-col">
          <span className={cn('font-medium', sizeClasses[size])}>{achievement.title}</span>
          {!unlocked && (
            <span className="text-xs opacity-60">{achievement.description}</span>
          )}
        </div>
      )}
    </div>
  )
}

