import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// PUT - Update testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const updateData: any = {}
    if (client_name !== undefined) updateData.client_name = client_name
    if (client_title !== undefined) updateData.client_title = client_title
    if (client_company !== undefined) updateData.client_company = client_company
    if (client_avatar_url !== undefined) updateData.client_avatar_url = client_avatar_url
    if (client_email !== undefined) updateData.client_email = client_email
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: 'Rating must be between 1 and 5' },
          { status: 400 }
        )
      }
      updateData.rating = rating
    }
    if (testimonial_text !== undefined) updateData.testimonial_text = testimonial_text
    if (project_id !== undefined) updateData.project_id = project_id
    if (project_name !== undefined) updateData.project_name = project_name
    if (testimonial_type !== undefined) updateData.testimonial_type = testimonial_type
    if (is_featured !== undefined) updateData.is_featured = is_featured
    if (display_order !== undefined) updateData.display_order = display_order
    if (video_url !== undefined) updateData.video_url = video_url
    if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url
    if (twitter_url !== undefined) updateData.twitter_url = twitter_url
    if (website_url !== undefined) updateData.website_url = website_url

    // Handle status change and approval
    if (status !== undefined) {
      updateData.status = status
      if (status === 'approved') {
        updateData.approved_by = user.id
        updateData.approved_at = new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('testimonials')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating testimonial:', error)
      return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
    }

    // Update tags if provided
    if (tags !== undefined && Array.isArray(tags)) {
      // Delete existing tags
      await supabase.from('testimonial_tags').delete().eq('testimonial_id', params.id)

      // Insert new tags
      if (tags.length > 0) {
        const tagInserts = tags.map((tag: string) => ({
          testimonial_id: params.id,
          tag: tag.trim(),
        }))

        await supabase.from('testimonial_tags').insert(tagInserts)
      }
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error in PUT /api/admin/testimonials/[id]:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

// DELETE - Delete testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting testimonial:', error)
      return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/testimonials/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

