import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const revalidate = 0
export const dynamic = 'force-dynamic'

// GET - Fetch playlists (public playlists or user's own playlists)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') // Optional: filter by user
    const includeSongs = searchParams.get('includeSongs') === 'true'

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase
      .from('playlists')
      .select('*')
      .order('created_at', { ascending: false })

    // If userId is provided, show user's playlists (including private)
    // Otherwise, show only public playlists
    if (!userId) {
      query = query.eq('is_public', true)
    } else {
      query = query.or(`is_public.eq.true,created_by.eq.${userId}`)
    }

    const { data: playlists, error } = await query

    if (error) {
      console.error('Error fetching playlists:', error)
      return NextResponse.json(
        { error: 'Failed to fetch playlists' },
        { status: 500 }
      )
    }

    // If includeSongs is true, fetch songs for each playlist
    if (includeSongs && playlists) {
      const playlistsWithSongs = await Promise.all(
        playlists.map(async (playlist) => {
          const { data: playlistSongs } = await supabase
            .from('playlist_songs')
            .select(`
              id,
              position,
              song:songs(*)
            `)
            .eq('playlist_id', playlist.id)
            .order('position', { ascending: true })

          return {
            ...playlist,
            songs: playlistSongs?.map((ps: any) => ({
              ...ps.song,
              position: ps.position,
            })) || [],
            song_count: playlistSongs?.length || 0,
          }
        })
      )

      return NextResponse.json(
        { playlists: playlistsWithSongs },
        {
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      )
    }

    // Get song counts for each playlist
    const playlistsWithCounts = await Promise.all(
      (playlists || []).map(async (playlist) => {
        const { count } = await supabase
          .from('playlist_songs')
          .select('*', { count: 'exact', head: true })
          .eq('playlist_id', playlist.id)

        return {
          ...playlist,
          song_count: count || 0,
        }
      })
    )

    return NextResponse.json(
      { playlists: playlistsWithCounts },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error: any) {
    console.error('Error in GET /api/playlists:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new playlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, cover_image_url, is_public } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    // Get user ID from session (optional - for logged-in users)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Try to get user from cookies/headers
    const authHeader = request.headers.get('authorization')
    let userId: string | null = null

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      userId = user?.id || null
    }

    // Insert playlist
    const { data: playlist, error: insertError } = await supabase
      .from('playlists')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        cover_image_url: cover_image_url?.trim() || null,
        is_public: is_public !== undefined ? is_public : true,
        created_by: userId,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting playlist:', insertError)
      return NextResponse.json(
        { error: insertError.message || 'Failed to create playlist' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        playlist,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error in POST /api/playlists:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

