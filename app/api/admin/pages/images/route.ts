import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'
import { uploadImageToStorage, base64ToArrayBuffer } from '@/lib/supabase/storage'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET - Fetch page images
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const pageKey = searchParams.get('page_key')
    const sectionKey = searchParams.get('section_key')

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase
      .from('page_images')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (pageKey) {
      query = query.eq('page_key', pageKey)
    }
    if (sectionKey) {
      query = query.eq('section_key', sectionKey)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching page images:', error)
      return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in GET /api/admin/pages/images:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Upload new image
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const pageKey = formData.get('page_key') as string
    const sectionKey = formData.get('section_key') as string
    const altText = formData.get('alt_text') as string
    const caption = formData.get('caption') as string
    const isFeatured = formData.get('is_featured') === 'true'

    if (!file || !pageKey || !sectionKey) {
      return NextResponse.json(
        { error: 'Missing required fields: file, page_key, section_key' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { url, path } = await uploadImageToStorage(
      buffer,
      file.name,
      file.type,
      'page-images'
    )

    // Get image dimensions (optional, can be done client-side)
    const metadata = {
      file_size: file.size,
      mime_type: file.type,
      original_name: file.name,
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get current max display_order for this section
    const { data: existingImages } = await supabase
      .from('page_images')
      .select('display_order')
      .eq('page_key', pageKey)
      .eq('section_key', sectionKey)
      .order('display_order', { ascending: false })
      .limit(1)

    const displayOrder = existingImages && existingImages.length > 0
      ? (existingImages[0].display_order || 0) + 1
      : 0

    // Save image metadata to database
    const { data, error } = await supabase
      .from('page_images')
      .insert({
        page_key: pageKey,
        section_key: sectionKey,
        image_url: url,
        storage_path: path,
        alt_text: altText || '',
        caption: caption || '',
        display_order: displayOrder,
        is_featured: isFeatured,
        metadata,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving image metadata:', error)
      return NextResponse.json({ error: 'Failed to save image' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error in POST /api/admin/pages/images:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    )
  }
}

// PUT - Update image metadata
export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, alt_text, caption, display_order, is_featured, is_active, image_url, storage_path } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get current image data before updating (to save to versions if URL changes)
    const { data: currentImage } = await supabase
      .from('page_images')
      .select('*')
      .eq('id', id)
      .single()

    if (!currentImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // If image_url or storage_path is being changed, save current version to versions table
    const imageUrlChanged = image_url !== undefined && image_url !== currentImage.image_url
    const storagePathChanged = storage_path !== undefined && storage_path !== currentImage.storage_path

    if (imageUrlChanged || storagePathChanged) {
      // Get current max version for this image
      const { data: existingVersions } = await supabase
        .from('image_versions')
        .select('version')
        .eq('page_image_id', id)
        .order('version', { ascending: false })
        .limit(1)

      const nextVersion = existingVersions && existingVersions.length > 0
        ? (existingVersions[0].version || 0) + 1
        : 1

      // Save current version before updating
      await supabase.from('image_versions').insert({
        page_image_id: id,
        image_url: currentImage.image_url,
        storage_path: currentImage.storage_path,
        version: nextVersion,
        replaced_by: user.id,
      })
    }

    const updateData: any = {}
    if (alt_text !== undefined) updateData.alt_text = alt_text
    if (caption !== undefined) updateData.caption = caption
    if (display_order !== undefined) updateData.display_order = display_order
    if (is_featured !== undefined) updateData.is_featured = is_featured
    if (is_active !== undefined) updateData.is_active = is_active
    if (image_url !== undefined) updateData.image_url = image_url
    if (storage_path !== undefined) updateData.storage_path = storage_path

    const { data, error } = await supabase
      .from('page_images')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating image:', error)
      return NextResponse.json({ error: 'Failed to update image' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error in PUT /api/admin/pages/images:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update image' },
      { status: 500 }
    )
  }
}

// DELETE - Archive image (move to versions, soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get image data before deleting
    const { data: image } = await supabase
      .from('page_images')
      .select('*')
      .eq('id', id)
      .single()

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Get current max version for this image
    const { data: existingVersions } = await supabase
      .from('image_versions')
      .select('version')
      .eq('page_image_id', id)
      .order('version', { ascending: false })
      .limit(1)

    const nextVersion = existingVersions && existingVersions.length > 0
      ? (existingVersions[0].version || 0) + 1
      : 1

    // Save to versions table
    await supabase.from('image_versions').insert({
      page_image_id: id,
      image_url: image.image_url,
      storage_path: image.storage_path,
      version: nextVersion,
      replaced_by: user.id,
    })

    // Soft delete
    const { error } = await supabase
      .from('page_images')
      .update({ is_active: false })
      .eq('id', id)

    if (error) {
      console.error('Error deleting image:', error)
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/pages/images:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

