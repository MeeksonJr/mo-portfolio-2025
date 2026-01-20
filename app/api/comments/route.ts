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

    // Normalize contentType for database lookup (support both 'blog' and 'blog_post' for backwards compatibility)
    let dbContentType = contentType.toLowerCase().trim()
    if (dbContentType === 'blog') {
      dbContentType = 'blog_post'
    }

    // Fetch approved comments with reactions count
    // Try exact match first, then try legacy 'blog' format for backwards compatibility
    let { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('content_type', dbContentType)
      .eq('content_id', contentId)
      .eq('status', 'approved')
      .is('parent_id', null) // Only top-level comments
      .order('created_at', { ascending: false })

    // If no results and we're looking for blog_post, also check for legacy 'blog' entries
    if ((!comments || comments.length === 0) && dbContentType === 'blog_post') {
      const { data: legacyComments } = await supabase
        .from('comments')
        .select('*')
        .eq('content_type', 'blog')
        .eq('content_id', contentId)
        .eq('status', 'approved')
        .is('parent_id', null)
        .order('created_at', { ascending: false })
      if (legacyComments && legacyComments.length > 0) {
        comments = legacyComments
      }
    }

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      )
    }

    // Helper function to get reaction counts for a comment
    const getReactionCounts = async (commentId: string) => {
      const [likeCount, helpfulCount, loveCount, insightfulCount] = await Promise.all([
        supabase
          .from('comment_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('comment_id', commentId)
          .eq('reaction_type', 'like'),
        supabase
          .from('comment_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('comment_id', commentId)
          .eq('reaction_type', 'helpful'),
        supabase
          .from('comment_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('comment_id', commentId)
          .eq('reaction_type', 'love'),
        supabase
          .from('comment_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('comment_id', commentId)
          .eq('reaction_type', 'insightful'),
      ])

      return {
        like: likeCount.count || 0,
        helpful: helpfulCount.count || 0,
        love: loveCount.count || 0,
        insightful: insightfulCount.count || 0,
      }
    }

    // Get replies for each comment and reaction counts
    const commentsWithReplies = await Promise.all(
      (comments || []).map(async (comment) => {
        // Get replies with reaction counts
        const { data: replies } = await supabase
          .from('comments')
          .select('*')
          .eq('parent_id', comment.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: true })

        // Get reaction counts for replies
        const repliesWithReactions = await Promise.all(
          (replies || []).map(async (reply) => ({
            ...reply,
            reactions: await getReactionCounts(reply.id),
          }))
        )

        // Get reaction counts for main comment
        const reactions = await getReactionCounts(comment.id)

        return {
          ...comment,
          replies: repliesWithReactions,
          reactions,
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

    // Validate content_type (accept API format, will be mapped to DB format)
    const validApiTypes = ['blog', 'blog_post', 'case_study', 'case-study', 'project', 'resource']
    if (!validApiTypes.includes(content_type)) {
      return NextResponse.json(
        { error: 'Invalid content_type. Must be: blog, blog_post, case_study, case-study, project, or resource' },
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

    // Ensure content_type is lowercase, trimmed, and matches constraint
    const normalizedContentType = (content_type || '').toLowerCase().trim()
    
    // Map API types to database constraint values
    // Database constraint allows: 'blog_post', 'case_study', 'project', 'resource'
    const contentTypeMap: Record<string, string> = {
      'blog_post': 'blog_post',
      'blog': 'blog_post', // Legacy support: map 'blog' to 'blog_post'
      'blogpost': 'blog_post',
      'case_study': 'case_study',
      'case-study': 'case_study',
      'casestudy': 'case_study',
      'project': 'project',
      'resource': 'resource',
    }
    
    // Map to database constraint values
    const finalContentType = contentTypeMap[normalizedContentType]

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

      // Normalize parent content type for comparison (handle both 'blog' legacy and 'blog_post')
      const normalizedParentType = (parentComment.content_type || '').toLowerCase().trim()
      const mappedParentType = contentTypeMap[normalizedParentType] || normalizedParentType
      
      // Compare both using mapped/standardized values and content_id
      if (mappedParentType !== finalContentType || parentComment.content_id !== content_id) {
        console.error('Parent comment validation failed:', {
          parentType: parentComment.content_type,
          mappedParentType,
          childType: content_type,
          finalContentType,
          parentContentId: parentComment.content_id,
          childContentId: content_id,
        })
        return NextResponse.json(
          { error: 'Parent comment does not belong to this content' },
          { status: 400 }
        )
      }
    }
    
    // Database constraint only allows: 'blog_post', 'case_study', 'project', 'resource'
    const validTypes = ['blog_post', 'case_study', 'project', 'resource']
    if (!finalContentType || !validTypes.includes(finalContentType)) {
      console.error('Invalid content_type received:', content_type, 'Normalized:', normalizedContentType, 'Final:', finalContentType)
      return NextResponse.json(
        { error: `Invalid content_type: ${content_type}. Must be one of: blog, blog_post, case_study, case-study, project, resource` },
        { status: 400 }
      )
    }

    // Insert comment with status 'pending' for review
    const { data: comment, error: insertError } = await supabase
      .from('comments')
      .insert({
        content_type: finalContentType,
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

