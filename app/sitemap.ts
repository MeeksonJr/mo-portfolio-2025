import { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerClient()
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  try {
    // Fetch blog posts
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .limit(100)

    if (blogPosts) {
      blogPosts.forEach((post) => {
        routes.push({
          url: `${siteUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at || post.published_at || Date.now()),
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      })
    }

    // Fetch case studies
    const { data: caseStudies } = await supabase
      .from('case_studies')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .limit(100)

    if (caseStudies) {
      caseStudies.forEach((study) => {
        routes.push({
          url: `${siteUrl}/case-studies/${study.slug}`,
          lastModified: new Date(study.updated_at || study.published_at || Date.now()),
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      })
    }

    // Fetch resources
    const { data: resources } = await supabase
      .from('resources')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .limit(100)

    if (resources) {
      resources.forEach((resource) => {
        routes.push({
          url: `${siteUrl}/resources/${resource.slug}`,
          lastModified: new Date(resource.updated_at || resource.published_at || Date.now()),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      })
    }

    // Fetch projects
    const { data: projects } = await supabase
      .from('projects')
      .select('name, updated_at, created_at')
      .eq('status', 'published')
      .limit(100)

    if (projects) {
      projects.forEach((project) => {
        const slug = project.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        routes.push({
          url: `${siteUrl}/projects/${slug}`,
          lastModified: new Date(project.updated_at || project.created_at || Date.now()),
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      })
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return routes
}

