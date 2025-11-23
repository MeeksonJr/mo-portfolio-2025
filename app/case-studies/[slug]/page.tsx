import { createServerClient } from '@/lib/supabase/server'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import CaseStudyContent from '@/components/case-study-content'
import StructuredData from '@/components/structured-data'
import PageViewTracker from '@/components/page-view-tracker'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerClient()

  const { data: caseStudy } = await supabase
    .from('case_studies')
    .select('title, description, featured_image, published_at, updated_at, tech_stack')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
  const image = caseStudy.featured_image 
    ? (caseStudy.featured_image.startsWith('http') ? caseStudy.featured_image : `${siteUrl}${caseStudy.featured_image}`)
    : `${siteUrl}/og-image.png`

  return genMeta({
    title: caseStudy.title,
    description: caseStudy.description || undefined,
    type: 'article',
    image,
    publishedTime: caseStudy.published_at || undefined,
    modifiedTime: caseStudy.updated_at || caseStudy.published_at || undefined,
    tags: caseStudy.tech_stack || undefined,
  })
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const supabase = await createServerClient()

  // Fetch the case study
  const { data: caseStudy, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !caseStudy) {
    notFound()
  }

  // Increment views (fire and forget)
  supabase
    .from('case_studies')
    .update({ views: (caseStudy.views || 0) + 1 })
    .eq('id', caseStudy.id)
    .then(() => {}) // Fire and forget

  // Fetch related case studies
  let relatedCaseStudies: Array<{
    id: string
    title: string
    slug: string
    description: string | null
    featured_image: string | null
    published_at: string | null
  }> = []
  try {
    const { data } = await supabase
      .from('case_studies')
      .select('id, title, slug, description, featured_image, published_at')
      .eq('status', 'published')
      .neq('id', caseStudy.id)
      .limit(3)

    relatedCaseStudies = data || []
  } catch (error) {
    console.error('Error fetching related case studies:', error)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
  const image = caseStudy.featured_image 
    ? (caseStudy.featured_image.startsWith('http') ? caseStudy.featured_image : `${siteUrl}${caseStudy.featured_image}`)
    : undefined

  return (
    <>
      <StructuredData
        type="Article"
        title={caseStudy.title}
        description={caseStudy.description || undefined}
        url={`/case-studies/${caseStudy.slug}`}
        image={image}
        publishedTime={caseStudy.published_at || undefined}
        modifiedTime={caseStudy.updated_at || caseStudy.published_at || undefined}
        author="Mohamed Datt"
      />
      <div className="min-h-screen bg-background">
        <PageViewTracker contentType="case_study" contentId={caseStudy.id} />
        <Navigation />
        <main className="pt-20 pb-16">
          <CaseStudyContent caseStudy={caseStudy} relatedCaseStudies={relatedCaseStudies} />
        </main>
        <FooterLight />
      </div>
    </>
  )
}

