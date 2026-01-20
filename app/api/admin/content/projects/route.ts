import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'

// GET - Fetch all projects (public, no auth required for live demos)
export async function GET(request: NextRequest) {
  try {
    const adminClient = createAdminClient()

    // Fetch all published projects
    const { data, error } = await adminClient
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data || [] }, { status: 200 })
  } catch (error: any) {
    console.error('Error in GET /api/admin/content/projects:', error)
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
    let {
      name,
      description,
      tech_stack,
      homepage_url,
      github_url,
      is_featured,
      display_order,
      status,
      featured_image,
      github_repo_id,
    } = body

    if (!github_repo_id) {
      return NextResponse.json(
        { error: 'github_repo_id is required' },
        { status: 400 }
      )
    }

    // Validate github_url is provided (required field)
    if (!github_url || github_url.trim() === '') {
      // Try to get it from the repo cache as fallback
      const { data: repoData } = await adminClient
        .from('github_repos_cache')
        .select('html_url')
        .eq('id', github_repo_id)
        .single()

      if (repoData?.html_url) {
        github_url = repoData.html_url
      } else {
        return NextResponse.json(
          { error: 'github_url is required and cannot be empty' },
          { status: 400 }
        )
      }
    }

    // Use upsert in case project already exists for this repo
    const { data, error } = await adminClient
      .from('projects')
      .upsert(
        {
          github_repo_id,
          name,
          description,
          tech_stack: tech_stack || [],
          homepage_url: homepage_url || null,
          github_url: github_url.trim(),
          is_featured: is_featured || false,
          display_order: display_order || 0,
          status: status || 'draft',
          featured_image,
        },
        {
          onConflict: 'github_repo_id',
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Error creating/updating project:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Send auto-newsletter if published
    if ((status === 'published' || data?.status === 'published') && data) {
      try {
        const { sendAutoNewsletter } = await import('@/lib/newsletter/auto-send')
        await sendAutoNewsletter('project', {
          id: data.id,
          name: data.name,
          title: data.name,
          description: data.description,
          featured_image: data.featured_image,
        })
      } catch (newsletterError) {
        console.error('Error sending auto-newsletter:', newsletterError)
        // Don't fail the request if newsletter fails
      }
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    console.error('Error in project creation:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

