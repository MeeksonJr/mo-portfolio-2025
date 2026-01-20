'use client'

import { useState, useMemo } from 'react'
import { Search, Calendar, Eye, ExternalLink, Book, Video, FileText, Wrench, GraduationCap } from 'lucide-react'
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
import { format } from 'date-fns'
import PageContainer from '@/components/layout/page-container'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

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
  created_at: string
}

interface ResourcesListingProps {
  resources: Resource[]
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

export default function ResourcesListing({ resources }: ResourcesListingProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  // Get unique categories
  const categories = useMemo(
    () =>
      Array.from(
        new Set(resources.map((r) => r.category).filter((cat): cat is string => Boolean(cat)))
      ).sort(),
    [resources]
  )

  // Filter resources
  const filteredResources = useMemo(() => {
    let filtered = resources

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((r) => r.type === filterType)
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter((r) => r.category === filterCategory)
    }

    return filtered
  }, [resources, searchQuery, filterType, filterCategory])

  return (
    <PageContainer width="wide" padding="default">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className={cn(TYPOGRAPHY.h1, "mb-4")}>Resources</h1>
        <p className={cn(TYPOGRAPHY.lead, "text-muted-foreground max-w-2xl mx-auto")}>
          Curated collection of tools, courses, books, articles, and videos for developers
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="tool">Tools</SelectItem>
            <SelectItem value="course">Courses</SelectItem>
            <SelectItem value="book">Books</SelectItem>
            <SelectItem value="article">Articles</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {categories.length > 0 && (
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No resources found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const TypeIcon = typeIcons[resource.type]
            return (
              <Link
                key={resource.id}
                href={`/resources/${resource.slug}`}
                className="group glass rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 block"
              >
                {resource.featured_image && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={resource.featured_image}
                      alt={resource.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TypeIcon className="h-4 w-4 text-primary" />
                    <Badge variant="outline" className="text-xs">
                      {typeLabels[resource.type]}
                    </Badge>
                    {resource.category && (
                      <Badge variant="secondary" className="text-xs">
                        {resource.category}
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {resource.title}
                  </h2>
                  {resource.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                  )}
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{resource.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {resource.published_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(resource.published_at), 'MMM d, yyyy')}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {resource.views || 0}
                    </div>
                  </div>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit Resource
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}

