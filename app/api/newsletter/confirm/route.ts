import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Confirmation token is required' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Find subscriber by confirmation token
    const { data: subscriber, error: findError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, status, confirmed_at')
      .eq('confirmation_token', token)
      .single()

    if (findError || !subscriber) {
      return NextResponse.json(
        { error: 'Invalid or expired confirmation token' },
        { status: 400 }
      )
    }

    if (subscriber.status === 'confirmed') {
      return NextResponse.json({
        success: true,
        message: 'Email already confirmed',
        alreadyConfirmed: true,
      })
    }

    // Confirm subscription
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        confirmation_token: null, // Clear token after confirmation
      })
      .eq('id', subscriber.id)

    if (updateError) {
      console.error('Newsletter confirmation error:', updateError)
      return NextResponse.json(
        { error: 'Failed to confirm subscription' },
        { status: 500 }
      )
    }

    // Track analytics
    await supabase.from('newsletter_analytics').insert({
      subscriber_id: subscriber.id,
      event_type: 'confirmed',
    })

    // Send welcome email
    const { data: subscriberData } = await supabase
      .from('newsletter_subscribers')
      .select('unsubscribe_token, name')
      .eq('id', subscriber.id)
      .single()

    if (subscriberData?.unsubscribe_token && process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const { NewsletterWelcomeEmail } = await import('@/components/emails/newsletter-welcome-email')
        const resend = new Resend(process.env.RESEND_API_KEY)

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
        const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?token=${subscriberData.unsubscribe_token}`

        await resend.emails.send({
          from: 'Mohamed Datt <newsletter@mohameddatt.com>',
          to: [subscriber.email],
          subject: 'Welcome to the Newsletter! 🎉',
          react: NewsletterWelcomeEmail({
            name: subscriberData.name || 'there',
            unsubscribeUrl,
          }),
        })
      } catch (error) {
        console.error('Failed to send welcome email:', error)
        // Don't fail the confirmation if welcome email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email confirmed successfully! Welcome to the newsletter.',
    })
  } catch (error) {
    console.error('Newsletter confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to confirm subscription' },
      { status: 500 }
    )
  }
}

