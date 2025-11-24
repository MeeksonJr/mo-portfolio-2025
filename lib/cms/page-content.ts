/**
 * Page Content Management System
 * Utilities for fetching page content and images with fallback support
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export interface PageContent {
  id: string
  page_key: string
  section_key: string
  content_type: 'text' | 'html' | 'mdx' | 'json'
  content: string
  metadata: any
  version: number
}

export interface PageImage {
  id: string
  page_key: string
  section_key: string
  image_url: string
  alt_text: string
  caption: string
  display_order: number
  is_featured: boolean
}

/**
 * Fetch page content from database with fallback support
 * @param pageKey - Page identifier (e.g., 'timeline', 'about')
 * @param sectionKey - Section identifier (e.g., 'hero', 'milestone-1')
 * @param fallbackContent - Fallback content if database fails
 * @returns Content from database or fallback
 */
export async function getPageContent(
  pageKey: string,
  sectionKey: string,
  fallbackContent?: string
): Promise<{ content: string | null; fromDatabase: boolean }> {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_key', pageKey)
      .eq('section_key', sectionKey)
      .eq('is_active', true)
      .order('version', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return {
        content: fallbackContent || null,
        fromDatabase: false,
      }
    }

    return {
      content: data.content,
      fromDatabase: true,
    }
  } catch (error) {
    console.error(`Error fetching page content for ${pageKey}/${sectionKey}:`, error)
    return {
      content: fallbackContent || null,
      fromDatabase: false,
    }
  }
}

/**
 * Fetch page images from database with fallback support
 * @param pageKey - Page identifier
 * @param sectionKey - Section identifier
 * @param fallbackImages - Fallback images if database fails
 * @returns Images from database or fallback
 */
export async function getPageImages(
  pageKey: string,
  sectionKey: string,
  fallbackImages: PageImage[] = []
): Promise<{ images: PageImage[]; fromDatabase: boolean }> {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase
      .from('page_images')
      .select('*')
      .eq('page_key', pageKey)
      .eq('section_key', sectionKey)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      return {
        images: fallbackImages,
        fromDatabase: false,
      }
    }

    return {
      images: (data || []) as PageImage[],
      fromDatabase: true,
    }
  } catch (error) {
    console.error(`Error fetching page images for ${pageKey}/${sectionKey}:`, error)
    return {
      images: fallbackImages,
      fromDatabase: false,
    }
  }
}

/**
 * Fetch all content for a page
 * @param pageKey - Page identifier
 * @returns Map of section_key to content
 */
export async function getAllPageContent(
  pageKey: string
): Promise<Record<string, string>> {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_key', pageKey)
      .eq('is_active', true)
      .order('section_key', { ascending: true })
      .order('version', { ascending: false })

    if (error || !data) {
      return {}
    }

    // Get latest version of each section
    const contentMap: Record<string, string> = {}
    const seenSections = new Set<string>()

    for (const item of data) {
      if (!seenSections.has(item.section_key)) {
        contentMap[item.section_key] = item.content
        seenSections.add(item.section_key)
      }
    }

    return contentMap
  } catch (error) {
    console.error(`Error fetching all page content for ${pageKey}:`, error)
    return {}
  }
}

