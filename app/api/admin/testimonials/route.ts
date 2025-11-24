import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET - Fetch testimonials
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching testimonials:', error)
      return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in GET /api/admin/testimonials:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create testimonial
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      client_name,
      client_title,
      client_company,
      client_avatar_url,
      client_email,
      rating,
      testimonial_text,
      project_id,
      project_name,
      testimonial_type,
      status,
      is_featured,
      display_order,
      video_url,
      linkedin_url,
      twitter_url,
      website_url,
      tags,
    } = body

    if (!client_name || !rating || !testimonial_text) {
      return NextResponse.json(
        { error: 'Missing required fields: client_name, rating, testimonial_text' },
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

    // Insert testimonial
    const { data: testimonial, error: testimonialError } = await supabase
      .from('testimonials')
      .insert({
        client_name,
        client_title,
        client_company,
        client_avatar_url,
        client_email,
        rating,
        testimonial_text,
        project_id,
        project_name,
        testimonial_type: testimonial_type || 'client',
        status: status || 'pending',
        is_featured: is_featured || false,
        display_order: display_order || 0,
        video_url,
        linkedin_url,
        twitter_url,
        website_url,
        created_by: user.id,
      })
      .select()
      .single()

    if (testimonialError) {
      console.error('Error creating testimonial:', testimonialError)
      return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
    }

    // Insert tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagInserts = tags.map((tag: string) => ({
        testimonial_id: testimonial.id,
        tag: tag.trim(),
      }))

      await supabase.from('testimonial_tags').insert(tagInserts)
    }

    return NextResponse.json({ data: testimonial })
  } catch (error: any) {
    console.error('Error in POST /api/admin/testimonials:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}

