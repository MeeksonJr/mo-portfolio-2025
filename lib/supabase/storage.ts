import { createClient } from '@supabase/supabase-js'

/**
 * Upload image to Supabase Storage
 * @param imageBuffer - Image as ArrayBuffer or Buffer
 * @param fileName - Name for the file
 * @param mimeType - MIME type (e.g., 'image/png', 'image/jpeg')
 * @param bucketName - Storage bucket name (default: 'generated-images')
 * @returns Public URL of uploaded image
 */
export async function uploadImageToStorage(
  imageBuffer: ArrayBuffer | Buffer,
  fileName: string,
  mimeType: string = 'image/png',
  bucketName: string = 'generated-images'
): Promise<{ url: string; path: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration missing')
  }

  const storageClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // Check if bucket exists, create if it doesn't
  const { data: buckets, error: listError } = await storageClient.storage.listBuckets()

  if (listError) {
    console.error('Error listing buckets:', listError)
    throw new Error('Failed to access storage')
  }

  const bucketExists = buckets?.some((bucket) => bucket.name === bucketName)

  if (!bucketExists) {
    console.log(`Creating ${bucketName} bucket...`)
    const { error: createError } = await storageClient.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
      fileSizeLimit: 10485760, // 10MB
    })

    if (createError) {
      console.error('Error creating bucket:', createError)
      // Continue anyway - bucket might already exist
    } else {
      console.log(`${bucketName} bucket created successfully`)
    }
  }

  // Generate unique file path with timestamp
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(7)
  const fileExt = mimeType.split('/')[1] || 'png'
  const uniqueFileName = `${timestamp}-${randomStr}.${fileExt}`
  // Use different paths based on bucket
  const basePath = bucketName === 'page-images' ? 'pages' : 'ai-generated'
  const filePath = `${basePath}/${uniqueFileName}`

  // Convert to Uint8Array if needed
  let uint8Array: Uint8Array
  if (imageBuffer instanceof Buffer) {
    uint8Array = new Uint8Array(imageBuffer)
  } else {
    uint8Array = new Uint8Array(imageBuffer)
  }

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await storageClient.storage
    .from(bucketName)
    .upload(filePath, uint8Array, {
      contentType: mimeType,
      upsert: false,
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    throw new Error(`Failed to upload image: ${uploadError.message}`)
  }

  // Get public URL
  const { data: urlData } = storageClient.storage.from(bucketName).getPublicUrl(filePath)
  const publicUrl = urlData.publicUrl

  return {
    url: publicUrl,
    path: filePath,
  }
}

/**
 * Convert base64 image to ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  // Remove data URL prefix if present
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64
  const binaryString = Buffer.from(base64Data, 'base64').toString('binary')
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

