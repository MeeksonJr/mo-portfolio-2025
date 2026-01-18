'use client'

import { Eye, ArrowLeft, ExternalLink, Github, Star, FolderGit2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import SocialShareButton from '@/components/social-share/social-share-button'
import { ContentPerformanceInsights } from '@/components/analytics/content-performance-insights'
import SmartRecommendations from '@/components/recommendations/smart-recommendations'
import PageContainer from '@/components/layout/page-container'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  name: string
  description: string | null
  tech_stack: string[] | null
  featured_image: string | null
  homepage_url: string | null
  github_url: string
  is_featured: boolean
  views: number
  created_at: string
}

interface RelatedProject {
  id: string
  name: string
  description: string | null
  featured_image: string | null
  tech_stack: string[] | null
  homepage_url: string | null
  github_url: string
}

interface ProjectContentProps {
  project: Project
  relatedProjects: RelatedProject[]
}

// Helper function to create slug from name
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProjectContent({ project, relatedProjects }: ProjectContentProps) {

  return (
    <article>
      <PageContainer width="narrow" padding="default">
      {/* Back Button */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Projects</span>
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FolderGit2 className="h-5 w-5 text-primary" />
          <Badge variant="outline">Project</Badge>
          {project.is_featured && (
            <Badge className="bg-primary text-primary-foreground">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
        <h1 className={cn(TYPOGRAPHY.h1, "mb-4")}>{project.name}</h1>
        {project.description && (
          <p className={cn(TYPOGRAPHY.lead, "text-muted-foreground mb-6")}>{project.description}</p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{project.views || 0} views</span>
          </div>
          <div className="ml-auto">
            <SocialShareButton
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={project.name}
              description={project.description || ''}
              variant="ghost"
              size="sm"
              contentType="project"
              contentId={project.id}
            />
          </div>
        </div>

        {/* Featured Image */}
        {project.featured_image && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <img
              src={project.featured_image}
              alt={project.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech_stack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          {project.homepage_url && (
            <Link
              href={project.homepage_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Visit Live Site
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
          <Link
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            View on GitHub
            <Github className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((related) => {
              const slug = createSlug(related.name)
              return (
                <Link
                  key={related.id}
                  href={`/projects/${slug}`}
                  className="group glass rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {related.featured_image && (
                    <div className="relative w-full h-32 overflow-hidden">
                      <img
                        src={related.featured_image}
                        alt={related.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderGit2 className="h-3 w-3 text-primary" />
                      <span className="text-xs text-muted-foreground">Project</span>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {related.name}
                    </h3>
                    {related.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {related.description}
                      </p>
                    )}
                    {related.tech_stack && related.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {related.tech_stack.slice(0, 2).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Smart Recommendations - You might also like */}
      <div className="mt-16 pt-8 border-t">
        <SmartRecommendations
          currentItem={{
            id: project.id,
            title: project.name,
            description: project.description || '',
            type: 'project',
            tags: project.tech_stack || [],
          }}
          contentType="project"
          limit={3}
        />
      </div>

      {/* Content Performance Insights */}
      <div className="mt-16 pt-8 border-t">
        <ContentPerformanceInsights
          contentId={project.id}
          contentType="project"
          contentTitle={project.name}
        />
      </div>
      </PageContainer>
    </article>
  )
}

