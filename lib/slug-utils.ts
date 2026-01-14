/**
 * Utility functions for generating unique slugs
 */

/**
 * Create a slug from a string
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a number if needed
 */
export async function generateUniqueSlug(
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>,
  maxAttempts: number = 10
): Promise<string> {
  let slug = createSlug(baseSlug)
  let attempt = 0

  while (attempt < maxAttempts) {
    const exists = await checkExists(slug)
    if (!exists) {
      return slug
    }

    attempt++
    slug = `${createSlug(baseSlug)}-${attempt}`
  }

  // If all attempts failed, append timestamp
  return `${createSlug(baseSlug)}-${Date.now()}`
}

