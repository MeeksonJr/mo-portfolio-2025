'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, Eye, TrendingUp, FileText, FolderGit2, 
  BookOpen, Wrench, Calendar, ArrowUp, ArrowDown, 
  Clock, Activity, Globe, Users
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import Link from 'next/link'

interface PublicAnalyticsData {
  totalViews: number
  previousTotalViews: number
  growthPercentage: number
  viewsByType: Record<string, number>
  topContent: Array<{ type: string; id: string; views: number; title: string; slug: string | null }>
  dailyViews: Array<{ date: string; views: number }>
  period: number
}

const contentTypeIcons = {
  blog_post: FileText,
  case_study: BookOpen,
  project: FolderGit2,
  resource: Wrench,
}

const contentTypeLabels = {
  blog_post: 'Blog Posts',
  case_study: 'Case Studies',
  project: 'Projects',
  resource: 'Resources',
}

const contentTypeColors = {
  blog_post: 'text-blue-500',
  case_study: 'text-purple-500',
  project: 'text-green-500',
  resource: 'text-orange-500',
}

export default function PublicAnalyticsDashboard() {
  const [data, setData] = useState<PublicAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/public?days=${period}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getContentUrl = (type: string, slug: string | null) => {
    if (!slug) return '#'
    switch (type) {
      case 'blog_post':
        return `/blog/${slug}`
      case 'case_study':
        return `/case-studies/${slug}`
      case 'resource':
        return `/resources/${slug}`
      case 'project':
        return `/projects/${slug}`
      default:
        return '#'
    }
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
        <FooterLight />
      </>
    )
  }

  if (!data) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Analytics Unavailable</CardTitle>
              <CardDescription>
                Unable to load analytics data at this time.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <FooterLight />
      </>
    )
  }

  const totalViewsByType = Object.values(data.viewsByType).reduce((sum, count) => sum + count, 0)
  const maxDailyViews = Math.max(...data.dailyViews.map(d => d.views), 1)

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <BarChart3 className="h-10 w-10 text-primary" />
              Portfolio Analytics
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Public statistics showing portfolio engagement and popular content
            </p>
          </motion.div>

          {/* Period Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 flex justify-end"
          >
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="h-5 w-5 text-primary" />
                    Total Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">
                    {formatNumber(data.totalViews)}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {data.growthPercentage >= 0 ? (
                      <>
                        <ArrowUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">
                          {data.growthPercentage}% growth
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowDown className="h-4 w-4 text-red-500" />
                        <span className="text-red-500">
                          {Math.abs(data.growthPercentage)}% decrease
                        </span>
                      </>
                    )}
                    <span className="text-muted-foreground">
                      vs previous {data.period} days
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-primary" />
                    Content Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">
                    {Object.keys(data.viewsByType).length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Different content types viewed
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Top Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">
                    {data.topContent.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Most viewed pieces
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Views by Content Type */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Views by Content Type
                  </CardTitle>
                  <CardDescription>
                    Breakdown of views across different content types
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(data.viewsByType)
                    .sort(([, a], [, b]) => b - a)
                    .map(([type, views]) => {
                      const Icon = contentTypeIcons[type as keyof typeof contentTypeIcons] || FileText
                      const percentage = totalViewsByType > 0 
                        ? Math.round((views / totalViewsByType) * 100) 
                        : 0
                      
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 ${contentTypeColors[type as keyof typeof contentTypeColors] || 'text-primary'}`} />
                              <span className="font-medium">
                                {contentTypeLabels[type as keyof typeof contentTypeLabels] || type}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{formatNumber(views)}</span>
                              <Badge variant="secondary">{percentage}%</Badge>
                            </div>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Daily Views Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Daily Views
                  </CardTitle>
                  <CardDescription>
                    Views over the last {data.period} days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.dailyViews.slice(-14).map((day, idx) => {
                      const date = new Date(day.date)
                      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
                      const dayNumber = date.getDate()
                      const height = (day.views / maxDailyViews) * 100
                      
                      return (
                        <div key={idx} className="flex items-end gap-2">
                          <div className="flex-1 text-xs text-muted-foreground min-w-[60px]">
                            {dayName} {dayNumber}
                          </div>
                          <div className="flex-1 flex items-end gap-1">
                            <div
                              className="bg-primary rounded-t transition-all"
                              // eslint-disable-next-line react/forbid-dom-props
                              style={{ height: `${Math.max(height, 5)}%`, minHeight: '4px', width: '100%' }}
                              title={`${day.views} views`}
                            />
                          </div>
                          <div className="text-xs font-medium min-w-[40px] text-right">
                            {day.views}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Top Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Most Popular Content
                </CardTitle>
                <CardDescription>
                  Top content by views in the last {data.period} days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.topContent.length > 0 ? (
                  <div className="space-y-3">
                    {data.topContent.map((item, idx) => {
                      const Icon = contentTypeIcons[item.type as keyof typeof contentTypeIcons] || FileText
                      const url = getContentUrl(item.type, item.slug)
                      
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + idx * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                              <span className="text-sm font-bold text-primary">
                                {idx + 1}
                              </span>
                            </div>
                            <Icon className={`h-5 w-5 ${contentTypeColors[item.type as keyof typeof contentTypeColors] || 'text-primary'}`} />
                            <div className="flex-1">
                              {url !== '#' ? (
                                <Link
                                  href={url}
                                  className="font-medium hover:underline"
                                >
                                  {item.title}
                                </Link>
                              ) : (
                                <span className="font-medium">{item.title}</span>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {contentTypeLabels[item.type as keyof typeof contentTypeLabels] || item.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-bold">{formatNumber(item.views)}</div>
                              <div className="text-xs text-muted-foreground">views</div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No content views recorded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  About These Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-1">Privacy-First</p>
                    <p className="text-muted-foreground">
                      All data is anonymized. No personal information is collected or displayed.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Real-Time Updates</p>
                    <p className="text-muted-foreground">
                      Statistics update automatically as visitors explore the portfolio.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Content Insights</p>
                    <p className="text-muted-foreground">
                      See which projects, blog posts, and case studies resonate most with visitors.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Growth Tracking</p>
                    <p className="text-muted-foreground">
                      Monitor portfolio growth and engagement trends over time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <FooterLight />
    </>
  )
}

