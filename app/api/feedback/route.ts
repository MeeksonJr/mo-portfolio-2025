import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const maxDuration = 30

/**
 * POST /api/feedback
 * Submit feedback for content
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentId, contentType, helpful, comment, rating } = body

    if (!contentId || !contentType) {
      return NextResponse.json(
        { error: 'Content ID and type are required' },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()

    // Store feedback in database
    const { data, error } = await adminClient
      .from('content_feedback')
      .insert({
        content_id: contentId,
        content_type: contentType,
        helpful: helpful ?? null,
        comment: comment || null,
        rating: rating ?? null,
        user_agent: request.headers.get('user-agent') || null,
        ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error storing feedback:', error)
      return NextResponse.json(
        { error: 'Failed to store feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (error) {
    console.error('Error in POST feedback:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/feedback
 * Get feedback statistics for content
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')
    const contentType = searchParams.get('contentType')

    if (!contentId || !contentType) {
      return NextResponse.json(
        { error: 'Content ID and type are required' },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()

    // Get feedback statistics
    const { data: feedback, error } = await adminClient
      .from('content_feedback')
      .select('helpful, rating')
      .eq('content_id', contentId)
      .eq('content_type', contentType)

    if (error) {
      throw error
    }

    const total = feedback?.length || 0
    const helpfulCount = feedback?.filter((f) => f.helpful === true).length || 0
    const notHelpfulCount = feedback?.filter((f) => f.helpful === false).length || 0
    const ratings = feedback?.filter((f) => f.rating !== null).map((f) => f.rating) || []
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + (r || 0), 0) / ratings.length
      : null

    return NextResponse.json({
      total,
      helpful: helpfulCount,
      notHelpful: notHelpfulCount,
      helpfulPercentage: total > 0 ? Math.round((helpfulCount / total) * 100) : 0,
      averageRating: averageRating ? Math.round(averageRating * 10) / 10 : null,
      ratingCount: ratings.length,
    })
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}

