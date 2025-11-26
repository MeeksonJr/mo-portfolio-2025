import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import AboutHub from '@/components/about/about-hub'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = genMeta({
  title: 'About Hub | Mohamed Datt',
  description: 'Learn about my journey, setup, workspace, activity, progress, learning paths, and personal dashboard. Full Stack Developer from Guinea to NYC to Norfolk, Virginia.',
  type: 'profile',
  tags: ['about', 'developer', 'story', 'journey', 'portfolio', 'setup', 'workspace', 'dashboard'],
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
        <main id="main-content" role="main" className="pt-20" tabIndex={-1}>
          <AboutHub />
        </main>
        <FooterLight />
      </div>
    </>
  )
}

