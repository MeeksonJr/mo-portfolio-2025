/**
 * Smart Recommendations System
 * AI-powered content recommendations based on user behavior and content similarity
 */

export interface ContentItem {
  id: string
  title: string
  description?: string
  tags?: string[]
  category?: string
  type: 'blog' | 'project' | 'case-study' | 'resource'
  views?: number
  createdAt?: string
}

interface UserBehavior {
  viewedItems: string[]
  clickedItems: string[]
  searchQueries: string[]
  timeSpent: Record<string, number>
}

/**
 * Calculate content similarity based on tags and categories
 */
function calculateSimilarity(item1: ContentItem, item2: ContentItem): number {
  let score = 0

  // Same type bonus
  if (item1.type === item2.type) {
    score += 0.3
  }

  // Tag similarity
  if (item1.tags && item2.tags) {
    const tags1 = new Set(item1.tags.map((t) => t.toLowerCase()))
    const tags2 = new Set(item2.tags.map((t) => t.toLowerCase()))
    const intersection = new Set([...tags1].filter((x) => tags2.has(x)))
    const union = new Set([...tags1, ...tags2])
    const tagSimilarity = union.size > 0 ? intersection.size / union.size : 0
    score += tagSimilarity * 0.4
  }

  // Category similarity
  if (item1.category && item2.category && item1.category === item2.category) {
    score += 0.2
  }

  // Description similarity (simple keyword matching)
  if (item1.description && item2.description) {
    const words1 = new Set(item1.description.toLowerCase().split(/\s+/))
    const words2 = new Set(item2.description.toLowerCase().split(/\s+/))
    const commonWords = new Set([...words1].filter((x) => words2.has(x)))
    const allWords = new Set([...words1, ...words2])
    const wordSimilarity = allWords.size > 0 ? commonWords.size / allWords.size : 0
    score += wordSimilarity * 0.1
  }

  return Math.min(score, 1)
}

/**
 * Get recommendations based on content similarity
 */
export function getSimilarContent(
  currentItem: ContentItem,
  allContent: ContentItem[],
  limit: number = 3
): ContentItem[] {
  // Calculate similarity scores
  const scored = allContent
    .filter((item) => item.id !== currentItem.id)
    .map((item) => ({
      item,
      score: calculateSimilarity(currentItem, item),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item)

  return scored
}

/**
 * Get personalized recommendations based on user behavior
 */
export function getPersonalizedRecommendations(
  userBehavior: UserBehavior,
  allContent: ContentItem[],
  limit: number = 5
): ContentItem[] {
  const viewedSet = new Set(userBehavior.viewedItems)
  const clickedSet = new Set(userBehavior.clickedItems)

  // Get viewed items
  const viewedItems = allContent.filter((item) => viewedSet.has(item.id))

  // Calculate scores based on behavior
  const scored = allContent
    .filter((item) => !viewedSet.has(item.id)) // Don't recommend already viewed
    .map((item) => {
      let score = 0

      // Boost items similar to viewed content
      viewedItems.forEach((viewed) => {
        score += calculateSimilarity(item, viewed) * 0.5
      })

      // Boost items similar to clicked content (higher weight)
      const clickedItems = allContent.filter((c) => clickedSet.has(c.id))
      clickedItems.forEach((clicked) => {
        score += calculateSimilarity(item, clicked) * 0.8
      })

      // Boost popular content
      if (item.views) {
        score += Math.log(item.views + 1) * 0.1
      }

      // Boost recent content
      if (item.createdAt) {
        const daysSinceCreation =
          (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        score += Math.max(0, 1 - daysSinceCreation / 30) * 0.2 // Decay over 30 days
      }

      return { item, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item)

  return scored
}

/**
 * Get recommendations based on search query
 */
export function getSearchBasedRecommendations(
  query: string,
  allContent: ContentItem[],
  limit: number = 5
): ContentItem[] {
  const queryWords = new Set(query.toLowerCase().split(/\s+/))

  const scored = allContent
    .map((item) => {
      let score = 0

      // Title match
      const titleWords = new Set(item.title.toLowerCase().split(/\s+/))
      const titleMatch = [...queryWords].filter((w) => titleWords.has(w)).length
      score += (titleMatch / queryWords.size) * 0.5

      // Description match
      if (item.description) {
        const descWords = new Set(item.description.toLowerCase().split(/\s+/))
        const descMatch = [...queryWords].filter((w) => descWords.has(w)).length
        score += (descMatch / queryWords.size) * 0.3
      }

      // Tag match
      if (item.tags) {
        const tagWords = new Set(item.tags.map((t) => t.toLowerCase()))
        const tagMatch = [...queryWords].filter((w) => tagWords.has(w)).length
        score += (tagMatch / queryWords.size) * 0.2
      }

      return { item, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item)

  return scored
}

/**
 * Get trending content
 */
export function getTrendingContent(
  allContent: ContentItem[],
  limit: number = 5,
  days: number = 7
): ContentItem[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return allContent
    .filter((item) => {
      if (!item.createdAt) return false
      return new Date(item.createdAt) >= cutoffDate
    })
    .sort((a, b) => {
      // Sort by views, then by recency
      const viewDiff = (b.views || 0) - (a.views || 0)
      if (viewDiff !== 0) return viewDiff

      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return 0
    })
    .slice(0, limit)
}

/**
 * Get "You might also like" recommendations
 */
export function getYouMightAlsoLike(
  currentItem: ContentItem,
  allContent: ContentItem[],
  userBehavior?: UserBehavior,
  limit: number = 3
): ContentItem[] {
  // Start with similar content
  let recommendations = getSimilarContent(currentItem, allContent, limit * 2)

  // If user behavior is available, personalize
  if (userBehavior) {
    const personalized = getPersonalizedRecommendations(userBehavior, allContent, limit * 2)
    // Merge and deduplicate
    const recommendationMap = new Map<string, ContentItem>()
    
    personalized.forEach((item) => {
      recommendationMap.set(item.id, item)
    })
    
    recommendations.forEach((item) => {
      if (!recommendationMap.has(item.id)) {
        recommendationMap.set(item.id, item)
      }
    })

    recommendations = Array.from(recommendationMap.values()).slice(0, limit)
  }

  return recommendations.slice(0, limit)
}

