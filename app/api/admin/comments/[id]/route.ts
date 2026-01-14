import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const revalidate = 0
export const dynamic = 'force-dynamic'

// PUT - Update comment (approve/reject/edit)
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
    const { status, author_name, author_email, author_website, content } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing comment ID' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Build update object
    const updateData: any = {}
    if (status) {
      updateData.status = status
      if (status === 'approved') {
        updateData.approved_by = user.id
        updateData.approved_at = new Date().toISOString()
      } else if (status === 'rejected' || status === 'spam') {
        updateData.approved_by = null
        updateData.approved_at = null
      }
    }
    if (author_name !== undefined) updateData.author_name = author_name
    if (author_email !== undefined) updateData.author_email = author_email || null
    if (author_website !== undefined) updateData.author_website = author_website || null
    if (content !== undefined) updateData.content = content

    const { data: updatedComment, error } = await supabase
      .from('comments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating comment:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update comment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: updatedComment,
    })
  } catch (error: any) {
    console.error('Error in PUT /api/admin/comments/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete comment
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
      return NextResponse.json({ error: 'Missing comment ID' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase.from('comments').delete().eq('id', id)

    if (error) {
      console.error('Error deleting comment:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to delete comment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    })
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/comments/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

