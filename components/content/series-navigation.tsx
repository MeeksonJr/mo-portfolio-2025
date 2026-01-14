'use client'

import { useState, useEffect } from 'react'
import { BookOpen, ChevronRight, ChevronLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface SeriesPost {
  id: string
  title: string
  slug: string
  order?: number
  published_at?: string
}

interface SeriesNavigationProps {
  seriesName: string
  currentPostId: string
  currentPostSlug: string
}

export default function SeriesNavigation({
  seriesName,
  currentPostId,
  currentPostSlug,
}: SeriesNavigationProps) {
  const [seriesPosts, setSeriesPosts] = useState<SeriesPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(-1)

  useEffect(() => {
    fetchSeriesPosts()
  }, [seriesName])

  const fetchSeriesPosts = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, published_at, series_order')
        .eq('series', seriesName)
        .eq('status', 'published')
        .order('series_order', { ascending: true, nullsLast: true })
        .order('published_at', { ascending: true })

      if (error) throw error

      if (data) {
        setSeriesPosts(data)
        const index = data.findIndex((post) => post.id === currentPostId)
        setCurrentIndex(index)
      }
    } catch (error) {
      console.error('Error fetching series posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || seriesPosts.length <= 1) {
    return null // Don't show if only one post or loading
  }

  const prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null
  const nextPost = currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null

  return (
    <Card className="mb-8 bg-muted/50 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <div>
            <div className="font-semibold text-sm text-muted-foreground">Series</div>
            <div className="font-bold">{seriesName}</div>
          </div>
          <Badge variant="outline" className="ml-auto">
            Part {currentIndex + 1} of {seriesPosts.length}
          </Badge>
        </div>

        {/* Series Posts List */}
        <div className="space-y-2 mb-4">
          {seriesPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                post.id === currentPostId
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'hover:bg-muted'
              }`}
            >
              <span className="text-sm text-muted-foreground w-6">
                {index + 1}.
              </span>
              <span className="flex-1 text-sm">{post.title}</span>
              {post.id === currentPostId && (
                <Badge variant="secondary" className="text-xs">
                  Current
                </Badge>
              )}
            </Link>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          {prevPost ? (
            <Button variant="outline" asChild>
              <Link href={`/blog/${prevPost.slug}`}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous: {prevPost.title}
              </Link>
            </Button>
          ) : (
            <div />
          )}

          {nextPost && (
            <Button variant="outline" asChild>
              <Link href={`/blog/${nextPost.slug}`}>
                Next: {nextPost.title}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

