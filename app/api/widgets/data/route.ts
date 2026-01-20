import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface WidgetData {
  type: string
  data: any
  timestamp: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const widgetType = searchParams.get('type') || 'all'
    const limit = parseInt(searchParams.get('limit') || '5')

    const adminClient = createAdminClient()
    const widgets: Record<string, any> = {}

    // Fetch latest blog posts
    if (widgetType === 'all' || widgetType === 'latest-blog') {
      const { data: blogPosts } = await adminClient
        .from('blog_posts')
        .select('id, title, slug, excerpt, featured_image, published_at, views')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit)
      
      widgets.latestBlog = blogPosts || []
    }

    // Fetch latest case studies
    if (widgetType === 'all' || widgetType === 'latest-case-studies') {
      const { data: caseStudies } = await adminClient
        .from('case_studies')
        .select('id, title, slug, description, featured_image, published_at, views')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit)
      
      widgets.latestCaseStudies = caseStudies || []
    }

    // Fetch featured projects
    if (widgetType === 'all' || widgetType === 'featured-projects') {
      const { data: projects } = await adminClient
        .from('projects')
        .select('id, name, description, featured_image, github_url, homepage_url, views, is_featured')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(limit)
      
      widgets.featuredProjects = projects || []
    }

    // Fetch popular resources
    if (widgetType === 'all' || widgetType === 'popular-resources') {
      const { data: resources } = await adminClient
        .from('resources')
        .select('id, title, slug, description, featured_image, type, views, published_at')
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(limit)
      
      widgets.popularResources = resources || []
    }

    // Fetch site statistics
    if (widgetType === 'all' || widgetType === 'site-stats') {
      const [blogPostsCount, caseStudiesCount, projectsCount, resourcesCount] = await Promise.all([
        adminClient.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        adminClient.from('case_studies').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        adminClient.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        adminClient.from('resources').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      ])

      // Get total views
      const [blogViews, caseViews, projectViews, resourceViews] = await Promise.all([
        adminClient.from('blog_posts').select('views').eq('status', 'published'),
        adminClient.from('case_studies').select('views').eq('status', 'published'),
        adminClient.from('projects').select('views').eq('status', 'published'),
        adminClient.from('resources').select('views').eq('status', 'published'),
      ])

      const totalViews = 
        (blogViews.data?.reduce((sum, p) => sum + (p.views || 0), 0) || 0) +
        (caseViews.data?.reduce((sum, c) => sum + (c.views || 0), 0) || 0) +
        (projectViews.data?.reduce((sum, p) => sum + (p.views || 0), 0) || 0) +
        (resourceViews.data?.reduce((sum, r) => sum + (r.views || 0), 0) || 0)

      // Get total comments
      const { count: commentsCount } = await adminClient
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')

      widgets.siteStats = {
        blogPosts: blogPostsCount.count || 0,
        caseStudies: caseStudiesCount.count || 0,
        projects: projectsCount.count || 0,
        resources: resourcesCount.count || 0,
        totalViews,
        totalComments: commentsCount || 0,
        timestamp: new Date().toISOString(),
      }
    }

    // Fetch recent activity (latest comments)
    if (widgetType === 'all' || widgetType === 'recent-activity') {
      const { data: comments } = await adminClient
        .from('comments')
        .select('id, author_name, content, content_type, content_id, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(limit)

      widgets.recentActivity = comments || []
    }

    // Fetch popular content (most viewed)
    if (widgetType === 'all' || widgetType === 'popular-content') {
      const [popularBlogs, popularCases] = await Promise.all([
        adminClient
          .from('blog_posts')
          .select('id, title, slug, views, published_at')
          .eq('status', 'published')
          .order('views', { ascending: false })
          .limit(3),
        adminClient
          .from('case_studies')
          .select('id, title, slug, views, published_at')
          .eq('status', 'published')
          .order('views', { ascending: false })
          .limit(3),
      ])

      widgets.popularContent = {
        blogs: popularBlogs.data || [],
        caseStudies: popularCases.data || [],
      }
    }

    // Fetch music player data (latest songs)
    if (widgetType === 'all' || widgetType === 'music-player') {
      const { data: songs } = await adminClient
        .from('songs')
        .select('id, title, artist, album, genre, file_url, cover_image_url')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(10)

      widgets.musicPlayer = songs || []
    }

    return NextResponse.json({
      success: true,
      widgets,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Error fetching widget data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch widget data', message: error.message },
      { status: 500 }
    )
  }
}

