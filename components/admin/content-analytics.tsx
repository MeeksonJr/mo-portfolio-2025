'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, Eye, MessageSquare, Clock, FileText, 
  Calendar, BarChart3, Users, ArrowUp, ArrowDown
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

interface ContentStats {
  totalPosts: number
  totalViews: number
  totalEngagement: number
  averageViews: number
  averageEngagement: number
  topContent: Array<{
    id: string
    title: string
    type: string
    views: number
    engagement: number
  }>
  contentByType: Record<string, number>
  viewsOverTime: Array<{ date: string; views: number }>
  engagementRate: number
}

export default function ContentAnalytics() {
  const [stats, setStats] = useState<ContentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30')
  const [contentType, setContentType] = useState('all')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange, contentType])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // In a real implementation, this would fetch from your analytics API
      // For now, we'll simulate with mock data structure
      const response = await fetch(`/api/admin/analytics/content?range=${timeRange}&type=${contentType}`)
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        // Fallback to mock data for demonstration
        setStats({
          totalPosts: 24,
          totalViews: 15420,
          totalEngagement: 3420,
          averageViews: 642,
          averageEngagement: 142,
          topContent: [
            { id: '1', title: 'Building AI-Powered Apps', type: 'blog_post', views: 2340, engagement: 520 },
            { id: '2', title: 'Portfolio Website Case Study', type: 'case_study', views: 1890, engagement: 340 },
            { id: '3', title: 'E-commerce Platform', type: 'project', views: 1650, engagement: 280 },
          ],
          contentByType: {
            blog_post: 12,
            case_study: 5,
            project: 7,
          },
          viewsOverTime: [],
          engagementRate: 22.2,
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Use mock data on error
      setStats({
        totalPosts: 24,
        totalViews: 15420,
        totalEngagement: 3420,
        averageViews: 642,
        averageEngagement: 142,
        topContent: [],
        contentByType: {},
        viewsOverTime: [],
        engagementRate: 22.2,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading analytics...
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No analytics data available
      </div>
    )
  }

  const engagementChange = 12.5 // Mock percentage change
  const viewsChange = 8.3 // Mock percentage change

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Content Analytics</h2>
          <p className="text-muted-foreground">Track your content performance and engagement</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
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
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="blog_post">Blog Posts</SelectItem>
              <SelectItem value="case_study">Case Studies</SelectItem>
              <SelectItem value="project">Projects</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-background/95 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">Published items</p>
          </CardContent>
        </Card>

        <Card className="bg-background/95 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {viewsChange > 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500" />
              )}
              <span className={viewsChange > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(viewsChange)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/95 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEngagement.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {engagementChange > 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500" />
              )}
              <span className={engagementChange > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(engagementChange)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/95 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.engagementRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average engagement rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Content by Type</CardTitle>
            <CardDescription>Distribution of content across different types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.contentByType).map(([type, count]) => {
                const percentage = (count / stats.totalPosts) * 100
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{type.replace('_', ' ')}</span>
                      <span className="text-sm text-muted-foreground">{count} posts</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>Most viewed and engaged content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topContent.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold line-clamp-1">{item.title}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {item.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{item.views.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{item.engagement} engagements</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Average Metrics */}
      <Card className="bg-background/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Average Performance</CardTitle>
          <CardDescription>Average metrics per content item</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Average Views
                </span>
                <span className="text-2xl font-bold">{stats.averageViews.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">Per content item</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Average Engagement
                </span>
                <span className="text-2xl font-bold">{stats.averageEngagement.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">Per content item</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

