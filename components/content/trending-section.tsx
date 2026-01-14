'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Clock, Eye, ArrowRight, FileText, FolderGit2, BookOpen, Wrench } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import Image from 'next/image'
import { formatRelativeTime } from '@/lib/content-freshness'

interface TrendingContent {
  type: string
  id: string
  score: number
  views: number
  recentViews: number
  engagement: number
  title: string
  slug: string | null
  image: string | null
  description: string | null
  publishedAt?: string
  category?: string | null
  tags?: string[] | null
}

interface TrendingData {
  period: number
  content: TrendingContent[]
  generatedAt: string
}

const contentTypeIcons = {
  blog_post: FileText,
  case_study: BookOpen,
  project: FolderGit2,
  resource: Wrench,
}

const contentTypeLabels = {
  blog_post: 'Blog Post',
  case_study: 'Case Study',
  project: 'Project',
  resource: 'Resource',
}

const contentTypeColors = {
  blog_post: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
  case_study: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
  project: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
  resource: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
}

interface TrendingSectionProps {
  period?: number // Days to look back (7, 30, 90)
  limit?: number
  showTabs?: boolean
}

export default function TrendingSection({
  period = 7,
  limit = 6,
  showTabs = true,
}: TrendingSectionProps) {
  const [data, setData] = useState<TrendingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState(period)

  useEffect(() => {
    fetchTrendingContent()
  }, [selectedPeriod])

  const fetchTrendingContent = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/analytics/popular?days=${selectedPeriod}&limit=${limit}`)
      if (response.ok) {
        const data = await response.json()
        setData(data)
      }
    } catch (error) {
      console.error('Error fetching trending content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getContentUrl = (item: TrendingContent): string => {
    switch (item.type) {
      case 'blog_post':
        return `/blog/${item.slug}`
      case 'case_study':
        return `/case-studies/${item.slug}`
      case 'project':
        return `/projects/${item.slug || item.id}`
      case 'resource':
        return `/resources/${item.slug}`
      default:
        return '#'
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(limit)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded mb-4" />
              <div className="h-3 bg-muted rounded w-full mb-2" />
              <div className="h-3 bg-muted rounded w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data || data.content.length === 0) {
    return null
  }

  const contentByType = data.content.reduce(
    (acc, item) => {
      if (!acc[item.type]) acc[item.type] = []
      acc[item.type].push(item)
      return acc
    },
    {} as Record<string, TrendingContent[]>
  )

  const allContent = data.content

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mb-16"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-primary" size={28} />
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Trending Content</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Most popular content in the last {selectedPeriod} days
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setSelectedPeriod(days)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === days
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {showTabs && Object.keys(contentByType).length > 1 ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({allContent.length})</TabsTrigger>
            {Object.entries(contentByType).map(([type, items]) => (
              <TabsTrigger key={type} value={type}>
                {contentTypeLabels[type as keyof typeof contentTypeLabels]} ({items.length})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <ContentGrid content={allContent} getContentUrl={getContentUrl} />
          </TabsContent>

          {Object.entries(contentByType).map(([type, items]) => (
            <TabsContent key={type} value={type} className="mt-6">
              <ContentGrid content={items} getContentUrl={getContentUrl} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <ContentGrid content={allContent} getContentUrl={getContentUrl} />
      )}
    </motion.section>
  )
}

function ContentGrid({
  content,
  getContentUrl,
}: {
  content: TrendingContent[]
  getContentUrl: (item: TrendingContent) => string
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {content.map((item, index) => {
        const Icon = contentTypeIcons[item.type as keyof typeof contentTypeIcons] || FileText
        const badgeColor =
          contentTypeColors[item.type as keyof typeof contentTypeColors] ||
          'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30'

        return (
          <motion.div
            key={`${item.type}-${item.id}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={getContentUrl(item)}>
              <Card className="h-full hover:shadow-lg transition-shadow group bg-background/95 backdrop-blur-sm">
                {item.image && (
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={badgeColor} variant="outline">
                        <Icon className="h-3 w-3 mr-1" />
                        {contentTypeLabels[item.type as keyof typeof contentTypeLabels]}
                      </Badge>
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                    {!item.image && (
                      <Badge className={badgeColor} variant="outline">
                        <Icon className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <CardDescription className="line-clamp-2">
                      {item.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{item.views}</span>
                      </div>
                      {item.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatRelativeTime(item.publishedAt)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                      <span className="text-xs font-medium">View</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}

