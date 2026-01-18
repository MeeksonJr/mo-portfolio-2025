import { createAdminClient } from '@/lib/supabase/server'
import GitHubReposBrowser from '@/components/admin/github-repos-browser'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

export default async function AdminGitHubPage() {
  let cachedRepos = []
  
  try {
    const adminClient = createAdminClient()

    // Fetch cached repos from database
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
  } catch (error: any) {
    console.error('Error in AdminGitHubPage:', error)
    // Return page with empty repos - component will handle it
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn(TYPOGRAPHY.h2)}>GitHub Repositories</h1>
        <p className="text-muted-foreground mt-2">
          Browse your repositories and create content from them
        </p>
      </div>

      <GitHubReposBrowser initialRepos={cachedRepos} />
    </div>
  )
}

