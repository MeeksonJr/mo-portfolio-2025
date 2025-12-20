'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

interface BreadcrumbItem {
  label: string
  href: string
}

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
  '/projects': 'Projects',
  '/blog': 'Blog',
  '/case-studies': 'Case Studies',
  '/contact': 'Contact',
  '/resume': 'Resume',
  '/tools': 'Tools',
  '/code': 'Code Hub',
  '/insights': 'Insights',
  '/calendar': 'Calendar',
  '/portfolio-assistant': 'AI Assistant',
  '/demos': 'Live Demos',
  '/architecture': 'Architecture',
  '/collaboration': 'Collaboration',
  '/resources': 'Resources',
  '/testimonials': 'Testimonials',
  '/timeline': 'Timeline',
  '/music': 'Music',
  '/achievements': 'Achievements',
}

export default function BreadcrumbNavigation() {
  const pathname = usePathname()
  
  // Don't show breadcrumbs on home page
  if (pathname === '/') return null

  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
  ]

  // Build breadcrumbs from path segments
  pathSegments.forEach((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    const label = routeLabels[href] || segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    breadcrumbs.push({ label, href })
  })

  // Handle dynamic routes (e.g., /blog/[slug])
  if (pathname.includes('/[') || pathSegments.length > 2) {
    // For dynamic routes, show the parent route label
    const parentPath = '/' + pathSegments.slice(0, -1).join('/')
    if (breadcrumbs.length > 1) {
      breadcrumbs[breadcrumbs.length - 1].label = routeLabels[parentPath] || 'Details'
    }
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            
            return (
              <li key={crumb.href} className="flex items-center gap-2">
                {index === 0 ? (
                  <Link
                    href={crumb.href}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    aria-label="Home"
                  >
                    <Home className="h-4 w-4" />
                    <span className="sr-only">Home</span>
                  </Link>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    {isLast ? (
                      <span className="text-foreground font-medium" aria-current="page">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="hover:text-foreground transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

