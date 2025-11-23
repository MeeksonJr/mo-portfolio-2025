import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const visibility = searchParams.get('visibility') || 'all'
    const language = searchParams.get('language') || 'all'
    const search = searchParams.get('search') || ''

    const adminClient = createAdminClient()

    let query = adminClient.from('github_repos_cache').select('*')

    // Apply filters
    if (visibility === 'public') {
      query = query.eq('is_private', false)
    } else if (visibility === 'private') {
      query = query.eq('is_private', true)
    }

    if (language !== 'all') {
      query = query.eq('language', language)
    }

    const { data: repos, error } = await query.order('updated_at', { ascending: false })

    if (error) {
      throw error
    }

    // Apply search filter (client-side for simplicity, can be moved to DB)
    let filteredRepos = repos || []
    if (search) {
      filteredRepos = filteredRepos.filter(
        (repo) =>
          repo.name.toLowerCase().includes(search.toLowerCase()) ||
          repo.description?.toLowerCase().includes(search.toLowerCase()) ||
          repo.topics.some((topic: string) => topic.toLowerCase().includes(search.toLowerCase()))
      )
    }

    return NextResponse.json({
      success: true,
      repos: filteredRepos,
      count: filteredRepos.length,
    })
  } catch (error: any) {
    console.error('Error fetching repos:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch repositories',
      },
      { status: 500 }
    )
  }
}

