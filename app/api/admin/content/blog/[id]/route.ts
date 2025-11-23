import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const adminClient = createAdminClient()

    // If status is being set to published and published_at is not set, set it to now
    const updateData: any = {
      ...body,
      updated_at: new Date().toISOString(),
    }

    // Handle published_at when status is published
    if (body.status === 'published' && !body.published_at) {
      // Check if the post already has a published_at date
      const { data: existingPost } = await adminClient
        .from('blog_posts')
        .select('published_at')
        .eq('id', id)
        .single()

      // Only set published_at if it doesn't exist
      if (!existingPost?.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }

    // Handle published_at date conversion if provided
    if (body.published_at) {
      updateData.published_at = new Date(body.published_at).toISOString()
    }

    const { data, error } = await adminClient
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}

