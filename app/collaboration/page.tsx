import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import TeamCollaborationProof from '@/components/collaboration/team-collaboration-proof'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Team Collaboration | Mohamed Datt',
  description: 'Showcasing teamwork, code reviews, and collaborative development through GitHub contributions, team projects, and open source work.',
  type: 'website',
  tags: ['collaboration', 'teamwork', 'github', 'code reviews', 'open source'],
})

export default function CollaborationPage() {
  return (
    <>
      <StructuredData
        type="WebSite"
        title="Team Collaboration | Mohamed Datt"
        description="Showcasing teamwork, code reviews, and collaborative development"
        url="/collaboration"
      />
      <EnhancedPageLayout
        title="Team Collaboration"
        description="Showcasing teamwork, code reviews, and collaborative development through GitHub contributions, team projects, and open source work."
      >
        <TeamCollaborationProof />
      </EnhancedPageLayout>
    </>
  )
}

