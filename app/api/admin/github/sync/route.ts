import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'MeeksonJr'
const GITHUB_API_BASE = 'https://api.github.com'

export async function POST() {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'portfolio-admin',
    }

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const adminClient = createAdminClient()

    // Fetch all repositories with pagination
    let allRepos: any[] = []
    let page = 1
    const perPage = 100

    while (true) {
      const reposResponse = await fetch(
        `${GITHUB_API_BASE}/user/repos?sort=updated&per_page=${perPage}&page=${page}&affiliation=owner,collaborator`,
        { headers }
      )

      if (!reposResponse.ok) {
        throw new Error(`GitHub API failed: ${reposResponse.status}`)
      }

      const repos = await reposResponse.json()

      if (repos.length === 0) break

      allRepos = [...allRepos, ...repos]

      if (repos.length < perPage) break

      page++
      if (page > 10) break // Safety limit
    }

    console.log(`📦 Fetched ${allRepos.length} repositories from GitHub`)

    // Fetch README for each repo (optional, can be done async later)
    // For now, we'll just sync basic repo data

    // Transform and upsert to database
    const reposToUpsert = allRepos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      languages: null, // Will be fetched separately if needed
      topics: repo.topics || [],
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      watchers: repo.watchers_count || 0,
      open_issues: repo.open_issues_count || 0,
      is_private: repo.private || false,
      is_fork: repo.fork || false,
      is_archived: repo.archived || false,
      default_branch: repo.default_branch,
      license: repo.license?.name || null,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      last_synced_at: new Date().toISOString(),
      readme_content: null, // Will be fetched separately
    }))

    // Upsert repos (update if exists, insert if not)
    const { error: upsertError } = await adminClient
      .from('github_repos_cache')
      .upsert(reposToUpsert, {
        onConflict: 'id',
        ignoreDuplicates: false,
      })

    if (upsertError) {
      console.error('Error upserting repos:', upsertError)
      throw upsertError
    }

    // Fetch updated repos from database
    const { data: updatedRepos, error: fetchError } = await adminClient
      .from('github_repos_cache')
      .select('*')
      .order('updated_at', { ascending: false })

    if (fetchError) {
      throw fetchError
    }

    return NextResponse.json({
      success: true,
      repos: updatedRepos || [],
      synced: reposToUpsert.length,
    })
  } catch (error: any) {
    console.error('GitHub sync error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to sync repositories',
      },
      { status: 500 }
    )
  }
}

