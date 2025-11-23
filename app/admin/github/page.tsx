import { createAdminClient } from '@/lib/supabase/server'
import GitHubReposBrowser from '@/components/admin/github-repos-browser'

export default async function AdminGitHubPage() {
  const adminClient = createAdminClient()

  // Fetch cached repos from database
  let cachedRepos = []
  try {
    const { data, error } = await adminClient
      .from('github_repos_cache')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching repos:', error)
    } else {
      cachedRepos = data || []
    }
  } catch (error) {
    console.error('Error in AdminGitHubPage:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">GitHub Repositories</h1>
        <p className="text-muted-foreground mt-2">
          Browse your repositories and create content from them
        </p>
      </div>

      <GitHubReposBrowser initialRepos={cachedRepos} />
    </div>
  )
}

