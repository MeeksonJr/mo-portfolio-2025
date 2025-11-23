import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Try to get auth token from Authorization header first (most reliable for FormData)
    const authHeader = request.headers.get('authorization')
    let userId: string | null = null
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      
      console.log('Upload API - Authorization header found, validating token...')
      
      const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      const { data: userData, error: userError } = await tempClient.auth.getUser()
      
      if (userData?.user) {
        userId = userData.user.id
        console.log('Upload API - User ID from Authorization header:', userId)
      } else {
        console.log('Upload API - getUser() from header failed:', userError?.message)
      }
    }
    
    // Fallback: Try cookies using Next.js cookies()
    if (!userId) {
      try {
        const cookieStore = await cookies()
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
        const authCookieName = `sb-${projectRef}-auth-token`
        
        // Get all cookies
        const allCookies = cookieStore.getAll()
        console.log('Upload API - Total cookies:', allCookies.length)
        
        // Try to find auth token cookie
        let authCookieValue: string | null = null
        for (const cookie of allCookies) {
          if (cookie.name === authCookieName || 
              cookie.name.startsWith(`${authCookieName}.`)) {
            authCookieValue = cookie.value
            console.log('Upload API - Found auth cookie:', cookie.name)
            break
          }
        }
        
        if (authCookieValue) {
          try {
            const parsed = JSON.parse(authCookieValue)
            
            if (parsed?.access_token) {
              const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
                global: {
                  headers: {
                    Authorization: `Bearer ${parsed.access_token}`,
                  },
                },
              })
              const { data: userData } = await tempClient.auth.getUser()
              if (userData?.user) {
                userId = userData.user.id
                console.log('Upload API - User ID from cookie access_token:', userId)
              }
            } else if (parsed?.user?.id) {
              userId = parsed.user.id
              console.log('Upload API - User ID from cookie user object:', userId)
            }
          } catch (e) {
            console.log('Upload API - Error parsing cookie:', e)
          }
        } else {
          console.log('Upload API - No auth cookie found in cookieStore')
        }
      } catch (error) {
        console.log('Upload API - Cookie reading failed:', error)
      }
    }
    
    // Last resort: Try createServerClient
    if (!userId) {
      try {
        const supabase = await createServerClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          userId = session.user.id
          console.log('Upload API - User ID from createServerClient:', userId)
        } else {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user) {
            userId = user.id
            console.log('Upload API - User ID from createServerClient.getUser():', userId)
          }
        }
      } catch (error) {
        console.log('Upload API - createServerClient failed:', error)
      }
    }

    if (!userId) {
      console.log('Upload API - No user ID found after all attempts, returning 401')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminClient = createAdminClient()
    const { data: userRole } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()

    console.log('Upload API - User role:', userRole?.role)

    if (!userRole || userRole.role !== 'admin') {
      console.log('Upload API - User is not admin, returning 403')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const artist = formData.get('artist') as string | null
    const album = formData.get('album') as string | null
    const genre = formData.get('genre') as string | null
    const description = formData.get('description') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!title) {
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

    return NextResponse.json({
      success: true,
      song: songData,
      message: 'Song uploaded successfully',
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

