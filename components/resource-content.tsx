'use client'

import { Calendar, Eye, ArrowLeft, Share2, ExternalLink, Book, Video, FileText, Wrench, GraduationCap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'

interface Resource {
  id: string
  title: string
  slug: string
  description: string | null
  url: string | null
  type: 'tool' | 'course' | 'book' | 'article' | 'video' | 'other'
  category: string | null
  tags: string[] | null
  featured_image: string | null
  published_at: string | null
  views: number
}

interface RelatedResource {
  id: string
  title: string
  slug: string
  description: string | null
  featured_image: string | null
  type: 'tool' | 'course' | 'book' | 'article' | 'video' | 'other'
  published_at: string | null
}

interface ResourceContentProps {
  resource: Resource
  relatedResources: RelatedResource[]
}

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

export default function ResourceContent({ resource, relatedResources }: ResourceContentProps) {
  const TypeIcon = typeIcons[resource.type]

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.title,
          text: resource.description || '',
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        href="/resources"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Resources</span>
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TypeIcon className="h-5 w-5 text-primary" />
          <Badge variant="outline">{typeLabels[resource.type]}</Badge>
          {resource.category && (
            <Badge variant="secondary">{resource.category}</Badge>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{resource.title}</h1>
        {resource.description && (
          <p className="text-xl text-muted-foreground mb-6">{resource.description}</p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          {resource.published_at && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(resource.published_at), 'MMMM d, yyyy')}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{resource.views || 0} views</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="ml-auto"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Featured Image */}
        {resource.featured_image && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <img
              src={resource.featured_image}
              alt={resource.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* External Link */}
        {resource.url && (
          <div className="mb-8">
            <Link
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Visit Resource
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        )}
      </header>

      {/* Related Resources */}
      {relatedResources.length > 0 && (
        <section className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedResources.map((related) => {
              const RelatedIcon = typeIcons[related.type]
              return (
                <Link
                  key={related.id}
                  href={`/resources/${related.slug}`}
                  className="group glass rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {related.featured_image && (
                    <div className="relative w-full h-32 overflow-hidden">
                      <img
                        src={related.featured_image}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <RelatedIcon className="h-3 w-3 text-primary" />
                      <Badge variant="outline" className="text-xs">
                        {typeLabels[related.type]}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    {related.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {related.description}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </article>
  )
}

