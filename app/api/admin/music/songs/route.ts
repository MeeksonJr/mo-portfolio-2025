import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'

export async function GET(request: NextRequest) {
  try {
    // Check authentication using helper
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = await isAdminUser(user.id)

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const adminClient = createAdminClient()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status') // Filter by status (pending, approved, rejected)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = adminClient.from('songs').select('*', { count: 'exact' })

    if (search) {
      query = query.or(`title.ilike.%${search}%,artist.ilike.%${search}%`)
    }

    // Filter by status if provided
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query = query.eq('status', status)
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

    const { data: songs, error, count } = await query

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 })
    }

    return NextResponse.json({
      songs: songs || [],
      total: count || 0,
    })
  } catch (error: any) {
    console.error('Error fetching songs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication using helper
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = await isAdminUser(user.id)

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const adminClient = createAdminClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Song ID is required' }, { status: 400 })
    }

    // Get song to delete file from storage
    const { data: song } = await adminClient.from('songs').select('file_path').eq('id', id).single()

    // Delete from database
    const { error: deleteError } = await adminClient.from('songs').delete().eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete song' }, { status: 500 })
    }

    // Delete file from storage if exists
    if (song?.file_path) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
      const { createClient } = await import('@supabase/supabase-js')
      const storageClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      await storageClient.storage.from('music').remove([song.file_path])
    }

    return NextResponse.json({ success: true, message: 'Song deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting song:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

