import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const adminClient = createAdminClient()

    const { data: campaigns, error } = await adminClient
      .from('newsletter_campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching campaigns:', error)
      return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
    }

    return NextResponse.json({ campaigns: campaigns || [] })
  } catch (error) {
    console.error('Error in GET campaigns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminClient = createAdminClient()
    const { data: userRole } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!userRole || userRole.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      subject,
      content_html,
      content_text,
      preview_text,
      featured_image_url,
      images,
      content_type,
      content_id,
      status = 'draft',
    } = body

    if (!title || !subject || !content_html) {
      return NextResponse.json(
        { error: 'Title, subject, and content are required' },
        { status: 400 }
      )
    }

    const { data: campaign, error } = await adminClient
      .from('newsletter_campaigns')
      .insert({
        title,
        subject,
        content_html,
        content_text: content_text || null,
        preview_text: preview_text || null,
        featured_image_url: featured_image_url || null,
        images: images || [],
        content_type: content_type || 'custom',
        content_id: content_id || null,
        status,
        created_by: session.user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating campaign:', error)
      return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
    }

    return NextResponse.json({ campaign })
  } catch (error) {
    console.error('Error in POST campaigns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

