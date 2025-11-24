import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import CandidateSummaryContent from '@/components/candidate-summary/candidate-summary-content'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Candidate Summary | Mohamed Datt',
  description: 'Quick candidate summary for recruiters and agents. Key skills, availability, location, work preferences, and contact information at a glance.',
  type: 'website',
  tags: ['candidate', 'summary', 'recruiter', 'agent', 'hiring'],
})

export default function CandidateSummaryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CandidateSummaryContent />
      <FooterLight />
    </div>
  )
}

