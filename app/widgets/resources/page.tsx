'use client'

import { useEffect, useState } from 'react'
import { Wrench, Eye, Calendar, Book, Video, FileText, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

const typeIcons = {
  tool: Wrench,
  course: GraduationCap,
  book: Book,
  article: FileText,
  video: Video,
  other: FileText,
}

const typeLabels = {
  tool: 'Tool',
  course: 'Course',
  book: 'Book',
  article: 'Article',
  video: 'Video',
  other: 'Other',
}

export default function ResourcesWidget() {
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResources()
    const interval = setInterval(fetchResources, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/widgets/data?type=popular-resources&limit=5')
      const data = await response.json()
      if (data.success && data.widgets?.popularResources) {
        setResources(data.widgets.popularResources)
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Wrench className="h-8 w-8 animate-pulse mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Popular Resources</h1>
        </div>
        
        <div className="space-y-4">
          {resources.map((resource) => {
            const resourceType = resource.type as keyof typeof typeIcons
            const TypeIcon = typeIcons[resourceType] || FileText
            return (
              <Link
                key={resource.id}
                href={`/resources/${resource.slug}`}
                className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TypeIcon className="h-4 w-4 text-primary" />
                  <Badge variant="outline" className="text-xs">
                    {typeLabels[resourceType] || 'Other'}
                  </Badge>
                </div>
                <h2 className="font-semibold mb-2 line-clamp-2">{resource.title}</h2>
                {resource.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {resource.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {resource.published_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(resource.published_at), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{resource.views || 0} views</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <Link
          href="/resources"
          className="block mt-6 text-center text-primary hover:underline font-medium"
        >
          View All Resources →
        </Link>
      </div>
    </div>
  )
}

