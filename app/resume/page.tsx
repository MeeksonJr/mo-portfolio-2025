import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import ResumeHub from '@/components/resume/resume-hub'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Resume Hub | Mohamed Datt',
  description: 'View, generate, and share professional resumes. Multiple formats available including ATS-optimized, creative, and traditional formats.',
  type: 'website',
  tags: ['resume', 'CV', 'resume generator', 'candidate summary', 'Mohamed Datt', 'Full Stack Developer'],
})

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" className="pt-20" tabIndex={-1}>
        <ResumeHub />
      </main>
      <FooterLight />
    </div>
  )
}

