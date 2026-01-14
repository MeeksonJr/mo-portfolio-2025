/**
 * Enhanced content recommendations with viewing history
 * Tracks user viewing history and provides personalized recommendations
 */

import { ContentItem } from './smart-recommendations'

const VIEWING_HISTORY_KEY = 'content_viewing_history'
const MAX_HISTORY_ITEMS = 50

export interface ViewingHistoryItem {
  id: string
  type: string
  title: string
  viewedAt: number
  timeSpent?: number // seconds
  completed?: boolean // Did they read to the end?
}

/**
 * Track content view in viewing history
 */
export function trackContentView(item: {
  id: string
  type: string
  title: string
  timeSpent?: number
  completed?: boolean
}) {
  if (typeof window === 'undefined') return

  const history = getViewingHistory()
  
  // Remove existing entry if present
  const filtered = history.filter((h) => h.id !== item.id)
  
  // Add new entry at the beginning
  const newEntry: ViewingHistoryItem = {
    id: item.id,
    type: item.type,
    title: item.title,
    viewedAt: Date.now(),
    timeSpent: item.timeSpent,
    completed: item.completed,
  }
  
  // Keep only the most recent items
  const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS)
  
  localStorage.setItem(VIEWING_HISTORY_KEY, JSON.stringify(updated))
}

/**
 * Get viewing history
 */
export function getViewingHistory(): ViewingHistoryItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(VIEWING_HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Get recently viewed content
 */
export function getRecentlyViewed(limit: number = 5): ViewingHistoryItem[] {
  const history = getViewingHistory()
  return history.slice(0, limit)
}

/**
 * Get viewing history by type
 */
export function getViewingHistoryByType(type: string): ViewingHistoryItem[] {
  const history = getViewingHistory()
  return history.filter((item) => item.type === type)
}

/**
 * Get most viewed content types
 */
export function getMostViewedTypes(): Record<string, number> {
  const history = getViewingHistory()
  const counts: Record<string, number> = {}
  
  history.forEach((item) => {
    counts[item.type] = (counts[item.type] || 0) + 1
  })
  
  return counts
}

/**
 * Get content preferences based on viewing history
 */
export function getContentPreferences(): {
  preferredTypes: string[]
  preferredCategories: string[]
  preferredTags: string[]
} {
  const history = getViewingHistory()
  const typeCounts: Record<string, number> = {}
  const categoryCounts: Record<string, number> = {}
  const tagCounts: Record<string, number> = {}
  
  history.forEach((item) => {
    typeCounts[item.type] = (typeCounts[item.type] || 0) + 1
  })
  
  // Get most preferred types (top 3)
  const preferredTypes = Object.entries(typeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([type]) => type)
  
  return {
    preferredTypes,
    preferredCategories: [], // Would need to fetch from content
    preferredTags: [], // Would need to fetch from content
  }
}

/**
 * Clear viewing history
 */
export function clearViewingHistory() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(VIEWING_HISTORY_KEY)
}

/**
 * Get recommendation score based on viewing history
 */
export function getRecommendationScore(
  content: ContentItem,
  history: ViewingHistoryItem[]
): number {
  let score = 0
  
  // Check if user has viewed similar content
  const similarViewed = history.filter((h) => {
    if (h.type === content.type) return true
    // Could add more similarity checks here
    return false
  })
  
  if (similarViewed.length > 0) {
    score += similarViewed.length * 0.3
  }
  
  // Boost if user hasn't viewed this content yet
  const hasViewed = history.some((h) => h.id === content.id)
  if (!hasViewed) {
    score += 0.5
  }
  
  // Boost popular content
  if (content.views) {
    score += Math.log(content.views + 1) * 0.2
  }
  
  // Boost recent content
  if (content.createdAt) {
    const daysSinceCreation =
      (Date.now() - new Date(content.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    score += Math.max(0, 1 - daysSinceCreation / 30) * 0.2
  }
  
  return score
}

