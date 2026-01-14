import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      client_name,
      client_email,
      client_title,
      client_company,
      rating,
      testimonial_text,
      project_name,
      testimonial_type,
      linkedin_url,
      twitter_url,
      website_url,
    } = body

    if (!client_name || !client_email || !rating || !testimonial_text) {
      return NextResponse.json(
        { error: 'Missing required fields: client_name, client_email, rating, testimonial_text' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert testimonial with status 'pending' for review
    const { data: testimonial, error: testimonialError } = await supabase
      .from('testimonials')
      .insert({
        client_name,
        client_email,
        client_title: client_title || null,
        client_company: client_company || null,
        rating,
        testimonial_text,
        project_name: project_name || null,
        testimonial_type: testimonial_type || 'client',
        status: 'pending', // Requires admin approval
        is_featured: false,
        display_order: 0,
        linkedin_url: linkedin_url || null,
        twitter_url: twitter_url || null,
        website_url: website_url || null,
      })
      .select()
      .single()

    if (testimonialError) {
      console.error('Error creating testimonial:', testimonialError)
      return NextResponse.json(
        { error: testimonialError.message || 'Failed to submit testimonial' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial submitted successfully. It will be reviewed before being published.',
      testimonial,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error in POST /api/testimonials/submit:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

