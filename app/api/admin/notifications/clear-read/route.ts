import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * DELETE /api/admin/notifications/clear-read
 * Delete all read notifications for the authenticated user
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('admin_notifications')
      .delete()
      .or(`user_id.eq.${user.id},created_by.eq.${user.id}`)
      .eq('read', true)
      .select()

    if (error) {
      console.error('Error clearing read notifications:', error)
      return NextResponse.json({ error: 'Failed to clear notifications' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      deleted: data?.length || 0 
    })
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/notifications/clear-read:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

