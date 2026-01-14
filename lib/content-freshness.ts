/**
 * Content freshness utilities
 * Determines if content is "new" or shows last updated date
 */

const NEW_CONTENT_DAYS = 30 // Content is considered "new" if published within last 30 days

export interface ContentFreshness {
  isNew: boolean
  daysSincePublished: number
  lastUpdated?: Date
  publishedDate?: Date
}

/**
 * Check if content is new (published within last N days)
 */
export function isContentNew(publishedAt: string | Date | null): boolean {
  if (!publishedAt) return false
  
  const published = typeof publishedAt === 'string' ? new Date(publishedAt) : publishedAt
  const now = new Date()
  const diffTime = now.getTime() - published.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays <= NEW_CONTENT_DAYS
}

/**
 * Get days since content was published
 */
export function getDaysSincePublished(publishedAt: string | Date | null): number {
  if (!publishedAt) return 0
  
  const published = typeof publishedAt === 'string' ? new Date(publishedAt) : publishedAt
  const now = new Date()
  const diffTime = now.getTime() - published.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Format relative time (e.g., "2 days ago", "3 weeks ago")
 */
export function formatRelativeTime(date: string | Date | null): string {
  if (!date) return ''
  
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffTime = now.getTime() - targetDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  }
  const years = Math.floor(diffDays / 365)
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}

/**
 * Get content freshness info
 */
export function getContentFreshness(
  publishedAt: string | Date | null,
  updatedAt?: string | Date | null
): ContentFreshness {
  const published = publishedAt ? (typeof publishedAt === 'string' ? new Date(publishedAt) : publishedAt) : undefined
  const updated = updatedAt ? (typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt) : undefined
  
  return {
    isNew: isContentNew(publishedAt),
    daysSincePublished: getDaysSincePublished(publishedAt),
    lastUpdated: updated || undefined,
    publishedDate: published,
  }
}

