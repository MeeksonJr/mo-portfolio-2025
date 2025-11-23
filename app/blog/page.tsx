import { createServerClient } from '@/lib/supabase/server'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import BlogListing from '@/components/blog-listing'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = genMeta({
  title: 'Blog',
  description: 'Technical blog posts about web development, AI, software engineering, Next.js, TypeScript, and modern web technologies',
  type: 'website',
  tags: ['blog', 'web development', 'AI', 'Next.js', 'TypeScript', 'tutorials'],
})

export default async function BlogPage() {
  const supabase = await createServerClient()

  // Fetch published blog posts
  let blogPosts = []
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching blog posts:', error)
    } else {
      blogPosts = data || []
    }
  } catch (error) {
    console.error('Error in BlogPage:', error)
  }

  return (
    <>
      <StructuredData
        type="WebSite"
        title="Blog | Mohamed Datt"
        description="Technical blog posts about web development, AI, and software engineering"
        url="/blog"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 pb-16">
          <BlogListing posts={blogPosts} />
        </main>
        <FooterLight />
      </div>
    </>
  )
}

