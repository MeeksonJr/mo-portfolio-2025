import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Helper function to get or create visitor ID
function getOrCreateVisitorId(request: NextRequest): string {
  // Check for existing visitor_id cookie
  const existingVisitorId = request.cookies.get('visitor_id')?.value
  
  if (existingVisitorId) {
    return existingVisitorId
  }
  
  // Generate new visitor ID
  return randomUUID()
}

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

    // Get or create visitor ID
    const visitorId = getOrCreateVisitorId(request)

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

    // Check if reaction already exists from this visitor
    const { data: existingReaction } = await supabase
      .from('comment_reactions')
      .select('id')
      .eq('comment_id', id)
      .eq('visitor_id', visitorId)
      .eq('reaction_type', reaction_type)
      .single()

    if (existingReaction) {
      return NextResponse.json(
        { error: 'You have already reacted to this comment' },
        { status: 409 }
      )
    }

    // Insert reaction with visitor_id
    const { data: reaction, error: insertError } = await supabase
      .from('comment_reactions')
      .insert({
        comment_id: id,
        reaction_type,
        visitor_id: visitorId,
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

    // Create response with visitor_id cookie
    const response = NextResponse.json({
      success: true,
      reaction,
    })

    // Set visitor_id cookie if it doesn't exist (1 year expiration)
    if (!request.cookies.get('visitor_id')) {
      response.cookies.set('visitor_id', visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      })
    }

    return response
  } catch (error: any) {
    console.error('Error in POST /api/comments/[id]/reactions:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

