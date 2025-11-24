'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Eye,
  MousePointerClick,
  Share2,
  Clock,
  TrendingUp,
  BarChart3,
  ExternalLink,
  Calendar,
  Activity,
  ArrowUp,
  ArrowDown,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ContentPerformanceData {
  contentId: string
  contentType: string
  period: number
  totalViews: number
  viewsOverTime: Array<{ date: string; views: number }>
  engagement: {
    clicks: number
    shares: number
    engagementRate: number
  }
  timeOnPage: {
    average: number
    totalSessions: number
  }
  scrollDepth: {
    average: number
    totalSessions: number
  }
  bounceRate: number
  sharePlatforms: Record<string, number>
  topReferrers: Array<{ domain: string; count: number }>
  hourlyViews: Array<{ hour: number; views: number }>
}

interface ContentPerformanceInsightsProps {
  contentId: string
  contentType: 'blog_post' | 'case_study' | 'project' | 'resource'
  contentTitle?: string
}

export function ContentPerformanceInsights({
  contentId,
  contentType,
  contentTitle,
}: ContentPerformanceInsightsProps) {
  const [data, setData] = useState<ContentPerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    fetchPerformanceData()
  }, [contentId, contentType, period])

  const fetchPerformanceData = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/analytics/content/${contentId}?type=${contentType}&days=${period}`
      )

      if (!response.ok) {
        // Don't throw error, just set data to null to show empty state
        setData(null)
        return
      }

      const performanceData = await response.json()
      setData(performanceData)
    } catch (error) {
      console.error('Error fetching performance data:', error)
      // Silently fail - don't break the page if analytics fail
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

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}m ${secs}s`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Performance</CardTitle>
          <CardDescription>Loading performance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    // Don't render anything if there's no data - fail silently
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Performance</h2>
          {contentTitle && (
            <p className="text-muted-foreground mt-1">{contentTitle}</p>
          )}
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalViews)}</div>
            <p className="text-xs text-muted-foreground">
              Over {data.period} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.engagement.engagementRate}%</div>
            <p className="text-xs text-muted-foreground">
              {data.engagement.clicks + data.engagement.shares} interactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time on Page</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(data.timeOnPage.average)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.timeOnPage.totalSessions} sessions tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.bounceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {data.bounceRate < 50 ? (
                <span className="text-green-600">Good</span>
              ) : data.bounceRate < 70 ? (
                <span className="text-yellow-600">Average</span>
              ) : (
                <span className="text-red-600">High</span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="time">Time Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
              <CardDescription>Daily view count for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.viewsOverTime.length > 0 ? (
                  data.viewsOverTime.map((item, index) => {
                    const maxViews = Math.max(...data.viewsOverTime.map(v => v.views))
                    const percentage = maxViews > 0 ? (item.views / maxViews) * 100 : 0
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {new Date(item.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="font-medium">{item.views} views</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No views data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Scroll Depth</CardTitle>
                <CardDescription>Average scroll depth percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{data.scrollDepth.average}%</span>
                    <Badge variant={data.scrollDepth.average > 75 ? 'default' : 'secondary'}>
                      {data.scrollDepth.average > 75 ? 'Excellent' : 
                       data.scrollDepth.average > 50 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </div>
                  <Progress value={data.scrollDepth.average} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Based on {data.scrollDepth.totalSessions} sessions
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hourly Distribution</CardTitle>
                <CardDescription>Views by hour of day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {data.hourlyViews.map((item) => {
                    const maxHourlyViews = Math.max(...data.hourlyViews.map(h => h.views))
                    const percentage = maxHourlyViews > 0 ? (item.views / maxHourlyViews) * 100 : 0
                    return (
                      <div key={item.hour} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-12">
                          {item.hour.toString().padStart(2, '0')}:00
                        </span>
                        <Progress value={percentage} className="flex-1 h-2" />
                        <span className="text-xs font-medium w-12 text-right">
                          {item.views}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Clicks</CardTitle>
                <CardDescription>Total click interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center gap-2">
                  <MousePointerClick className="h-6 w-6 text-primary" />
                  {data.engagement.clicks}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shares</CardTitle>
                <CardDescription>Total share interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center gap-2">
                  <Share2 className="h-6 w-6 text-primary" />
                  {data.engagement.shares}
                </div>
              </CardContent>
            </Card>
          </div>

          {Object.keys(data.sharePlatforms).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Share Platforms</CardTitle>
                <CardDescription>Breakdown by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(data.sharePlatforms)
                    .sort(([, a], [, b]) => b - a)
                    .map(([platform, count]) => {
                      const totalShares = Object.values(data.sharePlatforms).reduce((a, b) => a + b, 0)
                      const percentage = (count / totalShares) * 100
                      return (
                        <div key={platform} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="capitalize">{platform}</span>
                            <span className="font-medium">{count} shares</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Referrers</CardTitle>
              <CardDescription>Where your traffic is coming from</CardDescription>
            </CardHeader>
            <CardContent>
              {data.topReferrers.length > 0 ? (
                <div className="space-y-3">
                  {data.topReferrers.map((referrer, index) => {
                    const totalReferrers = data.topReferrers.reduce((a, b) => a + b.count, 0)
                    const percentage = (referrer.count / totalReferrers) * 100
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{referrer.domain}</span>
                          </div>
                          <span className="text-muted-foreground">{referrer.count} visits</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No referrer data available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Time on Page Analysis</CardTitle>
              <CardDescription>How long visitors stay on this content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Time</span>
                  <span className="text-2xl font-bold">
                    {formatTime(data.timeOnPage.average)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sessions Tracked</span>
                  <span className="text-lg font-medium">
                    {data.timeOnPage.totalSessions}
                  </span>
                </div>
                {data.timeOnPage.average > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      {data.timeOnPage.average > 120 ? (
                        <span className="text-green-600">
                          Excellent engagement - visitors are reading thoroughly
                        </span>
                      ) : data.timeOnPage.average > 60 ? (
                        <span className="text-yellow-600">
                          Good engagement - visitors are reading the content
                        </span>
                      ) : (
                        <span className="text-red-600">
                          Low engagement - consider improving content or layout
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

