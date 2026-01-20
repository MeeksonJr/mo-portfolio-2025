'use client'

import { useEffect, useState } from 'react'
import { Wrench, Eye, Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ProjectsWidget() {
  const pathname = usePathname()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ensure correct URL when opened from home screen
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      if (pathname !== '/widgets/projects') {
        window.location.replace('/widgets/projects')
        return
      }
    }
    
    fetchProjects()
    const interval = setInterval(fetchProjects, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [pathname])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/widgets/data?type=featured-projects&limit=5')
      const data = await response.json()
      if (data.success && data.widgets?.featuredProjects) {
        setProjects(data.widgets.featuredProjects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
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
          <h1 className="text-2xl font-bold">Featured Projects</h1>
        </div>
        
        <div className="space-y-4">
          {projects.map((project) => {
            const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            return (
              <div
                key={project.id}
                className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <Link href={`/projects/${slug}`}>
                  <h2 className="font-semibold mb-2 line-clamp-2">{project.name}</h2>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </Link>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{project.views || 0} views</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="h-3 w-3" />
                      GitHub
                    </a>
                  )}
                  {project.homepage_url && (
                    <a
                      href={project.homepage_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Demo
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <Link
          href="/projects"
          className="block mt-6 text-center text-primary hover:underline font-medium"
        >
          View All Projects →
        </Link>
      </div>
    </div>
  )
}

