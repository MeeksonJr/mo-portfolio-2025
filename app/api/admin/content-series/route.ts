import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'

export const maxDuration = 60

/**
 * GET /api/admin/content-series
 * Fetch content series plans
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
    const status = searchParams.get('status')

    const adminClient = createAdminClient()

    let query = adminClient
      .from('content_series_plans')
      .select('*, content_series_posts(*)')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching content series:', error)
      return NextResponse.json({ error: 'Failed to fetch content series' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in GET content-series:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/content-series
 * Create a new content series plan
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await isAdminUser(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      series_name,
      series_slug,
      description,
      total_posts = 0,
      status = 'planning',
      start_date,
      target_completion_date,
      tags,
      metadata,
    } = body

    if (!series_name || !series_slug) {
      return NextResponse.json(
        { error: 'Series name and slug are required' },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('content_series_plans')
      .insert({
        series_name,
        series_slug,
        description: description || null,
        total_posts,
        status,
        start_date: start_date || null,
        target_completion_date: target_completion_date || null,
        tags: tags || [],
        metadata: metadata || {},
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating content series:', error)
      return NextResponse.json({ error: 'Failed to create content series' }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST content-series:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

