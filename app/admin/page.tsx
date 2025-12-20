import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import EnhancedStatCard from '@/components/admin/enhanced-stat-card'
import ActivityFeed from '@/components/admin/activity-feed'
import { BookOpen, Briefcase, Package, FolderGit2, FileText, Link } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createServerClient()
  const adminClient = createAdminClient()

  // Get statistics
  const [blogPosts, caseStudies, resources, projects, repos, testimonials] = await Promise.all([
    adminClient.from('blog_posts').select('id', { count: 'exact', head: true }),
    adminClient.from('case_studies').select('id', { count: 'exact', head: true }),
    adminClient.from('resources').select('id', { count: 'exact', head: true }),
    adminClient.from('projects').select('id', { count: 'exact', head: true }),
    adminClient.from('github_repos_cache').select('id', { count: 'exact', head: true }),
    adminClient.from('testimonials').select('id', { count: 'exact', head: true }),
  ])

  const stats = {
    blogPosts: blogPosts.count || 0,
    caseStudies: caseStudies.count || 0,
    resources: resources.count || 0,
    projects: projects.count || 0,
    repos: repos.count || 0,
    testimonials: testimonials.count || 0,
    totalContent: (blogPosts.count || 0) + (caseStudies.count || 0) + (resources.count || 0) + (projects.count || 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your portfolio content and projects
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/admin/analytics">
            <Link className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <EnhancedStatCard
          title="Blog Posts"
          value={stats.blogPosts}
          icon={BookOpen}
          href="/admin/content/blog"
        />
        <EnhancedStatCard
          title="Case Studies"
          value={stats.caseStudies}
          icon={Briefcase}
          href="/admin/content/case-studies"
        />
        <EnhancedStatCard
          title="Resources"
          value={stats.resources}
          icon={Package}
          href="/admin/content/resources"
        />
        <EnhancedStatCard
          title="Projects"
          value={stats.projects}
          icon={FolderGit2}
          href="/admin/content/projects"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed limit={10} />
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="glass rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a
                href="/admin/github"
                className="block p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="font-medium">Browse GitHub Repos</div>
                <div className="text-sm text-muted-foreground mt-1">
                  View and create content from repositories
                </div>
              </a>
              <a
                href="/admin/content/blog/new"
                className="block p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="font-medium">Create Blog Post</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Write a new blog post
                </div>
              </a>
              <a
                href="/admin/content"
                className="block p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="font-medium">Manage Content</div>
                <div className="text-sm text-muted-foreground mt-1">
                  View and edit all content
                </div>
              </a>
            </div>
          </div>

          {/* Additional Stats */}
          <EnhancedStatCard
            title="Total Published Content"
            value={stats.totalContent}
            icon={FileText}
            description="Blog posts, case studies, resources, and projects"
          />
        </div>
      </div>
    </div>
  )
}

