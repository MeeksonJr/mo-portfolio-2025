import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'

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
      .from('resources')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting resource:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete resource' },
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
      // Check if the resource already has a published_at date
      const { data: existingResource } = await adminClient
        .from('resources')
        .select('published_at')
        .eq('id', id)
        .single()

      // Only set published_at if it doesn't exist
      if (!existingResource?.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }

    // Handle published_at date conversion if provided
    if (body.published_at) {
      updateData.published_at = new Date(body.published_at).toISOString()
    }

    const { data, error } = await adminClient
      .from('resources')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    console.error('Error updating resource:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update resource' },
      { status: 500 }
    )
  }
}

