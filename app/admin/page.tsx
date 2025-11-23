import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createServerClient()
  const adminClient = createAdminClient()

  // Get statistics
  const [blogPosts, caseStudies, resources, projects, repos] = await Promise.all([
    adminClient.from('blog_posts').select('id', { count: 'exact', head: true }),
    adminClient.from('case_studies').select('id', { count: 'exact', head: true }),
    adminClient.from('resources').select('id', { count: 'exact', head: true }),
    adminClient.from('projects').select('id', { count: 'exact', head: true }),
    adminClient.from('github_repos_cache').select('id', { count: 'exact', head: true }),
  ])

  const stats = {
    blogPosts: blogPosts.count || 0,
    caseStudies: caseStudies.count || 0,
    resources: resources.count || 0,
    projects: projects.count || 0,
    repos: repos.count || 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your portfolio content and projects
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass rounded-lg p-6">
          <div className="text-sm font-medium text-muted-foreground">Blog Posts</div>
          <div className="text-3xl font-bold mt-2">{stats.blogPosts}</div>
        </div>
        <div className="glass rounded-lg p-6">
          <div className="text-sm font-medium text-muted-foreground">Case Studies</div>
          <div className="text-3xl font-bold mt-2">{stats.caseStudies}</div>
        </div>
        <div className="glass rounded-lg p-6">
          <div className="text-sm font-medium text-muted-foreground">Resources</div>
          <div className="text-3xl font-bold mt-2">{stats.resources}</div>
        </div>
        <div className="glass rounded-lg p-6">
          <div className="text-sm font-medium text-muted-foreground">Projects</div>
          <div className="text-3xl font-bold mt-2">{stats.projects}</div>
        </div>
        <div className="glass rounded-lg p-6">
          <div className="text-sm font-medium text-muted-foreground">GitHub Repos</div>
          <div className="text-3xl font-bold mt-2">{stats.repos}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/github"
            className="p-4 border rounded-lg hover:bg-accent transition-colors"
          >
            <div className="font-medium">Browse GitHub Repos</div>
            <div className="text-sm text-muted-foreground mt-1">
              View and create content from repositories
            </div>
          </a>
          <a
            href="/admin/content/blog/new"
            className="p-4 border rounded-lg hover:bg-accent transition-colors"
          >
            <div className="font-medium">Create Blog Post</div>
            <div className="text-sm text-muted-foreground mt-1">
              Write a new blog post
            </div>
          </a>
          <a
            href="/admin/content"
            className="p-4 border rounded-lg hover:bg-accent transition-colors"
          >
            <div className="font-medium">Manage Content</div>
            <div className="text-sm text-muted-foreground mt-1">
              View and edit all content
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

