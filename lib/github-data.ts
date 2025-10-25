interface Repository {
  id: number
  name: string
  description: string
  stars: number
  forks: number
  language: string
  url: string
  homepage?: string
  topics: string[]
  updated_at?: string
  created_at?: string
  size?: number
  open_issues?: number
  is_featured?: boolean
  is_fork?: boolean
  is_private?: boolean
  default_branch?: string
  license?: string
  watchers?: number
  has_issues?: boolean
  has_projects?: boolean
  has_wiki?: boolean
  archived?: boolean
  disabled?: boolean
  pushed_at?: string
}

interface GitHubStats {
  total_repos: number
  total_stars: number
  total_forks: number
  followers: number
  following: number
  profile_url: string
  avatar_url?: string
  bio?: string
  location?: string
  blog?: string
  company?: string
  created_at?: string
  public_gists?: number
}

interface GitHubData {
  success: boolean
  repositories: Repository[]
  stats: GitHubStats
  error?: string
  fetched_at: string
  total_fetched?: number
}

let cachedGitHubData: GitHubData | null = null
let lastFetchTime = 0
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes for comprehensive data

// Direct GitHub API fetch function for server-side use
async function fetchGitHubDataDirect(): Promise<GitHubData> {
  const GITHUB_USERNAME = "MeeksonJr"
  const GITHUB_API_BASE = "https://api.github.com"
  const FEATURED_REPOS = ["edusphere-ai", "interview-prep-ai", "ai-content-generator", "portfolio-2025"]

  console.log("🐙 GitHub Data: Fetching ALL repositories from GitHub API")

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "portfolio-app",
  }

  // Add authorization if token is available
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    console.log("🔑 GitHub Data: Using authenticated requests")
  }

  try {
    // Fetch user profile
    const userResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`, { headers })
    if (!userResponse.ok) {
      throw new Error(`GitHub user API failed: ${userResponse.status}`)
    }
    const userProfile = await userResponse.json()
    console.log("✅ GitHub Data: User profile fetched")

    // Fetch ALL repositories with pagination
    let allRepos: any[] = []
    let page = 1
    const perPage = 100

    while (true) {
      console.log(`📦 GitHub Data: Fetching page ${page}...`)

      const reposResponse = await fetch(
        `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${perPage}&page=${page}`,
        { headers },
      )

      if (!reposResponse.ok) {
        throw new Error(`GitHub repos API failed: ${reposResponse.status}`)
      }

      const repos = await reposResponse.json()

      if (repos.length === 0) {
        break // No more repositories
      }

      allRepos = [...allRepos, ...repos]

      // If we got less than perPage, we're done
      if (repos.length < perPage) {
        break
      }

      page++

      // Safety check to prevent infinite loops
      if (page > 10) {
        console.warn("⚠️ GitHub Data: Reached page limit, stopping fetch")
        break
      }
    }

    console.log(`📦 GitHub Data: Found ${allRepos.length} total repositories`)

    // Transform ALL repositories with comprehensive data
    const transformedRepos = allRepos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || "No description available",
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      watchers: repo.watchers_count || 0,
      language: repo.language,
      url: repo.html_url,
      homepage: repo.homepage,
      topics: repo.topics || [],
      updated_at: repo.updated_at,
      created_at: repo.created_at,
      pushed_at: repo.pushed_at,
      size: repo.size,
      open_issues: repo.open_issues_count || 0,
      is_featured: FEATURED_REPOS.includes(repo.name),
      is_fork: repo.fork || false,
      is_private: repo.private || false,
      default_branch: repo.default_branch,
      license: repo.license?.name || null,
      has_issues: repo.has_issues || false,
      has_projects: repo.has_projects || false,
      has_wiki: repo.has_wiki || false,
      archived: repo.archived || false,
      disabled: repo.disabled || false,
    }))

    // Calculate comprehensive stats
    const stats = {
      total_repos: userProfile.public_repos,
      total_stars: allRepos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0),
      total_forks: allRepos.reduce((sum: number, repo: any) => sum + (repo.forks_count || 0), 0),
      followers: userProfile.followers,
      following: userProfile.following,
      profile_url: userProfile.html_url,
      avatar_url: userProfile.avatar_url,
      bio: userProfile.bio,
      location: userProfile.location,
      blog: userProfile.blog,
      company: userProfile.company,
      created_at: userProfile.created_at,
      public_gists: userProfile.public_gists,
    }

    console.log(`✅ GitHub Data: Successfully fetched ${transformedRepos.length} repositories`)
    console.log(`📊 GitHub Stats: ${stats.total_repos} repos, ${stats.total_stars} stars, ${stats.total_forks} forks`)

    return {
      success: true,
      repositories: transformedRepos,
      stats,
      fetched_at: new Date().toISOString(),
      total_fetched: transformedRepos.length,
    }
  } catch (error) {
    console.error("❌ GitHub Data: Direct fetch failed:", error)
    throw error
  }
}

// Enhanced fallback data
function getFallbackData(): GitHubData {
  return {
    success: false,
    repositories: [
      {
        id: 1,
        name: "edusphere-ai",
        description: "AI-powered educational platform with assignment assistance and blog generation",
        stars: 24,
        forks: 8,
        watchers: 12,
        language: "TypeScript",
        url: "https://github.com/MeeksonJr/edusphere-ai",
        homepage: null,
        topics: ["ai", "education", "nextjs", "supabase"],
        is_featured: true,
        is_fork: false,
        is_private: false,
        open_issues: 3,
        size: 2048,
        license: "MIT",
        has_issues: true,
        has_projects: false,
        has_wiki: false,
        archived: false,
        disabled: false,
        default_branch: "main",
      },
      {
        id: 2,
        name: "interview-prep-ai",
        description: "Mock interview platform with AI-powered feedback and resume analysis",
        stars: 18,
        forks: 5,
        watchers: 8,
        language: "JavaScript",
        url: "https://github.com/MeeksonJr/interview-prep-ai",
        homepage: null,
        topics: ["ai", "interview", "career", "firebase"],
        is_featured: true,
        is_fork: false,
        is_private: false,
        open_issues: 2,
        size: 1536,
        license: "MIT",
        has_issues: true,
        has_projects: true,
        has_wiki: false,
        archived: false,
        disabled: false,
        default_branch: "main",
      },
      {
        id: 3,
        name: "ai-content-generator",
        description: "Advanced content generation with sentiment analysis and analytics",
        stars: 31,
        forks: 12,
        watchers: 15,
        language: "TypeScript",
        url: "https://github.com/MeeksonJr/ai-content-generator",
        homepage: null,
        topics: ["ai", "content", "saas", "analytics"],
        is_featured: true,
        is_fork: false,
        is_private: false,
        open_issues: 1,
        size: 3072,
        license: "MIT",
        has_issues: true,
        has_projects: true,
        has_wiki: true,
        archived: false,
        disabled: false,
        default_branch: "main",
      },
      {
        id: 4,
        name: "portfolio-2025",
        description: "Creative terminal-inspired portfolio built with Next.js and Framer Motion",
        stars: 15,
        forks: 3,
        watchers: 6,
        language: "TypeScript",
        url: "https://github.com/MeeksonJr/portfolio-2025",
        homepage: "https://mohameddatt.com",
        topics: ["portfolio", "nextjs", "framer-motion", "ai"],
        is_featured: true,
        is_fork: false,
        is_private: false,
        open_issues: 0,
        size: 1024,
        license: "MIT",
        has_issues: true,
        has_projects: false,
        has_wiki: false,
        archived: false,
        disabled: false,
        default_branch: "main",
      },
    ],
    stats: {
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
      public_gists: 5,
    },
    error: "Using fallback data",
    fetched_at: new Date().toISOString(),
    total_fetched: 4,
  }
}

export async function getGitHubData(): Promise<GitHubData> {
  const now = Date.now()

  // Return cached data if it's still fresh
  if (cachedGitHubData && now - lastFetchTime < CACHE_DURATION) {
    console.log("📦 GitHub Data: Using cached data")
    return cachedGitHubData
  }

  try {
    console.log("🐙 GitHub Data: Fetching fresh comprehensive data...")

    // Try direct GitHub API fetch first
    const data = await fetchGitHubDataDirect()

    // Cache the data
    cachedGitHubData = data
    lastFetchTime = now

    console.log("✅ GitHub Data: Fresh comprehensive data cached")
    return data
  } catch (error) {
    console.error("❌ GitHub Data: Failed to fetch fresh data:", error)

    // Return cached data if available, otherwise fallback data
    if (cachedGitHubData) {
      console.log("📦 GitHub Data: Using stale cached data")
      return cachedGitHubData
    }

    console.log("🔄 GitHub Data: Using fallback data")
    const fallbackData = getFallbackData()
    cachedGitHubData = fallbackData
    lastFetchTime = now
    return fallbackData
  }
}

export function formatGitHubDataForAI(data: GitHubData | null): string {
  if (!data) {
    return "GitHub data is currently unavailable."
  }

  const { repositories, stats } = data

  let formattedData = `
MOHAMED'S COMPLETE GITHUB PROFILE DATA:

PROFILE STATISTICS:
- Total Public Repositories: ${stats.total_repos}
- Total Stars Received: ${stats.total_stars}
- Total Forks: ${stats.total_forks}
- Total Watchers: ${repositories.reduce((sum, repo) => sum + (repo.watchers || 0), 0)}
- Followers: ${stats.followers}
- Following: ${stats.following}
- Public Gists: ${stats.public_gists || 0}
- Profile URL: ${stats.profile_url}
- Location: ${stats.location || "Norfolk, Virginia"}
- Bio: ${stats.bio || "Full Stack Developer passionate about AI and web technologies"}
${stats.blog ? `- Website: ${stats.blog}` : ""}
${stats.company ? `- Company: ${stats.company}` : ""}
- GitHub Member Since: ${stats.created_at ? new Date(stats.created_at).getFullYear() : "2020"}

ALL REPOSITORIES (${repositories.length} total):
`

  // Sort repositories by stars for better organization
  const sortedRepos = repositories.sort((a, b) => b.stars - a.stars)

  sortedRepos.forEach((repo, index) => {
    formattedData += `
${index + 1}. ${repo.name.toUpperCase()}:
   - Description: ${repo.description}
   - Stars: ${repo.stars} | Forks: ${repo.forks} | Watchers: ${repo.watchers || 0}
   - Primary Language: ${repo.language || "Not specified"}
   - GitHub URL: ${repo.url}
   ${repo.homepage ? `- Live Demo: ${repo.homepage}` : ""}
   - Topics: ${repo.topics.length > 0 ? repo.topics.join(", ") : "None"}
   - Created: ${repo.created_at ? new Date(repo.created_at).toLocaleDateString() : "Unknown"}
   - Last Updated: ${repo.updated_at ? new Date(repo.updated_at).toLocaleDateString() : "Unknown"}
   - Last Push: ${repo.pushed_at ? new Date(repo.pushed_at).toLocaleDateString() : "Unknown"}
   - Repository Size: ${repo.size ? `${repo.size} KB` : "Unknown"}
   - Open Issues: ${repo.open_issues || 0}
   - Default Branch: ${repo.default_branch || "main"}
   ${repo.license ? `- License: ${repo.license}` : ""}
   - Status: ${repo.is_featured ? "FEATURED PROJECT" : "Regular Repository"}
   ${repo.is_fork ? "- Type: Fork" : "- Type: Original Repository"}
   ${repo.archived ? "- Status: ARCHIVED" : ""}
   ${repo.disabled ? "- Status: DISABLED" : ""}
   - Features: Issues(${repo.has_issues ? "Yes" : "No"}), Projects(${repo.has_projects ? "Yes" : "No"}), Wiki(${repo.has_wiki ? "Yes" : "No"})
`
  })

  formattedData += `
REPOSITORY ANALYSIS:
- Most Popular: ${sortedRepos[0]?.name} (${sortedRepos[0]?.stars} stars)
- Most Recent: ${repositories.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime())[0]?.name}
- Languages Used: ${[...new Set(repositories.map((r) => r.language).filter(Boolean))].join(", ")}
- Featured Projects: ${repositories.filter((r) => r.is_featured).length}
- Original Repositories: ${repositories.filter((r) => !r.is_fork).length}
- Forked Repositories: ${repositories.filter((r) => r.is_fork).length}
- Archived Repositories: ${repositories.filter((r) => r.archived).length}
- Repositories with Issues Enabled: ${repositories.filter((r) => r.has_issues).length}
- Repositories with Wiki: ${repositories.filter((r) => r.has_wiki).length}
- Total Repository Size: ${repositories.reduce((sum, repo) => sum + (repo.size || 0), 0)} KB

