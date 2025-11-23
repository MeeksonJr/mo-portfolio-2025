import { NextResponse } from 'next/server'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'

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

    // Calculate reading time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length
    const reading_time = Math.ceil(wordCount / 200)

    // If status is published and published_at is not set, set it to now
    const finalStatus = status || 'draft'
    let finalPublishedAt = published_at ? new Date(published_at).toISOString() : null
    if (finalStatus === 'published' && !finalPublishedAt) {
      finalPublishedAt = new Date().toISOString()
    }

    const { data, error } = await adminClient.from('blog_posts').insert({
      title,
      slug,
      excerpt,
      content,
      category,
      tags: tags || [],
      status: finalStatus,
      featured_image,
      seo_title,
      seo_description,
      published_at: finalPublishedAt,
      github_repo_id,
      author_id: user.id,
      reading_time,
    }).select().single()

    if (error) {
      console.error('Error creating blog post:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
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

