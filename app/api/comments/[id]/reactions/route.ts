import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// POST - Add reaction to comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { reaction_type } = body

    if (!id || !reaction_type) {
      return NextResponse.json(
        { error: 'Missing required fields: id, reaction_type' },
        { status: 400 }
      )
    }

    if (!['like', 'helpful', 'love', 'insightful'].includes(reaction_type)) {
      return NextResponse.json(
        { error: 'Invalid reaction type. Must be: like, helpful, love, or insightful' },
        { status: 400 }
      )
    }

    // Get IP address for duplicate prevention
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if comment exists and is approved
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .select('id, status')
      .eq('id', id)
      .single()

    if (commentError || !comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    if (comment.status !== 'approved') {
      return NextResponse.json(
        { error: 'Comment is not approved' },
        { status: 403 }
      )
    }

    // Check if reaction already exists from this IP
    const { data: existingReaction } = await supabase
      .from('comment_reactions')
      .select('id')
      .eq('comment_id', id)
      .eq('ip_address', ipAddress)
      .eq('reaction_type', reaction_type)
      .single()

    if (existingReaction) {
      return NextResponse.json(
        { error: 'You have already reacted to this comment' },
        { status: 409 }
      )
    }

    // Insert reaction
    const { data: reaction, error: insertError } = await supabase
      .from('comment_reactions')
      .insert({
        comment_id: id,
        reaction_type,
        ip_address: ipAddress,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting reaction:', insertError)
      return NextResponse.json(
        { error: insertError.message || 'Failed to add reaction' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      reaction,
    })
  } catch (error: any) {
    console.error('Error in POST /api/comments/[id]/reactions:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

