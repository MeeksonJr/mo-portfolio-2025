import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const revalidate = 0
export const dynamic = 'force-dynamic'

// GET - Fetch all playlists (admin only)
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
    const includeSongs = searchParams.get('includeSongs') === 'true'

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch all playlists
    const { data: playlists, error } = await supabase
      .from('playlists')
      .select('*')
      .order('created_at', { ascending: false })

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
    console.error('Error in GET /api/admin/playlists:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// POST - Create playlist (admin)
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
    const { name, description, cover_image_url, is_public } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert playlist
    const { data: playlist, error: insertError } = await supabase
      .from('playlists')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        cover_image_url: cover_image_url?.trim() || null,
        is_public: is_public !== undefined ? is_public : true,
        created_by: user.id,
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
    console.error('Error in POST /api/admin/playlists:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

