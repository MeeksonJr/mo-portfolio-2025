import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content_type, content_id, event_type, metadata = {} } = body

    if (!event_type) {
      return NextResponse.json({ error: 'event_type is required' }, { status: 400 })
    }

    // Get client info
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || null

    const adminClient = createAdminClient()

    // Insert analytics event
    const { error } = await adminClient.from('analytics').insert({
      content_type: content_type || null,
      content_id: content_id || null,
      event_type,
      metadata,
      ip_address: ip,
      user_agent: userAgent,
      referrer,
    })

    if (error) {
      console.error('Error tracking analytics:', error)
      return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

