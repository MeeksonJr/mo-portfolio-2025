import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
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
      submitter_name,
      submitter_email,
    } = body

    if (!title || !file_url || !file_path || !submitter_name || !submitter_email) {
      return NextResponse.json(
        { error: 'Missing required fields: title, file_url, file_path, submitter_name, submitter_email' },
        { status: 400 }
      )
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(submitter_email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Insert song with status 'pending' for review
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
        status: 'pending', // Requires admin approval
        submitter_name,
        submitter_email,
        created_by: null, // Public submission, no user account
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to submit song' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      song: songData,
      message: 'Song submitted successfully. It will be reviewed before being published.',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error submitting song:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

