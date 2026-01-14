import { NextResponse } from 'next/server'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'
import { createSlug, generateUniqueSlug } from '@/lib/slug-utils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = await isAdminUser(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const adminClient = createAdminClient()

    // Fetch blog posts - no cache
    const { data, error } = await adminClient
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching blog posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data || [] }, { status: 200 })
  } catch (error: any) {
    console.error('Error in GET /api/admin/content/blog:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = await isAdminUser(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const adminClient = createAdminClient()
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      status,
      featured_image,
      seo_title,
      seo_description,
      published_at,
      github_repo_id,
    } = body

    console.log('Blog post creation - received fields:', {
      featured_image: featured_image ? 'provided' : 'missing',
      seo_title: seo_title ? 'provided' : 'missing',
      seo_description: seo_description ? 'provided' : 'missing',
      status,
    })

    // Generate unique slug if not provided or if it already exists
    let finalSlug = slug || createSlug(title)
    
    // Check if slug exists and generate unique one
    const checkSlugExists = async (slugToCheck: string) => {
      const { data } = await adminClient
        .from('blog_posts')
        .select('id')
        .eq('slug', slugToCheck)
        .single()
      return !!data
    }
    
    finalSlug = await generateUniqueSlug(finalSlug, checkSlugExists)

    // Calculate reading time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length
    const reading_time = Math.ceil(wordCount / 200)

    // If status is published and published_at is not set, set it to now
    const finalStatus = status || 'draft'
    let finalPublishedAt = published_at ? new Date(published_at).toISOString() : null
    if (finalStatus === 'published' && !finalPublishedAt) {
      finalPublishedAt = new Date().toISOString()
    }

    // Prepare insert data - explicitly handle undefined/null values
    const insertData: any = {
      title,
      slug: finalSlug,
      excerpt: excerpt || null,
      content,
      category: category || null,
      tags: tags || [],
      status: finalStatus,
      featured_image: featured_image || null,
      seo_title: seo_title || null,
      seo_description: seo_description || null,
      published_at: finalPublishedAt,
      github_repo_id: github_repo_id || null,
      author_id: user.id,
      reading_time,
    }

    console.log('Blog post creation - inserting data:', {
      ...insertData,
      content: insertData.content ? `${insertData.content.substring(0, 50)}...` : 'empty',
    })

    const { data, error } = await adminClient.from('blog_posts').insert(insertData).select().single()

    if (error) {
      console.error('Error creating blog post:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Send auto-newsletter if published
    if (finalStatus === 'published' && data) {
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

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    console.error('Error in blog post creation:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

