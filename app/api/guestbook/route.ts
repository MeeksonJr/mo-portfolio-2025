import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const revalidate = 0
export const dynamic = 'force-dynamic'

// GET - Fetch approved guestbook messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch approved messages with reactions count
    const { data: messages, error } = await supabase
      .from('guestbook')
      .select(`
        *,
        reactions:guestbook_reactions(count)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching guestbook messages:', error)
      return NextResponse.json(
        { error: 'Failed to fetch guestbook messages' },
        { status: 500 }
      )
    }

    // Get reaction counts for each message
    const messagesWithReactions = await Promise.all(
      (messages || []).map(async (message) => {
        const { count: likeCount } = await supabase
          .from('guestbook_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('guestbook_id', message.id)
          .eq('reaction_type', 'like')

        const { count: heartCount } = await supabase
          .from('guestbook_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('guestbook_id', message.id)
          .eq('reaction_type', 'heart')

        const { count: smileCount } = await supabase
          .from('guestbook_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('guestbook_id', message.id)
          .eq('reaction_type', 'smile')

        return {
          ...message,
          reactions: {
            like: likeCount || 0,
            heart: heartCount || 0,
            smile: smileCount || 0,
          },
        }
      })
    )

    return NextResponse.json(
      { messages: messagesWithReactions },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error: any) {
    console.error('Error in GET /api/guestbook:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// POST - Submit new guestbook message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, website_url } = body

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, message' },
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

    // Insert guestbook entry with status 'pending' for review
    const { data: entry, error: insertError } = await supabase
      .from('guestbook')
      .insert({
        name: name.trim(),
        email: email?.trim() || null,
        message: message.trim(),
        website_url: website_url?.trim() || null,
        status: 'pending', // Requires admin approval
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting guestbook entry:', insertError)
      return NextResponse.json(
        { error: insertError.message || 'Failed to submit message' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message submitted successfully. It will be reviewed before being published.',
        entry,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error in POST /api/guestbook:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

