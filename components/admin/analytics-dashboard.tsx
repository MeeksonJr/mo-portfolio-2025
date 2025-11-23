'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Eye, TrendingUp, Users, ExternalLink, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AnalyticsData {
  totalViews: number
  viewsByType: Record<string, number>
  topContent: Array<{ type: string; id: string; views: number }>
  topReferrers: Array<{ domain: string; count: number }>
  dailyViews: Array<{ date: string; views: number }>
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
      const response = await fetch(`/api/admin/analytics/overview?days=${period}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
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
            <p className="text-xs text-muted-foreground">Last {period} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Types</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(data.viewsByType).length}
            </div>
            <p className="text-xs text-muted-foreground">Active content types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Content</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.topContent.length}</div>
            <p className="text-xs text-muted-foreground">Tracked items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referrers</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.topReferrers.length}</div>
            <p className="text-xs text-muted-foreground">Traffic sources</p>
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
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <div>
                      <span className="text-sm font-medium capitalize">
                        {item.type.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-muted-foreground">{item.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{item.views} views</span>
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
                  const maxViews = Math.max(...data.dailyViews.map((d) => d.views))
                  const height = maxViews > 0 ? (day.views / maxViews) * 100 : 0
                  return (
                    <div
                      key={day.date}
                      className="flex-1 flex flex-col items-center gap-1 group"
                    >
                      <div
                        className="w-full bg-primary rounded-t transition-all hover:bg-primary/80 min-h-[4px]"
                        style={{ height: `${Math.max(height, 2)}%` }}
                        title={`${day.date}: ${day.views} views`}
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
    </div>
  )
}

