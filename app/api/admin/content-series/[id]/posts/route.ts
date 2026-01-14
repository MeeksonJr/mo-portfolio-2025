import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'

export const maxDuration = 60

/**
 * POST /api/admin/content-series/[id]/posts
 * Add a post to a content series
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await isAdminUser(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: seriesId } = await params
    const body = await request.json()
    const {
      post_title,
      post_slug,
      order_number,
      status = 'planned',
      scheduled_date,
      outline,
      notes,
    } = body

    if (!post_title || order_number === undefined) {
      return NextResponse.json(
        { error: 'Post title and order number are required' },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('content_series_posts')
      .insert({
        series_id: seriesId,
        post_title,
        post_slug: post_slug || null,
        order_number,
        status,
        scheduled_date: scheduled_date || null,
        outline: outline || null,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating series post:', error)
      return NextResponse.json({ error: 'Failed to create series post' }, { status: 500 })
    }

    // Update total_posts count in series
    await adminClient
      .from('content_series_plans')
      .update({ total_posts: adminClient.rpc('increment', { x: 1 }) })
      .eq('id', seriesId)

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST content-series/[id]/posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

