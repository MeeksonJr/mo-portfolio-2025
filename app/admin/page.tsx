import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import AdminDashboardClient from '@/components/admin/admin-dashboard-client'
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

  return <AdminDashboardClient stats={stats} />
}

