import { createServerClient } from '@/lib/supabase/server'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import ResourceContent from '@/components/resource-content'
import StructuredData from '@/components/structured-data'
import PageViewTracker from '@/components/page-view-tracker'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface ResourcePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerClient()

  const { data: resource } = await supabase
    .from('resources')
    .select('title, description, featured_image, published_at, updated_at, tags')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!resource) {
    return {
      title: 'Resource Not Found',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
  const image = resource.featured_image 
    ? (resource.featured_image.startsWith('http') ? resource.featured_image : `${siteUrl}${resource.featured_image}`)
    : `${siteUrl}/og-image.png`

  return genMeta({
    title: resource.title,
    description: resource.description || undefined,
    type: 'article',
    image,
    publishedTime: resource.published_at || undefined,
    modifiedTime: resource.updated_at || resource.published_at || undefined,
    tags: resource.tags || undefined,
  })
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params
  const supabase = await createServerClient()

  // Fetch the resource
  const { data: resource, error } = await supabase
    .from('resources')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !resource) {
    notFound()
  }

  // Increment views (fire and forget)
  supabase
    .from('resources')
    .update({ views: (resource.views || 0) + 1 })
    .eq('id', resource.id)
    .then(() => {}) // Fire and forget

  // Fetch related resources (same type or category)
  let relatedResources: Array<{
    id: string
    title: string
    slug: string
    description: string | null
    featured_image: string | null
    type: 'tool' | 'course' | 'book' | 'article' | 'video' | 'other'
    published_at: string | null
  }> = []
  try {
    const { data } = await supabase
      .from('resources')
      .select('id, title, slug, description, featured_image, type, published_at')
      .eq('status', 'published')
      .neq('id', resource.id)
      .limit(3)

    if (data) {
      relatedResources = data
        .filter((r): r is typeof r & { type: 'tool' | 'course' | 'book' | 'article' | 'video' | 'other' } => 
          r.type !== null
        )
        .map((r) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          description: r.description,
          featured_image: r.featured_image,
          type: r.type as 'tool' | 'course' | 'book' | 'article' | 'video' | 'other',
          published_at: r.published_at,
        }))
    }
  } catch (error) {
    console.error('Error fetching related resources:', error)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
  const image = resource.featured_image 
    ? (resource.featured_image.startsWith('http') ? resource.featured_image : `${siteUrl}${resource.featured_image}`)
    : undefined

  return (
    <>
      <StructuredData
        type="Article"
        title={resource.title}
        description={resource.description || undefined}
        url={`/resources/${resource.slug}`}
        image={image}
        publishedTime={resource.published_at || undefined}
        modifiedTime={resource.updated_at || resource.published_at || undefined}
        author="Mohamed Datt"
      />
      <div className="min-h-screen bg-background">
        <PageViewTracker contentType="resource" contentId={resource.id} />
        <Navigation />
        <main className="pt-20 pb-16">
          <ResourceContent resource={resource} relatedResources={relatedResources as any} />
        </main>
        <FooterLight />
      </div>
    </>
  )
}

