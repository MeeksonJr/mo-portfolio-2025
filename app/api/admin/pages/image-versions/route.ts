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
    const pageImageId = searchParams.get('page_image_id')

    if (!pageImageId) {
      return NextResponse.json({ error: 'page_image_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('image_versions')
      .select('*')
      .eq('page_image_id', pageImageId)
      .order('version', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ versions: data || [] })
  } catch (error: any) {
    console.error('Error fetching image versions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch image versions' },
      { status: 500 }
    )
  }
}

