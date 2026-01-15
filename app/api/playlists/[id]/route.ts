import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const revalidate = 0
export const dynamic = 'force-dynamic'

// GET - Fetch single playlist with songs
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch playlist
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', id)
      .single()

    if (playlistError || !playlist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      )
    }

    // Check if playlist is public or user has access
    // For now, we'll allow access to public playlists
    if (!playlist.is_public) {
      // TODO: Check if user is the creator
      // For now, we'll return 403
      return NextResponse.json(
        { error: 'Playlist is private' },
        { status: 403 }
      )
    }

    // Fetch songs in playlist
    const { data: playlistSongs, error: songsError } = await supabase
      .from('playlist_songs')
      .select(`
        id,
        position,
        song:songs(*)
      `)
      .eq('playlist_id', id)
      .order('position', { ascending: true })

    if (songsError) {
      console.error('Error fetching playlist songs:', songsError)
    }

    const songs = playlistSongs?.map((ps: any) => ({
      ...ps.song,
      position: ps.position,
    })) || []

    return NextResponse.json({
      playlist: {
        ...playlist,
        songs,
        song_count: songs.length,
      },
    })
  } catch (error: any) {
    console.error('Error in GET /api/playlists/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update playlist
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, description, cover_image_url, is_public } = body

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if playlist exists
    const { data: existingPlaylist } = await supabase
      .from('playlists')
      .select('id, created_by')
      .eq('id', id)
      .single()

    if (!existingPlaylist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      )
    }

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
    console.error('Error in PUT /api/playlists/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete playlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if playlist exists
    const { data: existingPlaylist } = await supabase
      .from('playlists')
      .select('id')
      .eq('id', id)
      .single()

    if (!existingPlaylist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      )
    }

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
    console.error('Error in DELETE /api/playlists/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

