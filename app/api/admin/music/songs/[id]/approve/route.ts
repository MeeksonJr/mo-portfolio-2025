import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await isAdminUser(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be "approved" or "rejected"' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Update song status
    const { data: songData, error: dbError } = await adminClient
      .from('songs')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to update song status' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      song: songData,
      message: `Song ${status} successfully`,
    })
  } catch (error: any) {
    console.error('Error updating song status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

