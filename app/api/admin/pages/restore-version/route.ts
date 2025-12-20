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
    const { page_content_id, version_id } = body

    if (!page_content_id || !version_id) {
      return NextResponse.json(
        { error: 'page_content_id and version_id are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Get the version to restore
    const { data: version, error: versionError } = await supabase
      .from('content_versions')
      .select('*')
      .eq('id', version_id)
      .eq('page_content_id', page_content_id)
      .single()

    if (versionError || !version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    // Get current content
    const { data: currentContent, error: currentError } = await supabase
      .from('page_content')
      .select('*')
      .eq('id', page_content_id)
      .single()

    if (currentError || !currentContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Save current version to history if it's not already there
    const { data: existingVersion } = await supabase
      .from('content_versions')
      .select('id')
      .eq('page_content_id', page_content_id)
      .eq('version', currentContent.version)
      .single()

    if (!existingVersion) {
      await supabase.from('content_versions').insert({
        page_content_id: page_content_id,
        content: currentContent.content,
        metadata: currentContent.metadata || {},
        version: currentContent.version,
        change_note: 'Auto-saved before restore',
        created_by: user.id,
      })
    }

    // Restore the version
    const newVersion = (currentContent.version || 1) + 1
    const { data: restored, error: restoreError } = await supabase
      .from('page_content')
      .update({
        content: version.content,
        metadata: version.metadata || {},
        version: newVersion,
        updated_at: new Date().toISOString(),
      })
      .eq('id', page_content_id)
      .select()
      .single()

    if (restoreError) {
      return NextResponse.json({ error: restoreError.message }, { status: 500 })
    }

    return NextResponse.json({ data: restored })
  } catch (error: any) {
    console.error('Error restoring version:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to restore version' },
      { status: 500 }
    )
  }
}

