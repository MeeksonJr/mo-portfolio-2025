import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const revalidate = 0
export const dynamic = 'force-dynamic'

// PUT - Update guestbook message (approve/reject)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params
    const body = await request.json()
    const { status, name, email, message, website_url } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing message ID' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Build update object
    const updateData: any = {}
    if (status) {
      updateData.status = status
      if (status === 'approved') {
        updateData.approved_by = user.id
        updateData.approved_at = new Date().toISOString()
      } else if (status === 'rejected') {
        updateData.approved_by = null
        updateData.approved_at = null
      }
    }
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email || null
    if (message !== undefined) updateData.message = message
    if (website_url !== undefined) updateData.website_url = website_url || null

    const { data: updatedMessage, error } = await supabase
      .from('guestbook')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating guestbook message:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update message' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: updatedMessage,
    })
  } catch (error: any) {
    console.error('Error in PUT /api/admin/guestbook/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete guestbook message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Missing message ID' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase.from('guestbook').delete().eq('id', id)

    if (error) {
      console.error('Error deleting guestbook message:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to delete message' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully',
    })
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/guestbook/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

