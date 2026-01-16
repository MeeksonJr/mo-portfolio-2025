import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { page_image_id, version_id } = body

    if (!page_image_id || !version_id) {
      return NextResponse.json(
        { error: 'page_image_id and version_id are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Get the version to restore
    const { data: version, error: versionError } = await supabase
      .from('image_versions')
      .select('*')
      .eq('id', version_id)
      .eq('page_image_id', page_image_id)
      .single()

    if (versionError || !version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    // Get current image
    const { data: currentImage, error: currentError } = await supabase
      .from('page_images')
      .select('*')
      .eq('id', page_image_id)
      .single()

    if (currentError || !currentImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Save current version to history if it's not already there
    const { data: existingVersion } = await supabase
      .from('image_versions')
      .select('id')
      .eq('page_image_id', page_image_id)
      .eq('image_url', currentImage.image_url)
      .eq('storage_path', currentImage.storage_path)
      .single()

    if (!existingVersion) {
      // Get max version number
      const { data: maxVersion } = await supabase
        .from('image_versions')
        .select('version')
        .eq('page_image_id', page_image_id)
        .order('version', { ascending: false })
        .limit(1)

      const nextVersion = maxVersion && maxVersion.length > 0
        ? (maxVersion[0].version || 0) + 1
        : 1

      await supabase.from('image_versions').insert({
        page_image_id,
        image_url: currentImage.image_url,
        storage_path: currentImage.storage_path,
        version: nextVersion,
        replaced_by: user.id,
      })
    }

    // Restore the version
    const { data: restoredImage, error: restoreError } = await supabase
      .from('page_images')
      .update({
        image_url: version.image_url,
        storage_path: version.storage_path,
        updated_at: new Date().toISOString(),
      })
      .eq('id', page_image_id)
      .select()
      .single()

    if (restoreError) {
      console.error('Error restoring image version:', restoreError)
      return NextResponse.json({ error: 'Failed to restore version' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      image: restoredImage,
      message: 'Image version restored successfully'
    })
  } catch (error: any) {
    console.error('Error in POST /api/admin/pages/restore-image-version:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to restore image version' },
      { status: 500 }
    )
  }
}

