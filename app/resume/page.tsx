import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import ResumeHub from '@/components/resume/resume-hub'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Resume Hub | Mohamed Datt',
  description: 'View, generate, and share professional resumes. Multiple formats available including ATS-optimized, creative, and traditional formats.',
  type: 'website',
  tags: ['resume', 'CV', 'resume generator', 'candidate summary', 'Mohamed Datt', 'Full Stack Developer'],
})

export default function ResumePage() {
  return (
    <>
      <StructuredData
        type="WebSite"
        title="Resume Hub | Mohamed Datt"
        description="View, generate, and share professional resumes"
        url="/resume"
      />
      <EnhancedPageLayout
        title="Resume Hub"
        description="View, generate, and share professional resumes. Multiple formats available including ATS-optimized, creative, and traditional formats."
      >
        <ResumeHub />
      </EnhancedPageLayout>
    </>
  )
}

