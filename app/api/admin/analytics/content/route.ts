import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'

export const maxDuration = 60

/**
 * GET /api/admin/analytics/content
 * Get content analytics and performance metrics
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await isAdminUser(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = parseInt(searchParams.get('range') || '30')
    const contentType = searchParams.get('type') || 'all'

    const adminClient = createAdminClient()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - range)

    // Get content counts
    const contentQueries: Promise<any>[] = []
    
    if (contentType === 'all' || contentType === 'blog_post') {
      contentQueries.push(
        adminClient
          .from('blog_posts')
          .select('id, title, views, created_at, published_at')
          .eq('status', 'published')
          .gte('published_at', startDate.toISOString())
      )
    }
    
    if (contentType === 'all' || contentType === 'case_study') {
      contentQueries.push(
        adminClient
          .from('case_studies')
          .select('id, title, views, created_at, published_at')
          .eq('status', 'published')
          .gte('published_at', startDate.toISOString())
      )
    }
    
    if (contentType === 'all' || contentType === 'project') {
      contentQueries.push(
        adminClient
          .from('projects')
          .select('id, name as title, views, created_at')
          .eq('status', 'published')
          .gte('created_at', startDate.toISOString())
      )
    }

    const results = await Promise.all(contentQueries)
    const allContent = results.flat()

    // Calculate statistics
    const totalPosts = allContent.length
    const totalViews = allContent.reduce((sum, item) => sum + (item.views || 0), 0)
    const averageViews = totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0

    // Get engagement data (from feedback table)
    const { data: feedbackData } = await adminClient
      .from('content_feedback')
      .select('content_id, helpful, rating')
      .gte('created_at', startDate.toISOString())

    const totalEngagement = feedbackData?.length || 0
    const averageEngagement = totalPosts > 0 ? Math.round(totalEngagement / totalPosts) : 0
    const engagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0

    // Top content by views
    const topContent = allContent
      .map(item => ({
        id: item.id,
        title: item.title,
        type: contentType === 'all' ? 'mixed' : contentType,
        views: item.views || 0,
        engagement: feedbackData?.filter(f => f.content_id === item.id).length || 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Content by type
    const contentByType: Record<string, number> = {}
    allContent.forEach(item => {
      const type = contentType === 'all' ? 'mixed' : contentType
      contentByType[type] = (contentByType[type] || 0) + 1
    })

    return NextResponse.json({
      totalPosts,
      totalViews,
      totalEngagement,
      averageViews,
      averageEngagement,
      topContent,
      contentByType,
      viewsOverTime: [], // Could be enhanced with time-series data
      engagementRate: Math.round(engagementRate * 10) / 10,
    })
  } catch (error) {
    console.error('Error fetching content analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

