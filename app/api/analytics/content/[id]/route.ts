import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const maxDuration = 30

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get('type') // 'blog_post', 'case_study', 'project', 'resource'
    const days = parseInt(searchParams.get('days') || '30')

    if (!contentType || !params.id) {
      return NextResponse.json(
        { error: 'Content type and ID are required' },
        { status: 400 }
      )
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const adminClient = createAdminClient()

    // Get views over time
    const { data: viewsData } = await adminClient
      .from('analytics')
      .select('created_at')
      .eq('event_type', 'view')
      .eq('content_type', contentType)
      .eq('content_id', params.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    // Group views by date
    const viewsOverTime = viewsData?.reduce((acc, item) => {
      const date = new Date(item.created_at).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    const viewsOverTimeArray = Object.entries(viewsOverTime)
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Get total views
    const totalViews = viewsData?.length || 0

    // Get engagement events (clicks, shares)
    const { data: engagementData } = await adminClient
      .from('analytics')
      .select('event_type, created_at')
      .eq('content_type', contentType)
      .eq('content_id', params.id)
      .in('event_type', ['click', 'share'])
      .gte('created_at', startDate.toISOString())

    const clicks = engagementData?.filter(e => e.event_type === 'click').length || 0
    const shares = engagementData?.filter(e => e.event_type === 'share').length || 0

    // Calculate engagement rate (clicks + shares / views)
    const engagementRate = totalViews > 0 
      ? Math.round(((clicks + shares) / totalViews) * 100 * 100) / 100 
      : 0

    // Get time on page data (if available in metadata)
    const { data: timeOnPageData } = await adminClient
      .from('analytics')
      .select('metadata, created_at')
      .eq('event_type', 'view')
      .eq('content_type', contentType)
      .eq('content_id', params.id)
      .gte('created_at', startDate.toISOString())
      .not('metadata', 'is', null)

    const timeOnPageValues = timeOnPageData
      ?.map(item => {
        const metadata = item.metadata as any
        return metadata?.timeOnPage ? parseFloat(metadata.timeOnPage) : null
      })
      .filter((time): time is number => time !== null) || []

    const averageTimeOnPage = timeOnPageValues.length > 0
      ? Math.round(timeOnPageValues.reduce((a, b) => a + b, 0) / timeOnPageValues.length)
      : 0

    // Get scroll depth data (if available in metadata)
    const scrollDepthValues = timeOnPageData
      ?.map(item => {
        const metadata = item.metadata as any
        return metadata?.scrollDepth ? parseFloat(metadata.scrollDepth) : null
      })
      .filter((depth): depth is number => depth !== null) || []

    const averageScrollDepth = scrollDepthValues.length > 0
      ? Math.round(scrollDepthValues.reduce((a, b) => a + b, 0) / scrollDepthValues.length)
      : 0

    // Get share platforms breakdown
    const { data: shareData } = await adminClient
      .from('analytics')
      .select('metadata')
      .eq('event_type', 'share')
      .eq('content_type', contentType)
      .eq('content_id', params.id)
      .gte('created_at', startDate.toISOString())

    const sharePlatforms = shareData?.reduce((acc, item) => {
      const metadata = item.metadata as any
      const platform = metadata?.platform || 'unknown'
      acc[platform] = (acc[platform] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Get referrers
    const { data: referrerData } = await adminClient
      .from('analytics')
      .select('referrer')
      .eq('event_type', 'view')
      .eq('content_type', contentType)
      .eq('content_id', params.id)
      .gte('created_at', startDate.toISOString())
      .not('referrer', 'is', null)

    const referrerCounts = referrerData?.reduce((acc, item) => {
      if (item.referrer) {
        try {
          const url = new URL(item.referrer)
          const domain = url.hostname.replace('www.', '')
          acc[domain] = (acc[domain] || 0) + 1
        } catch {
          acc[item.referrer] = (acc[item.referrer] || 0) + 1
        }
      }
      return acc
    }, {} as Record<string, number>) || {}

    const topReferrers = Object.entries(referrerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([domain, count]) => ({ domain, count }))

    // Calculate bounce rate (single page views / total views)
    // For now, we'll estimate based on views with very short time on page
    const bounceViews = timeOnPageValues.filter(time => time < 5).length
    const bounceRate = totalViews > 0
      ? Math.round((bounceViews / totalViews) * 100 * 100) / 100
      : 0

    // Get hourly distribution
    const hourlyViews = viewsData?.reduce((acc, item) => {
      const hour = new Date(item.created_at).getHours()
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {} as Record<number, number>) || {}

    const hourlyViewsArray = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      views: hourlyViews[hour] || 0,
    }))

    return NextResponse.json({
      contentId: params.id,
      contentType,
      period: days,
      totalViews,
      viewsOverTime: viewsOverTimeArray,
      engagement: {
        clicks,
        shares,
        engagementRate,
      },
      timeOnPage: {
        average: averageTimeOnPage,
        totalSessions: timeOnPageValues.length,
      },
      scrollDepth: {
        average: averageScrollDepth,
        totalSessions: scrollDepthValues.length,
      },
      bounceRate,
      sharePlatforms,
      topReferrers,
      hourlyViews: hourlyViewsArray,
    })
  } catch (error) {
    console.error('Error fetching content performance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content performance' },
      { status: 500 }
    )
  }
}

