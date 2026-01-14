import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import { generateMetadata as genMeta } from '@/lib/seo'
import { generateMetaDescription } from '@/lib/seo-descriptions'
import RecruiterDashboard from '@/components/recruiters/recruiter-dashboard'

export const metadata: Metadata = genMeta({
  title: 'For Recruiters | Mohamed Datt',
  description: generateMetaDescription('default'),
  type: 'website',
})

export default function ForRecruitersPage() {
  return (
    <EnhancedPageLayout
      title="For Recruiters"
      description="Quick access to resume, skills matching, candidate summary, and contact information"
      showBreadcrumbs={true}
    >
      <RecruiterDashboard />
    </EnhancedPageLayout>
  )
}

