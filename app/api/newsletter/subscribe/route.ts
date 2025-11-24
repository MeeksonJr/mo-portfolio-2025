import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, source = 'website' } = body

    // Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Check if email already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existing) {
      if (existing.status === 'confirmed') {
        return NextResponse.json(
          { error: 'This email is already subscribed', alreadySubscribed: true },
          { status: 400 }
        )
      }
      if (existing.status === 'pending') {
        return NextResponse.json(
          { error: 'Please check your email to confirm your subscription', pending: true },
          { status: 400 }
        )
      }
      // If unsubscribed, allow re-subscription
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex')
    const unsubscribeToken = crypto.randomBytes(32).toString('hex')

    // Insert or update subscriber
    const { data: subscriber, error } = await supabase
      .from('newsletter_subscribers')
      .upsert({
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
        status: 'pending',
        confirmation_token: confirmationToken,
        unsubscribe_token: unsubscribeToken,
        source,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'email',
      })
      .select()
      .single()

    if (error) {
      console.error('Newsletter subscription error:', error)
      return NextResponse.json(
        { error: 'Failed to process subscription' },
        { status: 500 }
      )
    }

    // Track analytics
    await supabase.from('newsletter_analytics').insert({
      subscriber_id: subscriber.id,
      event_type: 'subscribed',
      metadata: { source },
    })

    // Send confirmation email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
    const confirmationUrl = `${siteUrl}/newsletter/confirm?token=${confirmationToken}`

    // Send confirmation email via Resend (if configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const { NewsletterConfirmationEmail } = await import('@/components/emails/newsletter-confirmation-email')
        const resend = new Resend(process.env.RESEND_API_KEY)

        await resend.emails.send({
          from: 'Mohamed Datt <newsletter@mohameddatt.com>',
          to: [email.toLowerCase().trim()],
          subject: 'Confirm your newsletter subscription',
          react: NewsletterConfirmationEmail({
            name: name?.trim() || 'there',
            confirmationUrl,
          }),
        })
      } catch (error) {
        console.error('Failed to send confirmation email:', error)
        // Don't fail the subscription if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Please check your email to confirm your subscription',
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    )
  }
}

