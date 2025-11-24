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

  // Get unique categories
  const categories = useMemo(
    () =>
      Array.from(
        new Set(posts.map((post) => post.category).filter((cat): cat is string => Boolean(cat)))
      ).sort(),
    [posts]
  )

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

    return filtered
  }, [posts, searchQuery, filterCategory])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Technical insights, tutorials, and thoughts on web development, AI, and software engineering
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
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

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No blog posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group glass rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
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
                {post.category && (
                  <Badge variant="outline" className="mb-2">
                    {post.category}
                  </Badge>
                )}
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    {post.published_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(post.published_at), 'MMM d, yyyy')}
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
                <div className="mt-4 flex items-center text-primary group-hover:gap-2 transition-all">
                  <span className="text-sm font-medium">Read more</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

