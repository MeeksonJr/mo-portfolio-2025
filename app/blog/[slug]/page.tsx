import { createServerClient } from '@/lib/supabase/server'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import BlogPostContent from '@/components/blog-post-content'
import StructuredData from '@/components/structured-data'
import PageViewTracker from '@/components/page-view-tracker'
import AchievementTrackerClient from '@/components/achievement-tracker-client'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  published_at: string | null
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, seo_title, seo_description, featured_image, published_at, updated_at, tags')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
  const image = post.featured_image 
    ? (post.featured_image.startsWith('http') ? post.featured_image : `${siteUrl}${post.featured_image}`)
    : `${siteUrl}/og-image.png`

  return genMeta({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || undefined,
    type: 'article',
    image,
    publishedTime: post.published_at || undefined,
    modifiedTime: post.updated_at || post.published_at || undefined,
    tags: post.tags || undefined,
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const supabase = await createServerClient()

  // Fetch the blog post
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !post) {
    notFound()
  }

  // Increment views (fire and forget)
  supabase
    .from('blog_posts')
    .update({ views: (post.views || 0) + 1 })
    .eq('id', post.id)
    .then(() => {}) // Fire and forget

  // Fetch related posts (same category or tags)
  let relatedPosts: Array<{
    id: string
    title: string
    slug: string
    excerpt: string | null
    featured_image: string | null
    published_at: string | null
  }> = []
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, featured_image, published_at')
      .eq('status', 'published')
      .neq('id', post.id)
      .limit(3)

    relatedPosts = data || []
  } catch (error) {
    console.error('Error fetching related posts:', error)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
  const image = post.featured_image 
    ? (post.featured_image.startsWith('http') ? post.featured_image : `${siteUrl}${post.featured_image}`)
    : undefined

  return (
    <>
      <StructuredData
        type="Article"
        title={post.title}
        description={post.excerpt || undefined}
        url={`/blog/${post.slug}`}
        image={image}
        publishedTime={post.published_at || undefined}
        modifiedTime={post.updated_at || post.published_at || undefined}
        author="Mohamed Datt"
      />
      <div className="min-h-screen bg-background">
        <PageViewTracker contentType="blog_post" contentId={post.id} />
        <Navigation />
        <main className="pt-20 pb-16">
          <BlogPostContent post={post} relatedPosts={relatedPosts} />
          <AchievementTrackerClient achievementId="read-blog-post" />
        </main>
        <FooterLight />
      </div>
    </>
  )
}

