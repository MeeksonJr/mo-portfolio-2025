import { Metadata } from 'next'
import QuickAssessmentDashboard from '@/components/assessment/quick-assessment-dashboard'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Quick Assessment | Mohamed Datt',
  description: 'Quick assessment dashboard for recruiters. View skills, experience, and availability at a glance.',
  type: 'website',
  tags: ['assessment', 'recruiter', 'Mohamed Datt', 'skills'],
})

export default function AssessmentPage() {
  return <QuickAssessmentDashboard />
}

