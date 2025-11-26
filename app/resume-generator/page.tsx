import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import ResumeGenerator from '@/components/resume/resume-generator'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Resume Generator',
  description: 'Create your professional resume using our customizable templates. Generate PDF resumes with step-by-step guidance.',
  type: 'website',
  tags: ['resume', 'cv', 'generator', 'pdf', 'career'],
})

export default function ResumeGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" className="pt-20 pb-16" tabIndex={-1}>
        <ResumeGenerator />
      </main>
      <FooterLight />
    </div>
  )
}

