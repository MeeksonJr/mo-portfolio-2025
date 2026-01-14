import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import InteractiveResume from '@/components/resume/interactive-resume'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Interactive Resume | Mohamed Datt',
  description: 'Interactive resume with expandable sections, timeline view, and detailed project information',
  type: 'website',
})

export default function InteractiveResumePage() {
  return (
    <EnhancedPageLayout
      title="Interactive Resume"
      description="Explore my experience, education, and projects in an interactive timeline format"
      showBreadcrumbs={true}
    >
      <InteractiveResume />
    </EnhancedPageLayout>
  )
}

