import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const maxDuration = 30

/**
 * Get popular/trending content based on views and engagement
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7') // Default to last 7 days
    const limit = parseInt(searchParams.get('limit') || '10')
    const contentType = searchParams.get('type') // Optional: filter by content type

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const adminClient = createAdminClient()

    // Get view events for the period
    const { data: viewEvents, error: viewError } = await adminClient
      .from('analytics')
      .select('content_type, content_id, created_at')
      .eq('event_type', 'view')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (viewError) {
      throw viewError
    }

    // Count views per content item
    const contentViews = new Map<string, { views: number; recentViews: number; lastViewed: Date }>()

    viewEvents?.forEach((event) => {
      if (!event.content_type || !event.content_id) return

      const key = `${event.content_type}:${event.content_id}`
      const eventDate = new Date(event.created_at)
      const isRecent = eventDate >= new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours

      const current = contentViews.get(key) || {
        views: 0,
        recentViews: 0,
        lastViewed: eventDate,
      }

      current.views++
      if (isRecent) current.recentViews++
      if (eventDate > current.lastViewed) current.lastViewed = eventDate

      contentViews.set(key, current)
    })

    // Get engagement events (clicks, shares)
    const { data: engagementEvents } = await adminClient
      .from('analytics')
      .select('content_type, content_id, event_type')
      .in('event_type', ['click', 'share'])
      .gte('created_at', startDate.toISOString())

    const contentEngagement = new Map<string, number>()
    engagementEvents?.forEach((event) => {
      if (!event.content_type || !event.content_id) return
      const key = `${event.content_type}:${event.content_id}`
      contentEngagement.set(key, (contentEngagement.get(key) || 0) + 1)
    })

    // Calculate trending scores
    const trendingScores = Array.from(contentViews.entries()).map(([key, data]) => {
      const [type, id] = key.split(':')
      const engagement = contentEngagement.get(key) || 0

      // Trending algorithm: recent views weighted higher
      const score =
        data.recentViews * 3 + // Recent views (last 24h) weighted 3x
        data.views * 1 + // Total views weighted 1x
        engagement * 2 // Engagement weighted 2x

      return {
        type,
        id,
        score,
        views: data.views,
        recentViews: data.recentViews,
        engagement,
        lastViewed: data.lastViewed,
      }
    })

    // Filter by content type if specified
    const filtered = contentType
      ? trendingScores.filter((item) => item.type === contentType)
      : trendingScores

    // Sort by score and get top items
    const topItems = filtered
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    // Fetch content details
    const contentDetails = await Promise.all(
      topItems.map(async (item) => {
        let table = ''
        let selectFields = 'id, title, slug, featured_image, description, excerpt'

        switch (item.type) {
          case 'blog_post':
            table = 'blog_posts'
            selectFields += ', published_at, category, tags'
            break
          case 'case_study':
            table = 'case_studies'
            selectFields += ', published_at'
            break
          case 'project':
            table = 'projects'
            selectFields = 'id, name as title, description, featured_image, created_at as published_at'
            break
          case 'resource':
            table = 'resources'
            selectFields += ', published_at'
            break
          default:
            return null
        }

        const { data } = await adminClient
          .from(table)
          .select(selectFields)
          .eq('id', item.id)
          .eq('status', 'published')
          .single()

        if (!data) return null

        return {
          ...item,
          title: data.title || data.name,
          slug: data.slug,
          image: data.featured_image,
          description: data.description || data.excerpt,
          publishedAt: data.published_at || data.created_at,
          category: data.category,
          tags: data.tags,
        }
      })
    )

    const validContent = contentDetails.filter((item) => item !== null)

    return NextResponse.json({
      period: days,
      content: validContent,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching popular content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular content' },
      { status: 500 }
    )
  }
}

