import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'

const GITHUB_API_BASE = 'https://api.github.com'

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      console.error('No authenticated user found in README route')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { repoId, fullName, defaultBranch } = await request.json()

    if (!repoId || !fullName) {
      return NextResponse.json({ error: 'Repository ID and full name are required' }, { status: 400 })
    }

    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'portfolio-admin',
    }

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    // Fetch README content
    const branch = defaultBranch || 'main'
    const readmeUrl = `${GITHUB_API_BASE}/repos/${fullName}/readme?ref=${branch}`

    const readmeResponse = await fetch(readmeUrl, { headers })

    if (!readmeResponse.ok) {
      // README might not exist, return empty
      if (readmeResponse.status === 404) {
        return NextResponse.json({ content: '', success: true })
      }
      throw new Error(`GitHub API failed: ${readmeResponse.status}`)
    }

    const readmeData = await readmeResponse.json()
    
    // Decode base64 content
    const content = Buffer.from(readmeData.content, 'base64').toString('utf-8')

    // Update cache in database
    const adminClient = (await import('@/lib/supabase/server')).createAdminClient()
    await adminClient
      .from('github_repos_cache')
      .update({ readme_content: content })
      .eq('id', repoId)

    return NextResponse.json({ content, success: true })
  } catch (error: any) {
    console.error('Error fetching README:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch README' },
      { status: 500 }
    )
  }
}

