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
      description,
      content,
      tech_stack,
      status,
      featured_image,
      problem_statement,
      solution_overview,
      challenges,
      results,
      lessons_learned,
      published_at,
      github_repo_id,
    } = body

    // If status is published and published_at is not set, set it to now
    const finalStatus = status || 'draft'
    let finalPublishedAt = published_at ? new Date(published_at).toISOString() : null
    if (finalStatus === 'published' && !finalPublishedAt) {
      finalPublishedAt = new Date().toISOString()
    }

    const { data, error } = await adminClient.from('case_studies').insert({
      title,
      slug,
      description,
      content,
      tech_stack: tech_stack || [],
      status: finalStatus,
      featured_image,
      problem_statement,
      solution_overview,
      challenges: challenges || [],
      results,
      lessons_learned: lessons_learned || [],
      published_at: finalPublishedAt,
      github_repo_id,
    }).select().single()

    if (error) {
      console.error('Error creating case study:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Send auto-newsletter if published
    if (finalStatus === 'published' && data) {
      try {
        const { sendAutoNewsletter } = await import('@/lib/newsletter/auto-send')
        await sendAutoNewsletter('case-study', {
          id: data.id,
          title: data.title,
          slug: data.slug,
          description: data.description,
          excerpt: data.description,
          featured_image: data.featured_image,
        })
      } catch (newsletterError) {
        console.error('Error sending auto-newsletter:', newsletterError)
        // Don't fail the request if newsletter fails
      }
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    console.error('Error in case study creation:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

