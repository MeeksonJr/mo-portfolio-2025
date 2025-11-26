/**
 * Reading List System
 * Allows users to save content for later reading with progress tracking
 */

export type ReadingListType = 'blog' | 'case-study' | 'resource'

export interface ReadingListItem {
  id: string
  type: ReadingListType
  contentId: string
  title: string
  url: string
  description?: string
  image?: string
  category?: string
  addedAt: string
  readAt?: string
  progress: number // 0-100
  notes?: string
}

const STORAGE_KEY = 'portfolio-reading-list'

/**
 * Get all reading list items
 */
export function getReadingList(): ReadingListItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading reading list:', error)
  }

  return []
}

/**
 * Save reading list to localStorage
 */
function saveReadingList(items: ReadingListItem[]): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Error saving reading list:', error)
  }
}

/**
 * Add item to reading list
 */
export function addToReadingList(
  item: Omit<ReadingListItem, 'id' | 'addedAt' | 'progress' | 'readAt'>
): boolean {
  const items = getReadingList()

  // Check if already in reading list
  const exists = items.some(
    (i) => i.type === item.type && i.contentId === item.contentId
  )

  if (exists) {
    return false
  }

  const newItem: ReadingListItem = {
    ...item,
    id: `reading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    addedAt: new Date().toISOString(),
    progress: 0,
  }

  items.push(newItem)
  saveReadingList(items)
  return true
}

/**
 * Remove item from reading list
 */
export function removeFromReadingList(type: ReadingListType, contentId: string): boolean {
  const items = getReadingList()
  const filtered = items.filter((i) => !(i.type === type && i.contentId === contentId))

  if (filtered.length === items.length) {
    return false // Not found
  }

  saveReadingList(filtered)
  return true
}

/**
 * Check if item is in reading list
 */
export function isInReadingList(type: ReadingListType, contentId: string): boolean {
  const items = getReadingList()
  return items.some((i) => i.type === type && i.contentId === contentId)
}

/**
 * Update reading progress
 */
export function updateReadingProgress(
  type: ReadingListType,
  contentId: string,
  progress: number
): boolean {
  const items = getReadingList()
  const item = items.find((i) => i.type === type && i.contentId === contentId)

  if (!item) {
    return false
  }

  item.progress = Math.max(0, Math.min(100, progress))

  // Mark as read if progress is 100%
  if (item.progress === 100 && !item.readAt) {
    item.readAt = new Date().toISOString()
  }

  saveReadingList(items)
  return true
}

/**
 * Mark item as read
 */
export function markAsRead(type: ReadingListType, contentId: string): boolean {
  return updateReadingProgress(type, contentId, 100)
}

/**
 * Get unread items
 */
export function getUnreadItems(): ReadingListItem[] {
  const items = getReadingList()
  return items.filter((i) => i.progress < 100)
}

/**
 * Get read items
 */
export function getReadItems(): ReadingListItem[] {
  const items = getReadingList()
  return items.filter((i) => i.progress === 100)
}

/**
 * Get items by category
 */
export function getItemsByCategory(category: string): ReadingListItem[] {
  const items = getReadingList()
  return items.filter((i) => i.category === category)
}

/**
 * Get all categories
 */
export function getCategories(): string[] {
  const items = getReadingList()
  const categories = new Set<string>()
  items.forEach((i) => {
    if (i.category) {
      categories.add(i.category)
    }
  })
  return Array.from(categories).sort()
}

/**
 * Update item notes
 */
export function updateItemNotes(
  type: ReadingListType,
  contentId: string,
  notes: string
): boolean {
  const items = getReadingList()
  const item = items.find((i) => i.type === type && i.contentId === contentId)

  if (!item) {
    return false
  }

  item.notes = notes
  saveReadingList(items)
  return true
}

/**
 * Export reading list as JSON
 */
export function exportReadingList(): string {
  const items = getReadingList()
  return JSON.stringify(items, null, 2)
}

/**
 * Import reading list from JSON
 */
export function importReadingList(json: string): boolean {
  try {
    const items = JSON.parse(json)
    if (Array.isArray(items)) {
      saveReadingList(items)
      return true
    }
    return false
  } catch (error) {
    console.error('Error importing reading list:', error)
    return false
  }
}

