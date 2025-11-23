'use client'

import { useState, useMemo } from 'react'
import { Search, Eye, ExternalLink, Github, Star, FolderGit2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

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

interface ProjectsListingProps {
  projects: Project[]
}

// Helper function to create slug from name
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProjectsListing({ projects }: ProjectsListingProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterFeatured, setFilterFeatured] = useState<string>('all')

  // Filter projects
  const filteredProjects = useMemo(() => {
    let filtered = projects

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tech_stack?.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (filterFeatured === 'featured') {
      filtered = filtered.filter((p) => p.is_featured)
    } else if (filterFeatured === 'not-featured') {
      filtered = filtered.filter((p) => !p.is_featured)
    }

    return filtered
  }, [projects, searchQuery, filterFeatured])

  // Separate featured and regular projects
  const featuredProjects = filteredProjects.filter((p) => p.is_featured)
  const regularProjects = filteredProjects.filter((p) => !p.is_featured)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Portfolio of projects, applications, and technical implementations
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterFeatured} onValueChange={setFilterFeatured}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="featured">Featured Only</SelectItem>
            <SelectItem value="not-featured">Not Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Featured Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => {
              const slug = createSlug(project.name)
              return (
                <Link
                  key={project.id}
                  href={`/projects/${slug}`}
                  className="group glass rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-primary/20"
                >
                  {project.featured_image && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={project.featured_image}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-primary-foreground">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderGit2 className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Project</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {project.name}
                    </h2>
                    {project.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {project.description}
                      </p>
                    )}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tech_stack.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tech_stack.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {project.views || 0}
                      </div>
                      <div className="flex items-center gap-2">
                        {project.homepage_url && (
                          <ExternalLink className="h-3 w-3" />
                        )}
                        <Github className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Regular Projects Section */}
      {regularProjects.length > 0 && (
        <div>
          {featuredProjects.length > 0 && (
            <h2 className="text-2xl font-bold mb-6">All Projects</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularProjects.map((project) => {
              const slug = createSlug(project.name)
              return (
                <Link
                  key={project.id}
                  href={`/projects/${slug}`}
                  className="group glass rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {project.featured_image && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={project.featured_image}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderGit2 className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Project</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {project.name}
                    </h2>
                    {project.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {project.description}
                      </p>
                    )}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tech_stack.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tech_stack.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {project.views || 0}
                      </div>
                      <div className="flex items-center gap-2">
                        {project.homepage_url && (
                          <ExternalLink className="h-3 w-3" />
                        )}
                        <Github className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No projects found</p>
        </div>
      )}
    </div>
  )
}

