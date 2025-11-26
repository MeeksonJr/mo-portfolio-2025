import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Proxy route to stream audio files from Supabase storage
 * This avoids CORS/COEP issues by serving files through Next.js
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get('url')
    const filePath = searchParams.get('path')

    if (!fileUrl && !filePath) {
      return NextResponse.json({ error: 'url or path parameter is required' }, { status: 400 })
    }

    // Extract file path from Supabase URL if URL is provided
    let path = filePath
    if (fileUrl && !path) {
      // Extract path from Supabase storage URL
      // Format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
      try {
        const url = new URL(fileUrl)
        const urlMatch = url.pathname.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/)
        if (urlMatch) {
          const bucket = urlMatch[1]
          const filePathInBucket = urlMatch[2]
          path = `${bucket}/${filePathInBucket}`
        } else {
          // If it's already a direct path, use it
          path = url.pathname.replace('/storage/v1/object/public/', '')
        }
      } catch {
        // If URL parsing fails, try regex match
        const urlMatch = fileUrl.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/)
        if (urlMatch) {
          const bucket = urlMatch[1]
          const filePathInBucket = urlMatch[2]
          path = `${bucket}/${filePathInBucket}`
        } else {
          return NextResponse.json({ error: 'Invalid file URL format' }, { status: 400 })
        }
      }
    }

    if (!path) {
      return NextResponse.json({ error: 'Could not extract file path' }, { status: 400 })
    }

    // Parse bucket and file path
    const [bucket, ...fileParts] = path.split('/')
    const filePathInBucket = fileParts.join('/')

    if (!bucket || !filePathInBucket) {
      return NextResponse.json({ error: 'Invalid file path format' }, { status: 400 })
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get range header for partial content support (audio streaming)
    const range = request.headers.get('range')
    
    // Download file from Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(filePathInBucket, {
        transform: {
          width: undefined,
          height: undefined,
        },
      })

    if (error) {
      console.error('Error downloading file from Supabase:', error)
      return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Convert blob to array buffer
    const arrayBuffer = await data.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Determine content type
    const contentType = getContentType(filePathInBucket)

    // Handle range requests for audio streaming
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : buffer.length - 1
      const chunkSize = end - start + 1
      const chunk = buffer.slice(start, end + 1)

      return new NextResponse(chunk, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${buffer.length}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Range',
        },
      })
    }

    // Return full file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range',
      },
    })
  } catch (error: any) {
    console.error('Error in music stream API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Determine content type based on file extension
 */
function getContentType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase()
  const contentTypes: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
    flac: 'audio/flac',
    aac: 'audio/aac',
    webm: 'audio/webm',
  }
  return contentTypes[ext || ''] || 'audio/mpeg'
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
    },
  })
}

