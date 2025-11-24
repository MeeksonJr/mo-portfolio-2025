'use client'

import { useState, useEffect } from 'react'

export interface PageImage {
  id: string
  image_url: string
  alt_text: string
  caption: string
  display_order: number
  is_featured: boolean
  is_active: boolean
}

export interface PageContent {
  content: string
  content_type: 'text' | 'html' | 'mdx'
}

/**
 * Hook to fetch page images from CMS with fallback
 */
export function usePageImages(
  pageKey: string,
  sectionKey: string,
  fallbackImages: Array<{ src: string; alt: string; caption?: string }> = []
) {
  const [images, setImages] = useState<Array<{ src: string; alt: string; caption?: string }>>(fallbackImages)
  const [isLoading, setIsLoading] = useState(true)
  const [fromDatabase, setFromDatabase] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `/api/pages/images?page_key=${pageKey}&section_key=${sectionKey}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch images')
        }

        const { data, fallback } = await response.json()

        if (fallback || !data || data.length === 0) {
          // Use fallback images
          setImages(fallbackImages)
          setFromDatabase(false)
        } else {
          // Convert CMS images to component format
          const cmsImages = data
            .filter((img: PageImage) => img.is_active)
            .sort((a: PageImage, b: PageImage) => a.display_order - b.display_order)
            .map((img: PageImage) => ({
              src: img.image_url,
              alt: img.alt_text || '',
              caption: img.caption || '',
            }))
          
          setImages(cmsImages.length > 0 ? cmsImages : fallbackImages)
          setFromDatabase(cmsImages.length > 0)
        }
      } catch (error) {
        console.error('Error fetching page images:', error)
        setImages(fallbackImages)
        setFromDatabase(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [pageKey, sectionKey])

  return { images, isLoading, fromDatabase }
}

/**
 * Hook to fetch page content from CMS with fallback
 */
export function usePageContent(
  pageKey: string,
  sectionKey: string,
  fallbackContent: string = ''
) {
  const [content, setContent] = useState<string>(fallbackContent)
  const [isLoading, setIsLoading] = useState(true)
  const [fromDatabase, setFromDatabase] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(
          `/api/pages/content?page_key=${pageKey}&section_key=${sectionKey}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch content')
        }

        const { data, fallback } = await response.json()

        if (fallback || !data || !data.content) {
          setContent(fallbackContent)
          setFromDatabase(false)
        } else {
          setContent(data.content)
          setFromDatabase(true)
        }
      } catch (error) {
        console.error('Error fetching page content:', error)
        setContent(fallbackContent)
        setFromDatabase(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [pageKey, sectionKey])

  return { content, isLoading, fromDatabase }
}

