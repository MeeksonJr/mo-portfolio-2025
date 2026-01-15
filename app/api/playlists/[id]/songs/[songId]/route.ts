import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const revalidate = 0
export const dynamic = 'force-dynamic'

// DELETE - Remove song from playlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; songId: string } }
) {
  try {
    const { id, songId } = params

    if (!id || !songId) {
      return NextResponse.json(
        { error: 'Missing playlist ID or song ID' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if playlist-song relationship exists
    const { data: existing } = await supabase
      .from('playlist_songs')
      .select('id')
      .eq('playlist_id', id)
      .eq('song_id', songId)
      .single()

    if (!existing) {
      return NextResponse.json(
        { error: 'Song not found in playlist' },
        { status: 404 }
      )
    }

    // Delete the relationship
    const { error } = await supabase
      .from('playlist_songs')
      .delete()
      .eq('playlist_id', id)
      .eq('song_id', songId)

    if (error) {
      console.error('Error removing song from playlist:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to remove song from playlist' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Song removed from playlist successfully',
    })
  } catch (error: any) {
    console.error('Error in DELETE /api/playlists/[id]/songs/[songId]:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update song position in playlist (reorder)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; songId: string } }
) {
  try {
    const { id, songId } = params
    const body = await request.json()
    const { position } = body

    if (position === undefined || position === null) {
      return NextResponse.json(
        { error: 'Missing required field: position' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Update position
    const { data: updated, error } = await supabase
      .from('playlist_songs')
      .update({ position })
      .eq('playlist_id', id)
      .eq('song_id', songId)
      .select()
      .single()

    if (error) {
      console.error('Error updating song position:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update song position' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      playlist_song: updated,
    })
  } catch (error: any) {
    console.error('Error in PUT /api/playlists/[id]/songs/[songId]:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

