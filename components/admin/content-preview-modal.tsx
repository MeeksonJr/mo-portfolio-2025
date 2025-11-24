'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Eye, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface ContentPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentType: 'blog' | 'case-study' | 'resource' | 'project'
  content: any
}

export default function ContentPreviewModal({
  open,
  onOpenChange,
  contentType,
  content,
}: ContentPreviewModalProps) {
  if (!content) return null

  const renderBlogPreview = () => (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">Blog Post</Badge>
          {content.category && <Badge variant="secondary">{content.category}</Badge>}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.title}</h1>
        {content.excerpt && (
          <p className="text-xl text-muted-foreground mb-6">{content.excerpt}</p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          {content.published_at && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(content.published_at), 'MMMM d, yyyy')}</span>
            </div>
          )}
          {content.views !== undefined && (
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{content.views || 0} views</span>
            </div>
          )}
        </div>

        {/* Featured Image */}
        {content.featured_image && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <img
              src={content.featured_image}
              alt={content.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {content.tags.map((tag: string) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: content.content || '' }}
      />
    </article>
  )

  const renderCaseStudyPreview = () => (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">Case Study</Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.title}</h1>
        {content.description && (
          <p className="text-xl text-muted-foreground mb-6">{content.description}</p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          {content.published_at && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(content.published_at), 'MMMM d, yyyy')}</span>
            </div>
          )}
          {content.views !== undefined && (
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{content.views || 0} views</span>
            </div>
          )}
        </div>

        {/* Featured Image */}
        {content.featured_image && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <img
              src={content.featured_image}
              alt={content.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tech Stack */}
        {content.tech_stack && content.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {content.tech_stack.map((tech: string) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        {/* Problem Statement */}
        {content.problem_statement && (
          <div className="mb-8 p-6 bg-muted rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Problem Statement</h2>
            <p className="text-muted-foreground">{content.problem_statement}</p>
          </div>
        )}

        {/* Solution Overview */}
        {content.solution_overview && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Solution Overview</h2>
            <p className="text-muted-foreground">{content.solution_overview}</p>
          </div>
        )}

        {/* Challenges */}
        {content.challenges && content.challenges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Challenges</h2>
            <ul className="list-disc list-inside space-y-2">
              {content.challenges.map((challenge: string, idx: number) => (
                <li key={idx} className="text-muted-foreground">
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: content.content || '' }}
        />

        {/* Results */}
        {content.results && (
          <div className="mb-8 p-6 bg-primary/10 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Results</h2>
            <p className="text-muted-foreground">{content.results}</p>
          </div>
        )}

        {/* Lessons Learned */}
        {content.lessons_learned && content.lessons_learned.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Lessons Learned</h2>
            <ul className="list-disc list-inside space-y-2">
              {content.lessons_learned.map((lesson: string, idx: number) => (
                <li key={idx} className="text-muted-foreground">
                  {lesson}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </article>
  )

  const renderResourcePreview = () => (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">{content.type || 'Resource'}</Badge>
          {content.category && <Badge variant="secondary">{content.category}</Badge>}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.title}</h1>
        {content.description && (
          <p className="text-xl text-muted-foreground mb-6">{content.description}</p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          {content.published_at && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(content.published_at), 'MMMM d, yyyy')}</span>
            </div>
          )}
          {content.views !== undefined && (
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{content.views || 0} views</span>
            </div>
          )}
          {content.url && (
            <Button variant="outline" size="sm" asChild>
              <a href={content.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Resource
              </a>
            </Button>
          )}
        </div>

        {/* Featured Image */}
        {content.featured_image && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <img
              src={content.featured_image}
              alt={content.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {content.tags.map((tag: string) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>
    </article>
  )

  const renderProjectPreview = () => (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">Project</Badge>
          {content.is_featured && <Badge variant="default">Featured</Badge>}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.name}</h1>
        {content.description && (
          <p className="text-xl text-muted-foreground mb-6">{content.description}</p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          {content.homepage_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={content.homepage_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Site
              </a>
            </Button>
          )}
          {content.github_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={content.github_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          )}
        </div>

        {/* Featured Image */}
        {content.featured_image && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <img
              src={content.featured_image}
              alt={content.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tech Stack */}
        {content.tech_stack && content.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {content.tech_stack.map((tech: string) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </header>
    </article>
  )

  const renderPreview = () => {
    switch (contentType) {
      case 'blog':
        return renderBlogPreview()
      case 'case-study':
        return renderCaseStudyPreview()
      case 'resource':
        return renderResourcePreview()
      case 'project':
        return renderProjectPreview()
      default:
        return null
    }
  }

  const getPreviewUrl = () => {
    if (!content.slug) return null
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
    switch (contentType) {
      case 'blog':
        return `${baseUrl}/blog/${content.slug}`
      case 'case-study':
        return `${baseUrl}/case-studies/${content.slug}`
      case 'resource':
        return `${baseUrl}/resources/${content.slug}`
      case 'project':
        return `${baseUrl}/projects/${content.slug}`
      default:
        return null
    }
  }

  const previewUrl = getPreviewUrl()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Content Preview</DialogTitle>
            <div className="flex items-center gap-2">
              {previewUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Live
                  </a>
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-4">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  )
}

