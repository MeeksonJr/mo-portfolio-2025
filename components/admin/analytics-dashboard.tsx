'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Eye, TrendingUp, Users, ExternalLink, Calendar, ArrowUp, ArrowDown, Clock, FileText, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'

interface AnalyticsData {
  totalViews: number
  previousTotalViews: number
  growthPercentage: number
  viewsByType: Record<string, number>
  topContent: Array<{ type: string; id: string; views: number; title: string; slug: string | null; status: string | null }>
  topReferrers: Array<{ domain: string; count: number }>
  dailyViews: Array<{ date: string; views: number }>
  hourlyViews: Array<{ hour: number; views: number }>
  statusBreakdown: Record<string, { published: number; draft: number; other: number }>
  period: number
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Get session token for authentication (same pattern as music upload)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        console.error('No session found')
        setData(null)
        return
      }

      const response = await fetch(`/api/admin/analytics/overview?days=${period}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized - session may have expired')
          setData(null)
          return
        }
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to fetch analytics')
      }
      
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Show user-friendly error message
      if (error instanceof Error) {
        console.error('Error details:', error.message)
      }
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No analytics data available</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground">
            View analytics for the last {period} days
          </p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalViews.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-1">
              {data.growthPercentage !== 0 && (
                <div className={`flex items-center gap-1 text-xs ${data.growthPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.growthPercentage > 0 ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {Math.abs(data.growthPercentage).toFixed(1)}%
                </div>
              )}
              <p className="text-xs text-muted-foreground">vs previous period</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Views</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.period > 0 ? Math.round(data.totalViews / data.period).toLocaleString() : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per day average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.hourlyViews && data.hourlyViews.length > 0
                ? `${data.hourlyViews.reduce((max, h) => h.views > max.views ? h : max, data.hourlyViews[0]).hour}:00`
                : '—'}
            </div>
            <p className="text-xs text-muted-foreground">Most active today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Types</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(data.viewsByType).length}
            </div>
            <p className="text-xs text-muted-foreground">Active content types</p>
          </CardContent>
        </Card>
      </div>

      {/* Views by Content Type */}
      <Card>
        <CardHeader>
          <CardTitle>Views by Content Type</CardTitle>
          <CardDescription>Breakdown of views by content category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(data.viewsByType).map(([type, views]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize">
                    {type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(views / data.totalViews) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-16 text-right">
                    {views.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Content</CardTitle>
            <CardDescription>Most viewed content items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topContent.slice(0, 10).map((item, index) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground w-6 flex-shrink-0">
                      #{index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{item.title}</span>
                        {item.status && (
                          <Badge variant={item.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                            {item.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">
                        {item.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold flex-shrink-0 ml-2">{item.views.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>Traffic sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topReferrers.map((referrer, index) => (
                <div
                  key={referrer.domain}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium">{referrer.domain}</span>
                  </div>
                  <span className="text-sm font-semibold">{referrer.count} visits</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Views</CardTitle>
            <CardDescription>Views over the last {period} days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.dailyViews.length > 0 ? (
                <div className="flex items-end gap-1 h-64">
                  {data.dailyViews.map((day) => {
                    const maxViews = Math.max(...data.dailyViews.map((d) => d.views), 1)
                    const height = maxViews > 0 ? (day.views / maxViews) * 100 : 0
                    return (
                      <div
                        key={day.date}
                        className="flex-1 flex flex-col items-center gap-1 group"
                      >
                        <div
                          className="w-full bg-primary rounded-t transition-all hover:bg-primary/80 min-h-[4px]"
                          style={{ height: `${Math.max(height, 2)}%` }}
                          title={`${new Date(day.date).toLocaleDateString()}: ${day.views} views`}
                        />
                        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          {new Date(day.date).getDate()}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No data available for this period
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Views (Today)</CardTitle>
            <CardDescription>Views distribution throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.hourlyViews && data.hourlyViews.length > 0 ? (
                <div className="flex items-end gap-1 h-64">
                  {data.hourlyViews.map((hour) => {
                    const maxViews = Math.max(...data.hourlyViews.map((h) => h.views), 1)
                    const height = maxViews > 0 ? (hour.views / maxViews) * 100 : 0
                    return (
                      <div
                        key={hour.hour}
                        className="flex-1 flex flex-col items-center gap-1 group"
                      >
                        <div
                          className="w-full bg-primary rounded-t transition-all hover:bg-primary/80 min-h-[4px]"
                          style={{ height: `${Math.max(height, 2)}%` }}
                          title={`${hour.hour}:00 - ${hour.views} views`}
                        />
                        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          {hour.hour}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No data available for today
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Status Breakdown */}
      {Object.keys(data.statusBreakdown || {}).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Content Status Breakdown</CardTitle>
            <CardDescription>Views by content status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.statusBreakdown).map(([type, breakdown]) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {type.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-green-600">
                        Published: {breakdown.published}
                      </span>
                      <span className="text-yellow-600">
                        Draft: {breakdown.draft}
                      </span>
                      {breakdown.other > 0 && (
                        <span className="text-muted-foreground">
                          Other: {breakdown.other}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 flex overflow-hidden">
                    {breakdown.published > 0 && (
                      <div
                        className="bg-green-600 h-full"
                        style={{
                          width: `${(breakdown.published / (breakdown.published + breakdown.draft + breakdown.other)) * 100}%`,
                        }}
                      />
                    )}
                    {breakdown.draft > 0 && (
                      <div
                        className="bg-yellow-600 h-full"
                        style={{
                          width: `${(breakdown.draft / (breakdown.published + breakdown.draft + breakdown.other)) * 100}%`,
                        }}
                      />
                    )}
                    {breakdown.other > 0 && (
                      <div
                        className="bg-muted-foreground h-full"
                        style={{
                          width: `${(breakdown.other / (breakdown.published + breakdown.draft + breakdown.other)) * 100}%`,
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

