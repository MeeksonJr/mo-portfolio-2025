import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET - Fetch page content
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
      .from('page_content')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (pageKey) {
      query = query.eq('page_key', pageKey)
    }
    if (sectionKey) {
      query = query.eq('section_key', sectionKey)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching page content:', error)
      return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in GET /api/admin/pages/content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create or update page content
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { page_key, section_key, content_type, content, metadata, version } = body

    if (!page_key || !section_key || !content_type || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: page_key, section_key, content_type, content' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if content exists
    const { data: existing } = await supabase
      .from('page_content')
      .select('id, version')
      .eq('page_key', page_key)
      .eq('section_key', section_key)
      .eq('is_active', true)
      .single()

    let result

    if (existing) {
      // Get full existing content to save to history
      const { data: fullExisting } = await supabase
        .from('page_content')
        .select('content, metadata')
        .eq('id', existing.id)
        .single()

      if (fullExisting) {
        // Save current version to history
        await supabase.from('content_versions').insert({
          page_content_id: existing.id,
          content: fullExisting.content,
          metadata: fullExisting.metadata,
          version: existing.version,
          created_by: user.id,
        })
      }

      // Update existing content
      const newVersion = (existing.version || 1) + 1
      const { data, error } = await supabase
        .from('page_content')
        .update({
          content,
          content_type,
          metadata: metadata || {},
          version: newVersion,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Create new content
      const { data, error } = await supabase
        .from('page_content')
        .insert({
          page_key,
          section_key,
          content_type,
          content,
          metadata: metadata || {},
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return NextResponse.json({ data: result })
  } catch (error: any) {
    console.error('Error in POST /api/admin/pages/content:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save content' },
      { status: 500 }
    )
  }
}

// DELETE - Soft delete page content
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

    const { error } = await supabase
      .from('page_content')
      .update({ is_active: false })
      .eq('id', id)

    if (error) {
      console.error('Error deleting page content:', error)
      return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/pages/content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

