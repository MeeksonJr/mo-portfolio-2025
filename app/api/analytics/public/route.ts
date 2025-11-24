import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const maxDuration = 30

type AnalyticsRow = {
  content_type: string | null
  content_id: string | null
  event_type: string
  created_at: string
  user_agent: string | null
  referrer: string | null
  ip_address: string | null
  metadata: Record<string, any> | null
}

const getDeviceType = (userAgent: string | null): string => {
  if (!userAgent) return 'Unknown'
  const ua = userAgent.toLowerCase()
  if (/mobile|iphone|android/.test(ua)) return 'Mobile'
  if (/ipad|tablet/.test(ua)) return 'Tablet'
  if (/bot|crawl/.test(ua)) return 'Bot'
  return 'Desktop'
}

const getReferrerSource = (referrer: string | null): string => {
  if (!referrer) return 'Direct'
  try {
    const url = new URL(referrer)
    return url.hostname.replace('www.', '')
  } catch {
    return 'External'
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const adminClient = createAdminClient()

    // Fetch analytics data for the period
    const { data: analyticsRows, error: analyticsError } = await adminClient
      .from('analytics')
      .select('content_type, content_id, event_type, created_at, user_agent, referrer, ip_address, metadata')
      .gte('created_at', startDate.toISOString())

    if (analyticsError || !analyticsRows) {
      throw analyticsError || new Error('Failed to fetch analytics data')
    }

    const viewEvents = analyticsRows.filter((row) => row.event_type === 'view')
    const totalViews = viewEvents.length

    // Views by content type
    const viewsByTypeCount = viewEvents.reduce((acc, item) => {
      if (item.content_type) {
        acc[item.content_type] = (acc[item.content_type] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Content views for top content
    const contentViews = viewEvents.reduce((acc, item) => {
      if (item.content_id) {
        const key = `${item.content_type}:${item.content_id}`
        acc[key] = (acc[key] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const topContentEntries = Object.entries(contentViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([key, views]) => {
        const [type, id] = key.split(':')
        return { type, id, views }
      })

    const topContentWithDetails = await Promise.all(
      topContentEntries.map(async ({ type, id, views }) => {
        let title = 'Unknown'
        let slug: string | null = null

        try {
          if (type === 'blog_post') {
            const { data } = await adminClient
              .from('blog_posts')
              .select('title, slug, status')
              .eq('id', id)
              .eq('status', 'published')
              .single()
            if (data) {
              title = data.title
              slug = data.slug
            }
          } else if (type === 'case_study') {
            const { data } = await adminClient
              .from('case_studies')
              .select('title, slug, status')
              .eq('id', id)
              .eq('status', 'published')
              .single()
            if (data) {
              title = data.title
              slug = data.slug
            }
          } else if (type === 'project') {
            const { data } = await adminClient
              .from('projects')
              .select('name, status')
              .eq('id', id)
              .eq('status', 'published')
              .single()
            if (data) {
              title = data.name
            }
          } else if (type === 'resource') {
            const { data } = await adminClient
              .from('resources')
              .select('title, slug, status')
              .eq('id', id)
              .eq('status', 'published')
              .single()
            if (data) {
              title = data.title
              slug = data.slug
            }
          }
        } catch (error) {
          console.error(`Error fetching ${type} ${id}:`, error)
        }

        return { type, id, views, title, slug }
      })
    )

    // Daily views
    const dailyViews = viewEvents.reduce((acc, item) => {
      const date = new Date(item.created_at).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const dailyViewsArray = Object.entries(dailyViews)
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Event breakdown
    const eventBreakdown = analyticsRows.reduce((acc, item) => {
      acc[item.event_type] = (acc[item.event_type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Unique visitors
    const uniqueVisitors = new Set(
      viewEvents.map((event) => event.ip_address || event.metadata?.client_id).filter(Boolean)
    ).size

    // Referrer stats
    const referrerCounts = viewEvents.reduce((acc, event) => {
      const source = getReferrerSource(event.referrer)
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const referrerTotal = Math.max(viewEvents.length, 1)
    const referrers = Object.entries(referrerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([source, count]) => ({
        source,
        count,
        percentage: Math.round((count / referrerTotal) * 100),
      }))

    // Device stats
    const deviceCounts = viewEvents.reduce((acc, event) => {
      const type = getDeviceType(event.user_agent)
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const devices = Object.entries(deviceCounts).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / Math.max(viewEvents.length, 1)) * 100),
    }))

    const avgViewsPerDay = Math.round(totalViews / Math.max(days, 1))
    const engagementEvents = analyticsRows.filter((row) => row.event_type !== 'view')
    const engagementRate = Math.round(
      (engagementEvents.length / Math.max(totalViews, 1)) * 100
    )

    // Calculate growth (compare with previous period)
    const previousStartDate = new Date(startDate)
    previousStartDate.setDate(previousStartDate.getDate() - days)

    const { count: previousTotalViews } = await adminClient
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'view')
      .gte('created_at', previousStartDate.toISOString())
      .lt('created_at', startDate.toISOString())

    const growthPercentage =
      previousTotalViews && previousTotalViews > 0
        ? Math.round(((totalViews - previousTotalViews) / previousTotalViews) * 100)
        : 0

    return NextResponse.json({
      totalViews,
      previousTotalViews: previousTotalViews || 0,
      growthPercentage,
      viewsByType: viewsByTypeCount,
      topContent: topContentWithDetails.filter((item) => item.title !== 'Unknown'),
      dailyViews: dailyViewsArray,
      period: days,
      eventBreakdown,
      referrers,
      devices,
      avgViewsPerDay,
      uniqueVisitors,
      engagementRate,
    })
  } catch (error) {
    console.error('Error fetching public analytics:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch analytics',
        totalViews: 0,
        previousTotalViews: 0,
        growthPercentage: 0,
        viewsByType: {},
        topContent: [],
        dailyViews: [],
        period: 30,
        eventBreakdown: {},
        referrers: [],
        devices: [],
        avgViewsPerDay: 0,
        uniqueVisitors: 0,
        engagementRate: 0,
      },
      { status: 500 }
    )
  }
}

