import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
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

    const { count, error } = await adminClient
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed')

    if (error) {
      console.error('Error counting subscribers:', error)
      return NextResponse.json({ error: 'Failed to count subscribers' }, { status: 500 })
    }

    return NextResponse.json({ count: count || 0 })
  } catch (error) {
    console.error('Error in GET subscribers/count:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

