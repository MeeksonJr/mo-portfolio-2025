import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const revalidate = 0
export const dynamic = 'force-dynamic'

// GET - Fetch comments for specific content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get('contentType')
    const contentId = searchParams.get('contentId')

    if (!contentType || !contentId) {
      return NextResponse.json(
        { error: 'Missing required parameters: contentType, contentId' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch approved comments with reactions count
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .eq('status', 'approved')
      .is('parent_id', null) // Only top-level comments
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      )
    }

    // Get replies for each comment and reaction counts
    const commentsWithReplies = await Promise.all(
      (comments || []).map(async (comment) => {
        // Get replies
        const { data: replies } = await supabase
          .from('comments')
          .select('*')
          .eq('parent_id', comment.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: true })

        // Get reaction counts
        const { count: likeCount } = await supabase
          .from('comment_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('comment_id', comment.id)
          .eq('reaction_type', 'like')

        const { count: helpfulCount } = await supabase
          .from('comment_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('comment_id', comment.id)
          .eq('reaction_type', 'helpful')

        const { count: loveCount } = await supabase
          .from('comment_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('comment_id', comment.id)
          .eq('reaction_type', 'love')

        const { count: insightfulCount } = await supabase
          .from('comment_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('comment_id', comment.id)
          .eq('reaction_type', 'insightful')

        return {
          ...comment,
          replies: replies || [],
          reactions: {
            like: likeCount || 0,
            helpful: helpfulCount || 0,
            love: loveCount || 0,
            insightful: insightfulCount || 0,
          },
        }
      })
    )

    return NextResponse.json(
      { comments: commentsWithReplies },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error: any) {
    console.error('Error in GET /api/comments:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content_type, content_id, parent_id, author_name, author_email, author_website, content } = body

    if (!content_type || !content_id || !author_name || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: content_type, content_id, author_name, content' },
        { status: 400 }
      )
    }

    // Validate content_type
    if (!['blog_post', 'case_study', 'project', 'resource'].includes(content_type)) {
      return NextResponse.json(
        { error: 'Invalid content_type. Must be: blog_post, case_study, project, or resource' },
        { status: 400 }
      )
    }

    // Get IP address and user agent for spam prevention
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // If parent_id is provided, verify it exists and belongs to the same content
    if (parent_id) {
      const { data: parentComment } = await supabase
        .from('comments')
        .select('id, content_type, content_id')
        .eq('id', parent_id)
        .single()

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        )
      }

      if (parentComment.content_type !== content_type || parentComment.content_id !== content_id) {
        return NextResponse.json(
          { error: 'Parent comment does not belong to this content' },
          { status: 400 }
        )
      }
    }

    // Ensure content_type is lowercase and matches constraint
    const normalizedContentType = content_type.toLowerCase().trim()
    if (!['blog_post', 'case_study', 'project', 'resource'].includes(normalizedContentType)) {
      console.error('Invalid content_type received:', content_type, 'Normalized:', normalizedContentType)
      return NextResponse.json(
        { error: `Invalid content_type: ${content_type}. Must be one of: blog_post, case_study, project, resource` },
        { status: 400 }
      )
    }

    // Insert comment with status 'pending' for review
    const { data: comment, error: insertError } = await supabase
      .from('comments')
      .insert({
        content_type: normalizedContentType,
        content_id,
        parent_id: parent_id || null,
        author_name: author_name.trim(),
        author_email: author_email?.trim() || null,
        author_website: author_website?.trim() || null,
        content: content.trim(),
        status: 'pending', // Requires admin approval
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting comment:', insertError)
      return NextResponse.json(
        { error: insertError.message || 'Failed to submit comment' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Comment submitted successfully. It will be reviewed before being published.',
        comment,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error in POST /api/comments:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

