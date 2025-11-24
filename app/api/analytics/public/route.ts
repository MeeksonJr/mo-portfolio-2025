import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const maxDuration = 30

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const adminClient = createAdminClient()

    // Get total views (public-safe, no sensitive data)
    const { count: totalViews } = await adminClient
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'view')
      .gte('created_at', startDate.toISOString())

    // Get views by content type (public-safe)
    const { data: viewsByType } = await adminClient
      .from('analytics')
      .select('content_type')
      .eq('event_type', 'view')
      .gte('created_at', startDate.toISOString())
      .not('content_type', 'is', null)

    const viewsByTypeCount = viewsByType?.reduce((acc, item) => {
      if (item.content_type) {
        acc[item.content_type] = (acc[item.content_type] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    // Get top content (only published content, public-safe)
    const { data: topContent } = await adminClient
      .from('analytics')
      .select('content_type, content_id')
      .eq('event_type', 'view')
      .gte('created_at', startDate.toISOString())
      .not('content_id', 'is', null)

    const contentViews = topContent?.reduce((acc, item) => {
      if (item.content_id) {
        const key = `${item.content_type}:${item.content_id}`
        acc[key] = (acc[key] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    // Get top content with titles (only published)
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

    // Get daily views (public-safe, anonymized)
    const { data: dailyViewsData } = await adminClient
      .from('analytics')
      .select('created_at')
      .eq('event_type', 'view')
      .gte('created_at', startDate.toISOString())

    const dailyViews = dailyViewsData?.reduce((acc, item) => {
      const date = new Date(item.created_at).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    const dailyViewsArray = Object.entries(dailyViews)
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date))

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
        ? Math.round(((totalViews || 0) - previousTotalViews) / previousTotalViews) * 100
        : 0

    return NextResponse.json({
      totalViews: totalViews || 0,
      previousTotalViews: previousTotalViews || 0,
      growthPercentage,
      viewsByType: viewsByTypeCount,
      topContent: topContentWithDetails.filter((item) => item.title !== 'Unknown'),
      dailyViews: dailyViewsArray,
      period: days,
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
      },
      { status: 500 }
    )
  }
}

