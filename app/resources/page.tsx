import { createServerClient } from '@/lib/supabase/server'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import ResourcesListing from '@/components/resources-listing'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = genMeta({
  title: 'Resources',
  description: 'Curated collection of tools, courses, books, articles, and videos for developers. Resources for learning web development, AI, and modern technologies',
  type: 'website',
  tags: ['resources', 'tools', 'courses', 'learning', 'developer resources'],
})

export default async function ResourcesPage() {
  const supabase = await createServerClient()

  // Fetch published resources
  let resources = []
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching resources:', error)
    } else {
      resources = data || []
    }
  } catch (error) {
    console.error('Error in ResourcesPage:', error)
  }

  return (
    <>
      <StructuredData
        type="WebSite"
        title="Resources | Mohamed Datt"
        description="Curated collection of tools, courses, books, articles, and videos for developers"
        url="/resources"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 pb-16">
          <ResourcesListing resources={resources} />
        </main>
        <FooterLight />
      </div>
    </>
  )
}

