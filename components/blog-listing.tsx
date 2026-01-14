'use client'

import { useState, useMemo } from 'react'
import { Search, Calendar, Eye, Tag, ArrowRight } from 'lucide-react'
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
import Image from 'next/image'
import { format } from 'date-fns'
import { trackClick } from '@/lib/analytics'
import EnhancedFilters from '@/components/filters/enhanced-filters'
import SocialShareButton from '@/components/sharing/social-share-button'
import { EnhancedScrollReveal } from '@/components/animations/enhanced-scroll-reveal'
import { isContentNew, formatRelativeTime } from '@/lib/content-freshness'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  category: string | null
  tags: string[] | null
  published_at: string | null
  reading_time: number | null
  views: number
  created_at: string
}

interface BlogListingProps {
  posts: BlogPost[]
}

export default function BlogListing({ posts }: BlogListingProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    category: [],
    tags: [],
  })

  // Get unique categories and tags
  const categories = useMemo(
    () =>
      Array.from(
        new Set(posts.map((post) => post.category).filter((cat): cat is string => Boolean(cat)))
      ).sort(),
    [posts]
  )

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [posts])

  const filterOptions = useMemo(() => ({
    category: categories.map((cat) => ({
      value: cat,
      label: cat,
      count: posts.filter((p) => p.category === cat).length,
    })),
    tags: allTags.map((tag) => ({
      value: tag,
      label: tag,
      count: posts.filter((p) => p.tags?.includes(tag)).length,
    })),
  }), [categories, allTags, posts])

  // Filter posts
  const filteredPosts = useMemo(() => {
    let filtered = posts

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter((post) => post.category === filterCategory)
    }

    // Enhanced filters
    if (activeFilters.category.length > 0) {
      filtered = filtered.filter((post) => 
        post.category && activeFilters.category.includes(post.category)
      )
    }

    if (activeFilters.tags.length > 0) {
      filtered = filtered.filter((post) =>
        post.tags?.some((tag) => activeFilters.tags.includes(tag))
      )
    }

    return filtered
  }, [posts, searchQuery, filterCategory, activeFilters])

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[filterType] || []
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [filterType]: updated }
    })
  }

  const handleClearFilters = () => {
    setActiveFilters({ category: [], tags: [] })
    setFilterCategory('all')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Technical insights, tutorials, and thoughts on web development, AI, and software engineering
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
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
        
        {/* Enhanced Filters */}
        {(filterOptions.category.length > 0 || filterOptions.tags.length > 0) && (
          <EnhancedFilters
            filters={filterOptions}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        )}
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No blog posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <EnhancedScrollReveal key={post.id} variant="fade" delay={index * 0.1}>
              <Link
                href={`/blog/${post.slug}`}
                className="group glass rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                onClick={() => trackClick('blog_post', post.id, { source: 'listing' })}
              >
              {post.featured_image && (
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {post.category && (
                    <Badge variant="outline">
                      {post.category}
                    </Badge>
                  )}
                  {post.published_at && isContentNew(post.published_at) && (
                    <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30">
                      New
                    </Badge>
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4 flex-wrap">
                    {post.published_at && (
                      <div className="flex items-center gap-1" title={`Published ${format(new Date(post.published_at), 'MMM d, yyyy')}`}>
                        <Calendar className="h-3 w-3" />
                        <span>{formatRelativeTime(post.published_at)}</span>
                      </div>
                    )}
                    {post.reading_time && (
                      <span>{post.reading_time} min read</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views || 0}
                  </div>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
                  <div className="flex items-center text-primary group-hover:gap-2 transition-all">
                    <span className="text-sm font-medium">Read more</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <SocialShareButton
                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post.slug}`}
                    title={post.title}
                    description={post.excerpt || ''}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </Link>
            </EnhancedScrollReveal>
          ))}
        </div>
      )}
    </div>
  )
}

