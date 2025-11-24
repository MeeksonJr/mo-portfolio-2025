'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  getYouMightAlsoLike,
  getTrendingContent,
  getPersonalizedRecommendations,
  type ContentItem,
} from '@/lib/smart-recommendations'

interface SmartRecommendationsProps {
  currentItem?: ContentItem
  contentType?: 'blog' | 'project' | 'case-study' | 'resource'
  limit?: number
}

export default function SmartRecommendations({
  currentItem,
  contentType = 'blog',
  limit = 3,
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRecommendations()
  }, [currentItem, contentType])

  const loadRecommendations = async () => {
    setIsLoading(true)
    try {
      // Get user behavior from localStorage
      const behavior = {
        viewedItems: JSON.parse(localStorage.getItem('viewed_items') || '[]'),
        clickedItems: JSON.parse(localStorage.getItem('clicked_items') || '[]'),
        searchQueries: JSON.parse(localStorage.getItem('search_queries') || '[]'),
        timeSpent: JSON.parse(localStorage.getItem('time_spent') || '{}'),
      }

      // Fetch all content
      const content = await fetchAllContent(contentType)

      let recs: ContentItem[] = []

      if (currentItem) {
        // Get "You might also like" based on current item
        recs = getYouMightAlsoLike(currentItem, content, behavior, limit)
      } else {
        // Get personalized recommendations
        recs = getPersonalizedRecommendations(behavior, content, limit)
      }

      setRecommendations(recs)
    } catch (error) {
      console.error('Error loading recommendations:', error)
      setRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllContent = async (type: string): Promise<ContentItem[]> => {
    try {
      const endpoints: Record<string, string> = {
        blog: '/api/admin/content/blog',
        project: '/api/admin/content/projects',
        'case-study': '/api/admin/content/case-studies',
        resource: '/api/admin/content/resources',
      }

      const endpoint = endpoints[type]
      if (!endpoint) return []

      const response = await fetch(endpoint)
      if (!response.ok) return []

      const data = await response.json()
      return data.map((item: any) => ({
        id: item.id,
        title: item.title || item.name,
        description: item.description || item.excerpt,
        tags: item.tags || [],
        category: item.category,
        type: type as ContentItem['type'],
        views: item.views || 0,
        createdAt: item.created_at || item.published_at,
      }))
    } catch (error) {
      console.error('Error fetching content:', error)
      return []
    }
  }

  const getContentUrl = (item: ContentItem) => {
    const basePaths: Record<string, string> = {
      blog: '/blog',
      project: '/projects',
      'case-study': '/case-studies',
      resource: '/resources',
    }
    return `${basePaths[item.type]}/${item.id}`
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 w-3/4 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-3 w-full bg-muted rounded mb-2" />
                <div className="h-3 w-2/3 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 pt-8 border-t"
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">
          {currentItem ? 'You Might Also Like' : 'Recommended for You'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow group">
              <CardHeader>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
                {item.description && (
                  <CardDescription className="line-clamp-2">
                    {item.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {item.views !== undefined && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{item.views} views</span>
                      </div>
                    )}
                    {item.createdAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <Link href={getContentUrl(item)}>
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

