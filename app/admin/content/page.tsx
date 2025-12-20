import { createAdminClient } from '@/lib/supabase/server'
import { BookOpen, Briefcase, Package, FolderGit2 } from 'lucide-react'
import Link from 'next/link'

export default async function ContentPage() {
  let blogPosts = { count: 0 }
  let caseStudies = { count: 0 }
  let resources = { count: 0 }
  let projects = { count: 0 }

  try {
    const adminClient = createAdminClient()

    // Get content counts
    const results = await Promise.all([
      adminClient.from('blog_posts').select('id', { count: 'exact', head: true }),
      adminClient.from('case_studies').select('id', { count: 'exact', head: true }),
      adminClient.from('resources').select('id', { count: 'exact', head: true }),
      adminClient.from('projects').select('id', { count: 'exact', head: true }),
    ])

    blogPosts = results[0] || { count: 0 }
    caseStudies = results[1] || { count: 0 }
    resources = results[2] || { count: 0 }
    projects = results[3] || { count: 0 }
  } catch (error: any) {
    console.error('Error in ContentPage:', error)
    // Use default counts of 0
  }

  const contentTypes = [
    {
      name: 'Blog Posts',
      count: blogPosts.count || 0,
      href: '/admin/content/blog',
      icon: BookOpen,
      description: 'Manage your blog posts and articles',
    },
    {
      name: 'Case Studies',
      count: caseStudies.count || 0,
      href: '/admin/content/case-studies',
      icon: Briefcase,
      description: 'Showcase your project case studies',
    },
    {
      name: 'Resources',
      count: resources.count || 0,
      href: '/admin/content/resources',
      icon: Package,
      description: 'Manage your resources and tools',
    },
    {
      name: 'Projects',
      count: projects.count || 0,
      href: '/admin/content/projects',
      icon: FolderGit2,
      description: 'Manage your project portfolio',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage all your content types in one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contentTypes.map((type) => {
          const Icon = type.icon
          return (
            <Link
              key={type.name}
              href={type.href}
              className="glass rounded-xl p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">{type.count}</div>
              </div>
              <h3 className="text-lg font-semibold mb-1">{type.name}</h3>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

