'use client'

import { useEffect } from 'react'
import Head from 'next/head'

interface MetaTagsProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  keywords?: string[]
  author?: string
}

export default function MetaTags({
  title = 'Mohamed Datt | Full Stack Developer',
  description = 'Creative Full Stack Developer specializing in AI-powered web applications, Next.js, TypeScript, and modern web technologies',
  image = '/og-image.png',
  url,
  type = 'website',
  keywords = [],
  author = 'Mohamed Datt',
}: MetaTagsProps) {
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title
    }

    // Update meta tags dynamically
    const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    if (description) {
      updateMetaTag('description', description)
      updateMetaTag('og:description', description, 'property')
      updateMetaTag('twitter:description', description)
    }

    if (title) {
      updateMetaTag('og:title', title, 'property')
      updateMetaTag('twitter:title', title)
    }

    if (image) {
      const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`
      updateMetaTag('og:image', imageUrl, 'property')
      updateMetaTag('twitter:image', imageUrl)
    }

    if (currentUrl) {
      updateMetaTag('og:url', currentUrl, 'property')
    }

    if (type) {
      updateMetaTag('og:type', type, 'property')
    }

    if (keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '))
    }

    if (author) {
      updateMetaTag('author', author)
    }
  }, [title, description, image, currentUrl, type, keywords, author, siteUrl])

  return null
}

