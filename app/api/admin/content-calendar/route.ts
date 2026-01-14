import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'

export const maxDuration = 60

/**
 * GET /api/admin/content-calendar
 * Fetch content calendar items
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
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const contentType = searchParams.get('contentType')
    const status = searchParams.get('status')

    const adminClient = createAdminClient()

    let query = adminClient
      .from('content_calendar')
      .select('*')
      .order('scheduled_date', { ascending: true, nullsFirst: false })

    if (startDate) {
      query = query.gte('scheduled_date', startDate)
    }
    if (endDate) {
      query = query.lte('scheduled_date', endDate)
    }
    if (contentType) {
      query = query.eq('content_type', contentType)
    }
    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching content calendar:', error)
      return NextResponse.json({ error: 'Failed to fetch content calendar' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in GET content-calendar:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/content-calendar
 * Create a new content calendar item
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
      title,
      content_type,
      status = 'planned',
      scheduled_date,
      published_date,
      due_date,
      priority = 'medium',
      description,
      tags,
      content_id,
      notes,
      metadata,
    } = body

    if (!title || !content_type) {
      return NextResponse.json(
        { error: 'Title and content type are required' },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('content_calendar')
      .insert({
        title,
        content_type,
        status,
        scheduled_date: scheduled_date || null,
        published_date: published_date || null,
        due_date: due_date || null,
        priority,
        description: description || null,
        tags: tags || [],
        content_id: content_id || null,
        notes: notes || null,
        metadata: metadata || {},
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating content calendar item:', error)
      return NextResponse.json({ error: 'Failed to create calendar item' }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST content-calendar:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

