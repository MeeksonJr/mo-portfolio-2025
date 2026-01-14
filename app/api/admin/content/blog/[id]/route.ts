import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const adminClient = createAdminClient()

    console.log('Blog post update - received fields:', {
      featured_image: body.featured_image ? 'provided' : 'missing',
      seo_title: body.seo_title ? 'provided' : 'missing',
      seo_description: body.seo_description ? 'provided' : 'missing',
      status: body.status,
    })

    // If status is being set to published and published_at is not set, set it to now
    const updateData: any = {
      ...body,
      updated_at: new Date().toISOString(),
      // Explicitly handle optional fields to ensure they're saved even if null
      featured_image: body.featured_image !== undefined ? (body.featured_image || null) : undefined,
      seo_title: body.seo_title !== undefined ? (body.seo_title || null) : undefined,
      seo_description: body.seo_description !== undefined ? (body.seo_description || null) : undefined,
    }

    // Remove undefined values to avoid overwriting existing data
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    console.log('Blog post update - updating with:', {
      ...updateData,
      content: updateData.content ? `${updateData.content.substring(0, 50)}...` : 'empty',
    })

    // Handle published_at when status is published
    if (body.status === 'published' && !body.published_at) {
      // Check if the post already has a published_at date
      const { data: existingPost } = await adminClient
        .from('blog_posts')
        .select('published_at')
        .eq('id', id)
        .single()

      // Only set published_at if it doesn't exist
      if (!existingPost?.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }

    // Handle published_at date conversion if provided
    if (body.published_at) {
      updateData.published_at = new Date(body.published_at).toISOString()
    }

    // Check if this is a new publication (status changed to published)
    let wasJustPublished = false
    if (body.status === 'published') {
      const { data: existingPost } = await adminClient
        .from('blog_posts')
        .select('status, published_at')
        .eq('id', id)
        .single()

      // Only send newsletter if it wasn't already published
      wasJustPublished = existingPost?.status !== 'published'
    }

    const { data, error } = await adminClient
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send auto-newsletter if just published
    if (wasJustPublished && data) {
      try {
        const { sendAutoNewsletter } = await import('@/lib/newsletter/auto-send')
        await sendAutoNewsletter('blog', {
          id: data.id,
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          featured_image: data.featured_image,
        })
      } catch (newsletterError) {
        console.error('Error sending auto-newsletter:', newsletterError)
        // Don't fail the request if newsletter fails
      }
    }

    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}

