import { NextRequest } from "next/server"
import { 
  createSuccessResponse, 
  createErrorResponse, 
  withPerformanceMonitoring,
  deduplicateRequest,
  getRequestMetadata
} from "@/lib/api-optimization"

const GITHUB_USERNAME = "MeeksonJr"
const GITHUB_API_BASE = "https://api.github.com"

// Featured repositories (you can customize this list)
const FEATURED_REPOS = ["edusphere-ai", "interview-prep-ai", "ai-content-generator", "portfolio-2025"]

export const maxDuration = 30

export async function GET(request: NextRequest) {
  const metadata = getRequestMetadata(request)
  console.log("🐙 GitHub API: Fetching repositories", { ip: metadata.ip })

  return withPerformanceMonitoring('github-repos-fetch', async () => {
    try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "portfolio-app",
    }

    // Add authorization if token is available
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
      console.log("🔑 GitHub API: Using authenticated requests")
    } else {
      console.log("⚠️ GitHub API: Using unauthenticated requests (rate limited)")
    }

    // Fetch user profile
    const userResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`, {
      headers,
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!userResponse.ok) {
      throw new Error(`GitHub user API failed: ${userResponse.status} ${userResponse.statusText}`)
    }

    const userProfile = await userResponse.json()
    console.log("✅ GitHub API: User profile fetched")

    // Fetch all repositories
    const reposResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, {
      headers,
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!reposResponse.ok) {
      throw new Error(`GitHub repos API failed: ${reposResponse.status} ${reposResponse.statusText}`)
    }

    const allRepos = await reposResponse.json()
    console.log(`📦 GitHub API: Found ${allRepos.length} repositories`)

    // Filter and prioritize featured repos
    const featuredRepos = FEATURED_REPOS.map((repoName) => allRepos.find((repo: any) => repo.name === repoName)).filter(
      Boolean,
    )

    // Get other notable repos (high stars, recent activity)
    const otherNotableRepos = allRepos
      .filter((repo: any) => !FEATURED_REPOS.includes(repo.name) && !repo.fork && repo.stargazers_count > 0)
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 2)

    // Combine featured and notable repos
    const displayRepos = [...featuredRepos, ...otherNotableRepos].slice(0, 6)

    // Transform data for frontend
    const transformedRepos = displayRepos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || "No description available",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      url: repo.html_url,
      homepage: repo.homepage,
      topics: repo.topics || [],
      updated_at: repo.updated_at,
      created_at: repo.created_at,
      size: repo.size,
      open_issues: repo.open_issues_count,
      is_featured: FEATURED_REPOS.includes(repo.name),
    }))

    // Calculate stats
    const stats = {
      total_repos: userProfile.public_repos,
      total_stars: allRepos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0),
      total_forks: allRepos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0),
      followers: userProfile.followers,
      following: userProfile.following,
      profile_url: userProfile.html_url,
      avatar_url: userProfile.avatar_url,
      bio: userProfile.bio,
      location: userProfile.location,
      blog: userProfile.blog,
      company: userProfile.company,
      created_at: userProfile.created_at,
    }

    console.log("✅ GitHub API: Data transformed successfully")
    console.log(`📊 GitHub API: Stats - ${stats.total_repos} repos, ${stats.total_stars} stars`)

      return createSuccessResponse({
        success: true,
        repositories: transformedRepos,
        stats,
        fetched_at: new Date().toISOString(),
        rate_limit_remaining: reposResponse.headers.get("x-ratelimit-remaining"),
      }, 200, 'static')
    } catch (error) {
      // Return fallback data with success: false to indicate it's fallback
      return createSuccessResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        repositories: getFallbackRepos(),
        stats: getFallbackStats(),
        fetched_at: new Date().toISOString(),
        is_fallback: true,
      }, 200, 'static')
    }
  })
}

// Fallback data if API fails
function getFallbackRepos() {
  return [
    {
      id: 1,
      name: "edusphere-ai",
      description: "AI-powered educational platform with assignment assistance and blog generation",
      stars: 24,
      forks: 8,
      language: "TypeScript",
      url: "https://github.com/MeeksonJr/edusphere-ai",
      homepage: null,
      topics: ["ai", "education", "nextjs"],
      is_featured: true,
    },
    {
      id: 2,
      name: "interview-prep-ai",
      description: "Mock interview platform with AI-powered feedback and resume analysis",
      stars: 18,
      forks: 5,
      language: "JavaScript",
      url: "https://github.com/MeeksonJr/interview-prep-ai",
      homepage: null,
      topics: ["ai", "interview", "career"],
      is_featured: true,
    },
    {
      id: 3,
      name: "ai-content-generator",
      description: "Advanced content generation with sentiment analysis and analytics",
      stars: 31,
      forks: 12,
      language: "TypeScript",
      url: "https://github.com/MeeksonJr/ai-content-generator",
      homepage: null,
      topics: ["ai", "content", "saas"],
      is_featured: true,
    },
    {
      id: 4,
      name: "portfolio-2025",
      description: "Creative terminal-inspired portfolio built with Next.js and Framer Motion",
      stars: 15,
      forks: 3,
      language: "TypeScript",
      url: "https://github.com/MeeksonJr/portfolio-2025",
      homepage: "https://mohameddatt.com",
      topics: ["portfolio", "nextjs", "framer-motion"],
      is_featured: true,
    },
  ]
}

function getFallbackStats() {
  return {
    total_repos: 25,
    total_stars: 88,
    total_forks: 28,
    followers: 45,
    following: 32,
    profile_url: "https://github.com/MeeksonJr",
    avatar_url: "https://github.com/MeeksonJr.png",
    bio: "Full Stack Developer passionate about AI and web technologies",
    location: "Norfolk, Virginia",
    blog: "https://mohameddatt.com",
    company: null,
  }
}
