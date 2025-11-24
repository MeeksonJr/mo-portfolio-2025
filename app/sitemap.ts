import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'

/**
 * Helper to get full image URL
 */
function getImageUrl(image: string | null | undefined): string | undefined {
  if (!image) return undefined
  if (image.startsWith('http')) return image
  return `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createAdminClient()
  
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
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/testimonials`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  try {
    // Fetch blog posts with images
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, title, featured_image, updated_at, published_at')
      .eq('status', 'published')
      .limit(100)

    if (blogPosts) {
      blogPosts.forEach((post) => {
        const imageUrl = getImageUrl(post.featured_image)
        routes.push({
          url: `${siteUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at || post.published_at || Date.now()),
          changeFrequency: 'monthly',
          priority: 0.7,
          ...(imageUrl && {
            images: [imageUrl],
          }),
        })
      })
    }

    // Fetch case studies with images
    const { data: caseStudies } = await supabase
      .from('case_studies')
      .select('slug, title, featured_image, updated_at, published_at')
      .eq('status', 'published')
      .limit(100)

    if (caseStudies) {
      caseStudies.forEach((study) => {
        const imageUrl = getImageUrl(study.featured_image)
        routes.push({
          url: `${siteUrl}/case-studies/${study.slug}`,
          lastModified: new Date(study.updated_at || study.published_at || Date.now()),
          changeFrequency: 'monthly',
          priority: 0.7,
          ...(imageUrl && {
            images: [imageUrl],
          }),
        })
      })
    }

    // Fetch resources
    const { data: resources } = await supabase
      .from('resources')
      .select('slug, title, featured_image, updated_at, published_at')
      .eq('status', 'published')
      .limit(100)

    if (resources) {
      resources.forEach((resource) => {
        const imageUrl = getImageUrl(resource.featured_image)
        routes.push({
          url: `${siteUrl}/resources/${resource.slug}`,
          lastModified: new Date(resource.updated_at || resource.published_at || Date.now()),
          changeFrequency: 'monthly',
          priority: 0.6,
          ...(imageUrl && {
            images: [imageUrl],
          }),
        })
      })
    }

    // Fetch projects with images
    const { data: projects } = await supabase
      .from('projects')
      .select('name, description, featured_image, updated_at, created_at')
      .eq('status', 'published')
      .limit(100)

    if (projects) {
      projects.forEach((project) => {
        const slug = project.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        const imageUrl = getImageUrl(project.featured_image)
        routes.push({
          url: `${siteUrl}/projects/${slug}`,
          lastModified: new Date(project.updated_at || project.created_at || Date.now()),
          changeFrequency: 'monthly',
          priority: 0.7,
          ...(imageUrl && {
            images: [imageUrl],
          }),
        })
      })
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return routes
}

