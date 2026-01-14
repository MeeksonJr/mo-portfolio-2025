import { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import BlogListing from '@/components/blog-listing'
import { BookOpen } from 'lucide-react'
import { notFound } from 'next/navigation'

interface SeriesPageProps {
  params: Promise<{ series: string }>
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const { series } = await params
  const decodedSeries = decodeURIComponent(series)

  return {
    title: `${decodedSeries} Series`,
    description: `All posts in the ${decodedSeries} series by Mohamed Datt`,
  }
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { series } = await params
  const decodedSeries = decodeURIComponent(series)

  const supabase = await createAdminClient()

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('series', decodedSeries)
    .eq('status', 'published')
    .order('series_order', { ascending: true, nullsLast: true })
    .order('published_at', { ascending: true })

  if (error || !posts || posts.length === 0) {
    notFound()
  }

  return (
    <EnhancedPageLayout
      title={
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <span>{decodedSeries} Series</span>
        </div>
      }
      description={`${posts.length} post${posts.length !== 1 ? 's' : ''} in this series`}
      showBreadcrumbs={true}
    >
      <div className="mb-8 p-6 bg-muted/50 rounded-lg border border-primary/20">
        <h2 className="text-xl font-semibold mb-2">About This Series</h2>
        <p className="text-muted-foreground">
          This series contains {posts.length} published post{posts.length !== 1 ? 's' : ''}. 
          Read them in order for the best experience.
        </p>
      </div>
      <BlogListing posts={posts} />
    </EnhancedPageLayout>
  )
}

