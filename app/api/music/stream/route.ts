import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

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

    // Get range header for partial content support (audio streaming)
    const range = request.headers.get('range')
    
    // Construct the public URL for the file
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePathInBucket}`
    
    // Fetch the file directly from Supabase public storage
    const fetchOptions: RequestInit = {
      headers: range ? { Range: range } : {},
    }
    
    const response = await fetch(publicUrl, fetchOptions)

    if (!response.ok) {
      console.error('Error fetching file from Supabase:', response.status, response.statusText)
      console.error('URL:', publicUrl)
      return NextResponse.json({ 
        error: 'Failed to fetch file', 
        details: `HTTP ${response.status}: ${response.statusText}`
      }, { status: response.status })
    }

    // Get the file as array buffer
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Determine content type (prefer response header, fallback to file extension)
    const contentType = response.headers.get('Content-Type') || getContentType(filePathInBucket)

    // Handle range requests for audio streaming
    if (range && response.status === 206) {
      // If Supabase already handled the range request, forward the response
      const contentRange = response.headers.get('Content-Range')
      const contentLength = response.headers.get('Content-Length')
      
      return new NextResponse(buffer, {
        status: 206,
        headers: {
          'Content-Range': contentRange || `bytes 0-${buffer.length - 1}/${buffer.length}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': contentLength || buffer.length.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Range',
        },
      })
    } else if (range) {
      // Handle range request manually if Supabase didn't
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
    console.error('Error stack:', error?.stack)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
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

