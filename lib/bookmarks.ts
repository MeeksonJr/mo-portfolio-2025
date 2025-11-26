/**
 * Bookmark System
 * Allows users to save favorite content (projects, blog posts, resources, case studies)
 */

export type BookmarkType = 'project' | 'blog' | 'resource' | 'case-study'

export interface Bookmark {
  id: string
  type: BookmarkType
  contentId: string
  title: string
  url: string
  description?: string
  image?: string
  tags?: string[]
  collection?: string
  createdAt: string
}

const STORAGE_KEY = 'portfolio-bookmarks'
const COLLECTIONS_KEY = 'portfolio-bookmark-collections'

export interface BookmarkCollection {
  id: string
  name: string
  description?: string
  color?: string
  createdAt: string
}

/**
 * Get all bookmarks
 */
export function getBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading bookmarks:', error)
  }

  return []
}

/**
 * Save bookmarks to localStorage
 */
function saveBookmarks(bookmarks: Bookmark[]): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
  } catch (error) {
    console.error('Error saving bookmarks:', error)
  }
}

/**
 * Add a bookmark
 */
export function addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): boolean {
  const bookmarks = getBookmarks()

  // Check if already bookmarked
  const exists = bookmarks.some(
    (b) => b.type === bookmark.type && b.contentId === bookmark.contentId
  )

  if (exists) {
    return false
  }

  const newBookmark: Bookmark = {
    ...bookmark,
    id: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  }

  bookmarks.push(newBookmark)
  saveBookmarks(bookmarks)
  return true
}

/**
 * Remove a bookmark
 */
export function removeBookmark(type: BookmarkType, contentId: string): boolean {
  const bookmarks = getBookmarks()
  const filtered = bookmarks.filter(
    (b) => !(b.type === type && b.contentId === contentId)
  )

  if (filtered.length === bookmarks.length) {
    return false // Not found
  }

  saveBookmarks(filtered)
  return true
}

/**
 * Check if an item is bookmarked
 */
export function isBookmarked(type: BookmarkType, contentId: string): boolean {
  const bookmarks = getBookmarks()
  return bookmarks.some((b) => b.type === type && b.contentId === contentId)
}

/**
 * Get bookmarks by type
 */
export function getBookmarksByType(type: BookmarkType): Bookmark[] {
  const bookmarks = getBookmarks()
  return bookmarks.filter((b) => b.type === type)
}

/**
 * Get bookmarks by collection
 */
export function getBookmarksByCollection(collectionId: string): Bookmark[] {
  const bookmarks = getBookmarks()
  return bookmarks.filter((b) => b.collection === collectionId)
}

/**
 * Update bookmark collection
 */
export function updateBookmarkCollection(
  type: BookmarkType,
  contentId: string,
  collectionId: string | null
): boolean {
  const bookmarks = getBookmarks()
  const bookmark = bookmarks.find((b) => b.type === type && b.contentId === contentId)

  if (!bookmark) {
    return false
  }

  bookmark.collection = collectionId || undefined
  saveBookmarks(bookmarks)
  return true
}

/**
 * Get all collections
 */
export function getCollections(): BookmarkCollection[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = localStorage.getItem(COLLECTIONS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading collections:', error)
  }

  return []
}

/**
 * Create a new collection
 */
export function createCollection(
  name: string,
  description?: string,
  color?: string
): BookmarkCollection {
  const collections = getCollections()
  const newCollection: BookmarkCollection = {
    id: `collection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    color,
    createdAt: new Date().toISOString(),
  }

  collections.push(newCollection)
  saveCollections(collections)
  return newCollection
}

/**
 * Delete a collection
 */
export function deleteCollection(collectionId: string): boolean {
  const collections = getCollections()
  const filtered = collections.filter((c) => c.id !== collectionId)

  if (filtered.length === collections.length) {
    return false
  }

  // Remove collection from all bookmarks
  const bookmarks = getBookmarks()
  bookmarks.forEach((b) => {
    if (b.collection === collectionId) {
      b.collection = undefined
    }
  })

  saveCollections(filtered)
  saveBookmarks(bookmarks)
  return true
}

/**
 * Save collections to localStorage
 */
function saveCollections(collections: BookmarkCollection[]): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections))
  } catch (error) {
    console.error('Error saving collections:', error)
  }
}

/**
 * Export bookmarks as JSON
 */
export function exportBookmarks(): string {
  const bookmarks = getBookmarks()
  const collections = getCollections()
  return JSON.stringify({ bookmarks, collections }, null, 2)
}

/**
 * Import bookmarks from JSON
 */
export function importBookmarks(json: string): boolean {
  try {
    const data = JSON.parse(json)
    if (data.bookmarks && Array.isArray(data.bookmarks)) {
      saveBookmarks(data.bookmarks)
    }
    if (data.collections && Array.isArray(data.collections)) {
      saveCollections(data.collections)
    }
    return true
  } catch (error) {
    console.error('Error importing bookmarks:', error)
    return false
  }
}

