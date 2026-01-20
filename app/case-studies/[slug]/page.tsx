import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import CaseStudyContent from '@/components/case-study-content'
import StructuredData from '@/components/structured-data'
import ArticleSchema from '@/components/structured-data/article-schema'
import BreadcrumbSchema from '@/components/structured-data/breadcrumb-schema'
import PageViewTracker from '@/components/page-view-tracker'
import AchievementTrackerClient from '@/components/achievement-tracker-client'
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

  // Increment views using admin client to bypass RLS (fire and forget)
  try {
    const adminClient = createAdminClient()
    Promise.resolve(
      adminClient
        .from('case_studies')
        .update({ views: (caseStudy.views || 0) + 1 })
        .eq('id', caseStudy.id)
    )
      .then(() => {
        // Success - fire and forget
      })
      .catch((error: any) => {
        console.error('Error incrementing views:', error)
      })
  } catch (error: any) {
    console.error('Error creating admin client for view increment:', error)
  }

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
      <ArticleSchema
        title={caseStudy.title}
        description={caseStudy.description}
        url={`/case-studies/${caseStudy.slug}`}
        image={image}
        publishedTime={caseStudy.published_at}
        modifiedTime={caseStudy.updated_at || caseStudy.published_at}
        author="Mohamed Datt"
        tags={caseStudy.tech_stack}
        category="Case Study"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Case Studies', url: '/case-studies' },
          { name: caseStudy.title, url: `/case-studies/${caseStudy.slug}` },
        ]}
      />
      <div className="min-h-screen bg-background">
          <PageViewTracker contentType="case_study" contentId={caseStudy.id} />
          <AchievementTrackerClient achievementId="read-case-study" />
        <Navigation />
        <main id="main-content" role="main" className="pt-20 pb-16" tabIndex={-1}>
          <CaseStudyContent caseStudy={caseStudy} relatedCaseStudies={relatedCaseStudies} />
        </main>
        <FooterLight />
      </div>
    </>
  )
}

