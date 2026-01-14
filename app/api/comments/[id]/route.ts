import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const revalidate = 0
export const dynamic = 'force-dynamic'

// PUT - Update comment (users can edit their own comments)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { content } = body

    if (!id || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: id, content' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if comment exists
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('id, user_id, status')
      .eq('id', id)
      .single()

    if (fetchError || !existingComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Only allow editing if comment is pending or approved (not rejected/spam)
    if (existingComment.status === 'rejected' || existingComment.status === 'spam') {
      return NextResponse.json(
        { error: 'Cannot edit rejected or spam comments' },
        { status: 403 }
      )
    }

    // Update comment
    const { data: updatedComment, error: updateError } = await supabase
      .from('comments')
      .update({
        content: content.trim(),
        status: 'pending', // Reset to pending after edit for re-moderation
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating comment:', updateError)
      return NextResponse.json(
        { error: updateError.message || 'Failed to update comment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Comment updated successfully. It will be reviewed again before being published.',
      comment: updatedComment,
    })
  } catch (error: any) {
    console.error('Error in PUT /api/comments/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete comment (users can delete their own comments)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Missing comment ID' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if comment exists
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('id, user_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Delete comment (cascade will delete replies and reactions)
    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting comment:', deleteError)
      return NextResponse.json(
        { error: deleteError.message || 'Failed to delete comment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    })
  } catch (error: any) {
    console.error('Error in DELETE /api/comments/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

