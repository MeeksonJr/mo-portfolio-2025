import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const pageContentId = searchParams.get('page_content_id')

    if (!pageContentId) {
      return NextResponse.json({ error: 'page_content_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('content_versions')
      .select('*')
      .eq('page_content_id', pageContentId)
      .order('version', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ versions: data || [] })
  } catch (error: any) {
    console.error('Error fetching versions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch versions' },
      { status: 500 }
    )
  }
}

