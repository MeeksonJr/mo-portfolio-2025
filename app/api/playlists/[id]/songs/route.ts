import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const revalidate = 0
export const dynamic = 'force-dynamic'

// GET - Get all songs in a playlist
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch songs in playlist
    const { data: playlistSongs, error } = await supabase
      .from('playlist_songs')
      .select(`
        id,
        position,
        song:songs(*)
      `)
      .eq('playlist_id', id)
      .order('position', { ascending: true })

    if (error) {
      console.error('Error fetching playlist songs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch playlist songs' },
        { status: 500 }
      )
    }

    const songs = playlistSongs?.map((ps: any) => ({
      ...ps.song,
      position: ps.position,
    })) || []

    return NextResponse.json({ songs })
  } catch (error: any) {
    console.error('Error in GET /api/playlists/[id]/songs:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// POST - Add song to playlist
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { song_id, position } = body

    if (!song_id) {
      return NextResponse.json(
        { error: 'Missing required field: song_id' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if playlist exists
    const { data: playlist } = await supabase
      .from('playlists')
      .select('id')
      .eq('id', id)
      .single()

    if (!playlist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      )
    }

    // Check if song exists
    const { data: song } = await supabase
      .from('songs')
      .select('id')
      .eq('id', song_id)
      .single()

    if (!song) {
      return NextResponse.json(
        { error: 'Song not found' },
        { status: 404 }
      )
    }

    // Check if song is already in playlist
    const { data: existing } = await supabase
      .from('playlist_songs')
      .select('id')
      .eq('playlist_id', id)
      .eq('song_id', song_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Song is already in playlist' },
        { status: 409 }
      )
    }

    // Get current max position if position not provided
    let finalPosition = position
    if (finalPosition === undefined || finalPosition === null) {
      const { count } = await supabase
        .from('playlist_songs')
        .select('*', { count: 'exact', head: true })
        .eq('playlist_id', id)

      finalPosition = (count || 0)
    }

    // Insert song into playlist
    const { data: playlistSong, error: insertError } = await supabase
      .from('playlist_songs')
      .insert({
        playlist_id: id,
        song_id,
        position: finalPosition,
      })
      .select(`
        id,
        position,
        song:songs(*)
      `)
      .single()

    if (insertError) {
      console.error('Error adding song to playlist:', insertError)
      return NextResponse.json(
        { error: insertError.message || 'Failed to add song to playlist' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      playlist_song: playlistSong,
    })
  } catch (error: any) {
    console.error('Error in POST /api/playlists/[id]/songs:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

