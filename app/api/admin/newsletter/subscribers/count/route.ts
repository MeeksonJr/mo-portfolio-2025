import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = await isAdminUser(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const adminClient = createAdminClient()

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

