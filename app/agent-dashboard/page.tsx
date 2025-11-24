import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import AgentDashboardContent from '@/components/agent-dashboard/agent-dashboard-content'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Agent Dashboard | Mohamed Datt',
  description: 'Special dashboard for recruiters and headhunters. Candidate overview, skills matrix, availability calendar, and contact management.',
  type: 'website',
  tags: ['dashboard', 'recruiter', 'agent', 'candidate management', 'hiring'],
})

export default function AgentDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AgentDashboardContent />
      <FooterLight />
    </div>
  )
}

