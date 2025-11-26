import { NextRequest, NextResponse } from 'next/server'

const GITHUB_USERNAME = 'MeeksonJr'
const GITHUB_API_BASE = 'https://api.github.com'

export async function GET(request: NextRequest) {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'portfolio-app',
    }

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    // Fetch all repositories
    const reposResponse = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      { headers, next: { revalidate: 300 } }
    )

    if (!reposResponse.ok) {
      throw new Error(`GitHub repos API failed: ${reposResponse.status}`)
    }

    const repos = await reposResponse.json()

    // Fetch PRs, issues, and events for each repo
    let totalPRs = 0
    let totalIssues = 0
    let recentActivity: Array<{
      date: string
      type: 'commit' | 'pr' | 'issue' | 'review'
      repo: string
      description: string
    }> = []

    // Process top 10 most active repos
    const activeRepos = repos
      .filter((repo: any) => !repo.fork && repo.stargazers_count > 0)
      .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 10)

    for (const repo of activeRepos) {
      try {
        // Fetch PRs
        const prsResponse = await fetch(
          `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/pulls?state=all&per_page=100`,
          { headers, next: { revalidate: 300 } }
        )
        if (prsResponse.ok) {
          const prs = await prsResponse.json()
          totalPRs += prs.length
          
          // Add recent PRs to activity
          prs.slice(0, 3).forEach((pr: any) => {
            if (pr.merged_at || pr.closed_at) {
              recentActivity.push({
                date: pr.merged_at || pr.closed_at,
                type: 'pr',
                repo: repo.name,
                description: pr.merged_at ? `Merged PR: ${pr.title}` : `Closed PR: ${pr.title}`,
              })
            }
          })
        }

        // Fetch issues
        const issuesResponse = await fetch(
          `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/issues?state=all&per_page=100`,
          { headers, next: { revalidate: 300 } }
        )
        if (issuesResponse.ok) {
          const issues = await issuesResponse.json()
          const actualIssues = issues.filter((issue: any) => !issue.pull_request) // Exclude PRs
          totalIssues += actualIssues.length
          
          // Add recent issues to activity
          actualIssues.slice(0, 2).forEach((issue: any) => {
            if (issue.closed_at) {
              recentActivity.push({
                date: issue.closed_at,
                type: 'issue',
                repo: repo.name,
                description: `Closed issue: ${issue.title}`,
              })
            }
          })
        }

        // Fetch recent commits
        const commitsResponse = await fetch(
          `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=5`,
          { headers, next: { revalidate: 300 } }
        )
        if (commitsResponse.ok) {
          const commits = await commitsResponse.json()
          commits.slice(0, 2).forEach((commit: any) => {
            recentActivity.push({
              date: commit.commit.author.date,
              type: 'commit',
              repo: repo.name,
              description: commit.commit.message.split('\n')[0],
            })
          })
        }
      } catch (error) {
        console.error(`Error fetching data for ${repo.name}:`, error)
        // Continue with other repos
      }
    }

    // Sort activity by date (most recent first) and limit to 10
    recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    recentActivity = recentActivity.slice(0, 10)

    // Calculate code reviews (approximate: PRs that were reviewed)
    const codeReviews = Math.floor(totalPRs * 0.7) // Estimate 70% of PRs were reviewed

    return NextResponse.json({
      pullRequests: totalPRs,
      codeReviews,
      issues: totalIssues,
      recentActivity,
    })
  } catch (error) {
    console.error('Error fetching GitHub collaboration data:', error)
    // Return fallback data
    return NextResponse.json({
      pullRequests: 0,
      codeReviews: 0,
      issues: 0,
      recentActivity: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

