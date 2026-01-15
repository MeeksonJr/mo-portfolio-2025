import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const revalidate = 0
export const dynamic = 'force-dynamic'

// PUT - Update playlist (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params
    const body = await request.json()
    const { name, description, cover_image_url, is_public } = body

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Build update object
    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description?.trim() || null
    if (cover_image_url !== undefined) updateData.cover_image_url = cover_image_url?.trim() || null
    if (is_public !== undefined) updateData.is_public = is_public

    const { data: updatedPlaylist, error } = await supabase
      .from('playlists')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating playlist:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update playlist' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      playlist: updatedPlaylist,
    })
  } catch (error: any) {
    console.error('Error in PUT /api/admin/playlists/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete playlist (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Delete playlist (cascade will delete playlist_songs)
    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting playlist:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to delete playlist' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Playlist deleted successfully',
    })
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/playlists/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

