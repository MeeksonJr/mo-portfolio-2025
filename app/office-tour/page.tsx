import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import VirtualOfficeTour from '@/components/office/virtual-office-tour'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Virtual Office Tour',
  description: 'Explore my workspace setup, development environment, and equipment. Interactive tour of my office space.',
  type: 'website',
  tags: ['office', 'workspace', 'setup', 'equipment', 'tour'],
})

export default function OfficeTourPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" className="pt-20 pb-16" tabIndex={-1}>
        <VirtualOfficeTour />
      </main>
      <FooterLight />
    </div>
  )
}

