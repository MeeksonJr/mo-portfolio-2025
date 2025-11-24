import { Metadata } from 'next'
import TeamCollaborationProof from '@/components/collaboration/team-collaboration-proof'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
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
      <div className="min-h-screen bg-background">
        <Navigation />
        <TeamCollaborationProof />
        <FooterLight />
      </div>
    </>
  )
}