RECENT ACTIVITY:
- Most Recently Updated: ${repositories
    .sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime())
    .slice(0, 3)
    .map((r) => r.name)
    .join(", ")}
- Most Recently Pushed: ${repositories
    .sort((a, b) => new Date(b.pushed_at || 0).getTime() - new Date(a.pushed_at || 0).getTime())
    .slice(0, 3)
    .map((r) => r.name)
    .join(", ")}

${data.success ? "✅ This data was fetched live from GitHub API." : "⚠️ This is fallback data (GitHub API unavailable)."}
Data last updated: ${new Date(data.fetched_at).toLocaleString()}
Total repositories fetched: ${data.total_fetched || repositories.length}

You can answer questions about ANY of these repositories, including their details, technologies used, features, activity, and more.
`

  return formattedData
}

// Helper function to find a specific repository
export function findRepository(data: GitHubData | null, repoName: string): Repository | null {
  if (!data || !data.repositories) return null

  const normalizedName = repoName.toLowerCase().replace(/[-_\s]/g, "")

  return (
    data.repositories.find(
      (repo) =>
        repo.name.toLowerCase().replace(/[-_\s]/g, "") === normalizedName ||
        repo.name.toLowerCase().includes(repoName.toLowerCase()) ||
        repo.description.toLowerCase().includes(repoName.toLowerCase()),
    ) || null
  )
}
