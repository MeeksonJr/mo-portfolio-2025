import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'

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
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete project' },
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

    // Validate github_url if it's being updated (required field)
    if (body.github_url !== undefined) {
      if (!body.github_url || body.github_url.trim() === '') {
        // Try to get it from existing project or repo cache as fallback
        const { data: existingProject } = await adminClient
          .from('projects')
          .select('github_repo_id, github_url')
          .eq('id', id)
          .single()

        if (existingProject?.github_url) {
          body.github_url = existingProject.github_url
        } else if (existingProject?.github_repo_id) {
          const { data: repoData } = await adminClient
            .from('github_repos_cache')
            .select('html_url')
            .eq('id', existingProject.github_repo_id)
            .single()

          if (repoData?.html_url) {
            body.github_url = repoData.html_url
          } else {
            return NextResponse.json(
              { error: 'github_url is required and cannot be empty' },
              { status: 400 }
            )
          }
        } else {
          return NextResponse.json(
            { error: 'github_url is required and cannot be empty' },
            { status: 400 }
          )
        }
      } else {
        body.github_url = body.github_url.trim()
      }
    }

    // Check if this is a new publication (status changed to published)
    let wasJustPublished = false
    if (body.status === 'published') {
      const { data: existingProject } = await adminClient
        .from('projects')
        .select('status')
        .eq('id', id)
        .single()

      // Only send newsletter if it wasn't already published
      wasJustPublished = existingProject?.status !== 'published'
    }

    const { data, error } = await adminClient
      .from('projects')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
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

    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update project' },
      { status: 500 }
    )
  }
}

