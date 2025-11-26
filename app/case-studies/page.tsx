import { createAdminClient } from '@/lib/supabase/server'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import CaseStudiesListing from '@/components/case-studies-listing'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = genMeta({
  title: 'Case Studies',
  description: 'Detailed case studies showcasing projects, solutions, and technical implementations. Learn about problem-solving approaches, tech stacks, and project outcomes',
  type: 'website',
  tags: ['case studies', 'projects', 'portfolio', 'web development'],
})

export default async function CaseStudiesPage() {
  const supabase = createAdminClient()

  // Fetch published case studies
  let caseStudies = []
  try {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching case studies:', error)
    } else {
      caseStudies = data || []
    }
  } catch (error) {
    console.error('Error in CaseStudiesPage:', error)
  }

  return (
    <>
      <StructuredData
        type="WebSite"
        title="Case Studies | Mohamed Datt"
        description="Detailed case studies showcasing projects, solutions, and technical implementations"
        url="/case-studies"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content" role="main" className="pt-20 pb-16" tabIndex={-1}>
          <CaseStudiesListing caseStudies={caseStudies} />
        </main>
        <FooterLight />
      </div>
    </>
  )
}

