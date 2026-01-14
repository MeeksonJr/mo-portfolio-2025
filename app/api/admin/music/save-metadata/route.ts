import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'

export async function POST(request: NextRequest) {
  try {
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
    const body = await request.json()
    const {
      title,
      artist,
      album,
      genre,
      description,
      file_url,
      file_path,
      file_size,
      duration,
    } = body

    if (!title || !file_url || !file_path) {
      return NextResponse.json(
        { error: 'Title, file_url, and file_path are required' },
        { status: 400 }
      )
    }

    // Save song metadata to database
    const { data: songData, error: dbError } = await adminClient
      .from('songs')
      .insert({
        title,
        artist: artist || null,
        album: album || null,
        genre: genre || null,
        description: description || null,
        file_url,
        file_path,
        file_size: file_size || null,
        duration: duration || null,
        created_by: user.id,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to save song metadata' }, { status: 500 })
    }

    // Send auto-newsletter for new music upload
    if (songData) {
      try {
        const { sendAutoNewsletter } = await import('@/lib/newsletter/auto-send')
        await sendAutoNewsletter('music', {
          id: songData.id,
          title: songData.title,
          name: songData.title,
          description: songData.description || `${songData.artist ? `${songData.artist} - ` : ''}${songData.title}`,
        })
      } catch (newsletterError) {
        console.error('Error sending auto-newsletter:', newsletterError)
        // Don't fail the request if newsletter fails
      }
    }

    if (!songData) {
      console.error('Song data is null after insert')
      return NextResponse.json({ error: 'Failed to retrieve uploaded song data' }, { status: 500 })
    }

    console.log('Song metadata saved successfully:', songData.id)

    return NextResponse.json({
      success: true,
      song: songData,
      data: songData,
      message: 'Song metadata saved successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error saving song metadata:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

