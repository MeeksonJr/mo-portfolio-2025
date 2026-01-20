'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Eye, BookOpen, FolderKanban, Calendar } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { usePathname } from 'next/navigation'

export default function PopularWidget() {
  const pathname = usePathname()
  const [popularContent, setPopularContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ensure correct URL when opened from home screen
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      if (pathname !== '/widgets/popular') {
        window.location.replace('/widgets/popular')
        return
      }
    }
    
    fetchPopular()
    const interval = setInterval(fetchPopular, 10 * 60 * 1000) // Refresh every 10 minutes
    return () => clearInterval(interval)
  }, [pathname])

  const fetchPopular = async () => {
    try {
      const response = await fetch('/api/widgets/data?type=popular-content')
      const data = await response.json()
      if (data.success && data.widgets?.popularContent) {
        setPopularContent(data.widgets.popularContent)
      }
    } catch (error) {
      console.error('Error fetching popular content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !popularContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <TrendingUp className="h-8 w-8 animate-pulse mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Popular Content</h1>
        </div>
        
        <div className="space-y-6">
          {/* Popular Blogs */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Top Blog Posts</h2>
            </div>
            <div className="space-y-3">
              {popularContent.blogs?.map((blog: any, index: number) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                      <h3 className="font-semibold line-clamp-2">{blog.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{blog.views?.toLocaleString() || 0} views</span>
                    </div>
                    {blog.published_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(blog.published_at), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Case Studies */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FolderKanban className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Top Case Studies</h2>
            </div>
            <div className="space-y-3">
              {popularContent.caseStudies?.map((study: any, index: number) => (
                <Link
                  key={study.id}
                  href={`/case-studies/${study.slug}`}
                  className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                      <h3 className="font-semibold line-clamp-2">{study.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{study.views?.toLocaleString() || 0} views</span>
                    </div>
                    {study.published_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(study.published_at), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/blog"
            className="text-center text-primary hover:underline font-medium"
          >
            View All Blogs →
          </Link>
          <Link
            href="/case-studies"
            className="text-center text-primary hover:underline font-medium"
          >
            View All Case Studies →
          </Link>
        </div>
      </div>
    </div>
  )
}

