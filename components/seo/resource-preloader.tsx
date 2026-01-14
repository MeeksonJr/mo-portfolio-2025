'use client'

import { useEffect } from 'react'

interface ResourcePreloaderProps {
  resources?: Array<{
    href: string
    as?: string
    type?: string
    crossOrigin?: string
  }>
  images?: string[]
  fonts?: string[]
}

/**
 * Resource preloader component
 * Preloads critical resources for better performance
 */
export default function ResourcePreloader({
  resources = [],
  images = [],
  fonts = [],
}: ResourcePreloaderProps) {
  useEffect(() => {
    // Preload critical resources
    resources.forEach((resource) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.href
      if (resource.as) link.as = resource.as
      if (resource.type) link.type = resource.type
      if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin
      document.head.appendChild(link)
    })

    // Preload critical images
    images.forEach((image) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = image
      document.head.appendChild(link)
    })

    // Preload critical fonts
    fonts.forEach((font) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      link.href = font
      document.head.appendChild(link)
    })

    // Prefetch DNS for external domains
    const externalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://vercel.com',
      'https://github.com',
    ]

    externalDomains.forEach((domain) => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      document.head.appendChild(link)
    })

    // Preconnect to critical origins
    const criticalOrigins = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ]

    criticalOrigins.forEach((origin) => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = origin
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }, [resources, images, fonts])

  return null
}

