import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import UsesPageContent from '@/components/uses/uses-page-content'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Uses',
  description: 'My hardware setup, software stack, development tools, browser extensions, keyboard shortcuts, and desk setup. Everything I use to build and create.',
  type: 'website',
  tags: ['uses', 'setup', 'tools', 'hardware', 'software', 'development'],
})

export default function UsesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <UsesPageContent />
      <FooterLight />
    </div>
  )
}

