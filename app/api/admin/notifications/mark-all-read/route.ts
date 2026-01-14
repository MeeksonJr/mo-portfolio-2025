import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * POST /api/admin/notifications/mark-all-read
 * Mark all notifications as read for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('admin_notifications')
      .update({ read: true })
      .or(`user_id.eq.${user.id},created_by.eq.${user.id}`)
      .eq('read', false)
      .select()

    if (error) {
      console.error('Error marking all notifications as read:', error)
      return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      updated: data?.length || 0 
    })
  } catch (error: any) {
    console.error('Error in POST /api/admin/notifications/mark-all-read:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

