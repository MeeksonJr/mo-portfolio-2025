'use client'

import { useEffect, useState } from 'react'
import { FolderKanban, Eye, Calendar } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { usePathname } from 'next/navigation'

export default function CaseStudiesWidget() {
  const pathname = usePathname()
  const [studies, setStudies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ensure correct URL when opened from home screen
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      if (pathname !== '/widgets/case-studies') {
        window.location.replace('/widgets/case-studies')
        return
      }
    }
    
    fetchStudies()
    const interval = setInterval(fetchStudies, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [pathname])

  const fetchStudies = async () => {
    try {
      const response = await fetch('/api/widgets/data?type=latest-case-studies&limit=5')
      const data = await response.json()
      if (data.success && data.widgets?.latestCaseStudies) {
        setStudies(data.widgets.latestCaseStudies)
      }
    } catch (error) {
      console.error('Error fetching case studies:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <FolderKanban className="h-8 w-8 animate-pulse mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <FolderKanban className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Latest Case Studies</h1>
        </div>
        
        <div className="space-y-4">
          {studies.map((study) => (
            <Link
              key={study.id}
              href={`/case-studies/${study.slug}`}
              className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <h2 className="font-semibold mb-2 line-clamp-2">{study.title}</h2>
              {study.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {study.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {study.published_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(study.published_at), 'MMM d, yyyy')}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{study.views || 0} views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/case-studies"
          className="block mt-6 text-center text-primary hover:underline font-medium"
        >
          View All Case Studies →
        </Link>
      </div>
    </div>
  )
}

