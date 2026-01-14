import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const maxDuration = 30

/**
 * Get archived newsletters (sent campaigns)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const adminClient = createAdminClient()

    // Fetch sent newsletters
    const { data: campaigns, error } = await adminClient
      .from('newsletter_campaigns')
      .select('id, title, subject, preview_text, featured_image_url, sent_at, sent_to_count, opened_count, clicked_count')
      .eq('status', 'sent')
      .order('sent_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    // Get total count
    const { count } = await adminClient
      .from('newsletter_campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sent')

    return NextResponse.json({
      campaigns: campaigns || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching newsletter archive:', error)
    return NextResponse.json(
      { error: 'Failed to fetch newsletter archive' },
      { status: 500 }
    )
  }
}

