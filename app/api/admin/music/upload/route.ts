import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Configure route for large file uploads
export const runtime = 'nodejs'
export const maxDuration = 60
export const maxBodySize = '50mb'

// Handle GET requests (for debugging/preflight)
export async function GET() {
  return NextResponse.json({ 
    error: 'Method not allowed. Use POST to upload files.',
    maxFileSize: '50MB'
  }, { status: 405 })
}

export async function POST(request: NextRequest) {
  try {
    const { getAuthenticatedUser, isAdminUser } = await import('@/lib/supabase/api-helpers')
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = await isAdminUser(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = user.id
    const adminClient = createAdminClient()

    // Get form data with better error handling
    let formData: FormData
    try {
      formData = await request.formData()
    } catch (error: any) {
      console.error('Error parsing form data:', error)
      if (error.message?.includes('413') || error.message?.includes('too large')) {
        return NextResponse.json({ 
          error: 'File too large. Maximum file size is 50MB. Please compress your audio file or use a smaller file.',
          maxSize: '50MB'
        }, { status: 413 })
      }
      return NextResponse.json({ error: 'Failed to parse form data' }, { status: 400 })
    }

    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const artist = formData.get('artist') as string | null
    const album = formData.get('album') as string | null
    const genre = formData.get('genre') as string | null
    const description = formData.get('description') as string | null

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided or file is empty' }, { status: 400 })
    }

    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'File must be an audio file' }, { status: 400 })
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 50MB' }, { status: 400 })
    }

    // Create Supabase Storage client
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const storageSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const storageClient = createClient(storageSupabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Check if bucket exists, create if it doesn't
    const bucketName = 'music'
    const { data: buckets, error: listError } = await storageClient.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return NextResponse.json({ error: 'Failed to access storage' }, { status: 500 })
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    if (!bucketExists) {
      console.log('Creating music bucket...')
      const { data: newBucket, error: createError } = await storageClient.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg', 'audio/flac', 'audio/x-m4a'],
        fileSizeLimit: 52428800, // 50MB
      })

      if (createError) {
        console.error('Error creating bucket:', createError)
        // If bucket creation fails, try to continue anyway (might already exist)
        // But log the error for debugging
      } else {
        console.log('Music bucket created successfully')
      }
    }

    // Generate unique file path
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = fileName // Store in bucket root

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await storageClient.storage
      .from(bucketName)
      .upload(filePath, uint8Array, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: `Failed to upload file: ${uploadError.message}` }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = storageClient.storage.from(bucketName).getPublicUrl(filePath)
    const publicUrl = urlData.publicUrl

    // Get audio duration (optional - can be done client-side or with a library)
    // For now, we'll set it to null and update later if needed
    let duration: number | null = null

    // Save song metadata to database
    const { data: songData, error: dbError } = await adminClient
      .from('songs')
      .insert({
        title,
        artist: artist || null,
        album: album || null,
        genre: genre || null,
        description: description || null,
        file_url: publicUrl,
        file_path: filePath,
        file_size: file.size,
        duration,
        created_by: userId,
      })
      .select()
      .single()

        if (dbError) {
          console.error('Database error:', dbError)
          // Try to delete uploaded file if database insert fails
          await storageClient.storage.from(bucketName).remove([filePath])
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

    console.log('Song uploaded successfully:', songData.id)

    return NextResponse.json({
      success: true,
      song: songData,
      data: songData, // Also include as 'data' for consistency
      message: 'Song uploaded successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

