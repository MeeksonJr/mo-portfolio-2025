import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const adminClient = createAdminClient()

    // Get song
    const { data: song, error } = await adminClient
      .from('songs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 })
    }

    // Increment play count
    await adminClient
      .from('songs')
      .update({ play_count: (song.play_count || 0) + 1 })
      .eq('id', id)

    return NextResponse.json({ song })
  } catch (error: any) {
    console.error('Error fetching song:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

