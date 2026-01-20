'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Eye, Calendar } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { usePathname } from 'next/navigation'

export default function BlogWidget() {
  const pathname = usePathname()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ensure correct URL when opened from home screen
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      // Running as PWA - ensure we're on the correct widget page
      if (pathname !== '/widgets/blog') {
        window.location.replace('/widgets/blog')
        return
      }
    }
    
    fetchPosts()
    // Refresh every 5 minutes
    const interval = setInterval(fetchPosts, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [pathname])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/widgets/data?type=latest-blog&limit=5')
      const data = await response.json()
      if (data.success && data.widgets?.latestBlog) {
        setPosts(data.widgets.latestBlog)
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <BookOpen className="h-8 w-8 animate-pulse mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Latest Blog Posts</h1>
        </div>
        
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <h2 className="font-semibold mb-2 line-clamp-2">{post.title}</h2>
              {post.excerpt && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {post.published_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(post.published_at), 'MMM d, yyyy')}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{post.views || 0} views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/blog"
          className="block mt-6 text-center text-primary hover:underline font-medium"
        >
          View All Posts →
        </Link>
      </div>
    </div>
  )
}

