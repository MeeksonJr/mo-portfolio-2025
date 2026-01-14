import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const adminClient = createAdminClient()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const genre = searchParams.get('genre')
    const artist = searchParams.get('artist')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = adminClient.from('songs').select('*', { count: 'exact' })

    // Only show approved songs to public
    query = query.eq('status', 'approved')

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,artist.ilike.%${search}%,album.ilike.%${search}%`)
    }

    if (genre) {
      query = query.eq('genre', genre)
    }

    if (artist) {
      query = query.eq('artist', artist)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    // Order by created_at (newest first)
    query = query.order('created_at', { ascending: false })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: songs, error, count } = await query

    if (error) {
      console.error('Error fetching songs:', error)
      return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 })
    }

    return NextResponse.json({
      songs: songs || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('Error in songs API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

