import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, email } = body

    if (!token && !email) {
      return NextResponse.json(
        { error: 'Unsubscribe token or email is required' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Find subscriber
    let query = supabase.from('newsletter_subscribers').select('id, email, status')

    if (token) {
      query = query.eq('unsubscribe_token', token)
    } else if (email) {
      query = query.eq('email', email.toLowerCase().trim())
    }

    const { data: subscriber, error: findError } = await query.single()

    if (findError || !subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      )
    }

    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json({
        success: true,
        message: 'Already unsubscribed',
        alreadyUnsubscribed: true,
      })
    }

    // Unsubscribe
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('id', subscriber.id)

    if (updateError) {
      console.error('Newsletter unsubscribe error:', updateError)
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      )
    }

    // Track analytics
    await supabase.from('newsletter_analytics').insert({
      subscriber_id: subscriber.id,
      event_type: 'unsubscribed',
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    })
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    )
  }
}

