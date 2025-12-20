import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import AgentDashboardContent from '@/components/agent-dashboard/agent-dashboard-content'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Agent Dashboard | Mohamed Datt',
  description: 'Special dashboard for recruiters and headhunters. Candidate overview, skills matrix, availability calendar, and contact management.',
  type: 'website',
  tags: ['dashboard', 'recruiter', 'agent', 'candidate management', 'hiring'],
})

export default function AgentDashboardPage() {
  return (
    <>
      <StructuredData
        type="WebSite"
        title="Agent Dashboard | Mohamed Datt"
        description="Special dashboard for recruiters and headhunters"
        url="/agent-dashboard"
      />
      <EnhancedPageLayout
        title="Agent Dashboard"
        description="Special dashboard for recruiters and headhunters. Candidate overview, skills matrix, availability calendar, and contact management."
        className="bg-muted/30"
      >
        <AgentDashboardContent />
      </EnhancedPageLayout>
    </>
  )
}

