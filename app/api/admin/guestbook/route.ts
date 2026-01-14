import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const revalidate = 0
export const dynamic = 'force-dynamic'

// GET - Fetch all guestbook messages (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await isAdminUser(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'pending', 'approved', 'rejected', or null for all
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: messages, error } = await query

    if (error) {
      console.error('Error fetching guestbook messages:', error)
      return NextResponse.json(
        { error: 'Failed to fetch guestbook messages' },
        { status: 500 }
      )
    }

    // Get total counts for each status
    const { count: totalCount } = await supabase
      .from('guestbook')
      .select('*', { count: 'exact', head: true })

    const { count: pendingCount } = await supabase
      .from('guestbook')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    const { count: approvedCount } = await supabase
      .from('guestbook')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    const { count: rejectedCount } = await supabase
      .from('guestbook')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected')

    return NextResponse.json(
      {
        messages: messages || [],
        counts: {
          total: totalCount || 0,
          pending: pendingCount || 0,
          approved: approvedCount || 0,
          rejected: rejectedCount || 0,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error: any) {
    console.error('Error in GET /api/admin/guestbook:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

