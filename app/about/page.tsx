import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import AboutPageContent from '@/components/about-page-content'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = genMeta({
  title: 'About',
  description: 'Learn about Mohamed Datt - Full Stack Developer. Journey from Guinea to NYC to Norfolk, Virginia. Story of resilience, learning, and building AI-powered applications.',
  type: 'profile',
  tags: ['about', 'developer', 'story', 'journey', 'portfolio'],
})

export default function AboutPage() {
  return (
    <>
      <StructuredData
        type="Person"
        title="About Mohamed Datt"
        description="Full Stack Developer specializing in AI-powered web applications. Journey from Guinea to NYC to Norfolk, Virginia."
        url="/about"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content" role="main" className="pt-20 pb-16" tabIndex={-1}>
          <AboutPageContent />
        </main>
        <FooterLight />
      </div>
    </>
  )
}

