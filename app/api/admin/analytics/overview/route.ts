import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Try Authorization header first (most reliable, same pattern as music upload)
    const authHeader = request.headers.get('authorization')
    let userId: string | null = null
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      
      const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      
      const { data: userData } = await tempClient.auth.getUser()
      if (userData?.user) {
        userId = userData.user.id
        console.log('Analytics API - User ID from Authorization header:', userId)
      }
    }
    
    // Fallback: Try createServerClient
    if (!userId) {
      try {
        const supabase = await createServerClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          userId = session.user.id
          console.log('Analytics API - User ID from createServerClient:', userId)
        } else {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user) {
            userId = user.id
            console.log('Analytics API - User ID from createServerClient.getUser():', userId)
          }
        }
      } catch (error) {
        console.log('Analytics API - createServerClient failed:', error)
      }
    }

    // Last resort: Try reading cookies directly from request
    if (!userId) {
      const cookieHeader = request.headers.get('cookie') || ''
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
      
      // Parse cookies
      const cookies: Record<string, string> = {}
      cookieHeader.split(';').forEach((cookie) => {
        const [name, ...rest] = cookie.trim().split('=')
        if (name) {
          cookies[name] = decodeURIComponent(rest.join('='))
        }
      })
      
      // Try to find auth token
      const authCookieName = `sb-${projectRef}-auth-token`
      const authCookie = cookies[authCookieName] || cookies[`${authCookieName}.0`] || cookies[`${authCookieName}.1`]
      
      if (authCookie) {
        try {
          const parsed = typeof authCookie === 'string' ? JSON.parse(authCookie) : authCookie
          
          if (parsed?.access_token) {
            const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
              global: {
                headers: {
                  Authorization: `Bearer ${parsed.access_token}`,
                },
              },
            })
            const { data } = await tempClient.auth.getUser()
            if (data?.user) {
              userId = data.user.id
              console.log('Analytics API - User ID from cookie access_token:', userId)
            }
          } else if (parsed?.user?.id) {
            userId = parsed.user.id
            console.log('Analytics API - User ID from cookie user object:', userId)
          }
        } catch (e) {
          console.log('Analytics API - Failed to parse auth cookie:', e)
        }
      }
    }

    if (!userId) {
      console.error('Analytics API: No user found after all attempts')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin using admin client to bypass RLS
    const adminClient = createAdminClient()
    const { data: userRole, error: roleError } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()

    const isAdmin = !roleError && userRole && userRole.role === 'admin'
    if (!isAdmin) {
      console.error('Analytics API: User is not admin', { userId, roleError })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get total views
    const { count: totalViews } = await adminClient
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'view')
      .gte('created_at', startDate.toISOString())

    // Get views by content type
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

    // Get top content
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

    const topContentList = Object.entries(contentViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([key, views]) => {
        const [type, id] = key.split(':')
        return { type, id, views }
      })

    // Get referrers
    const { data: referrers } = await adminClient
      .from('analytics')
      .select('referrer')
      .eq('event_type', 'view')
      .gte('created_at', startDate.toISOString())
      .not('referrer', 'is', null)

    const referrerCounts = referrers?.reduce((acc, item) => {
      if (item.referrer) {
        try {
          const url = new URL(item.referrer)
          const domain = url.hostname
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

    // Get daily views for the last 30 days
    const { data: dailyViews } = await adminClient
      .from('analytics')
      .select('created_at')
      .eq('event_type', 'view')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    const dailyViewsMap: Record<string, number> = {}
    dailyViews?.forEach((item) => {
      const date = new Date(item.created_at).toISOString().split('T')[0]
      dailyViewsMap[date] = (dailyViewsMap[date] || 0) + 1
    })

    const dailyViewsList = Object.entries(dailyViewsMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, views]) => ({ date, views }))

    return NextResponse.json({
      totalViews: totalViews || 0,
      viewsByType: viewsByTypeCount,
      topContent: topContentList,
      topReferrers,
      dailyViews: dailyViewsList,
      period: days,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

