import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import ToolsHub from '@/components/tools/tools-hub'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Tools Hub | Mohamed Datt',
  description: 'Interactive tools and utilities: AI project analyzer, skills matching, ROI calculator, assessment dashboard, contact hub, and virtual business card.',
  type: 'website',
  tags: ['tools', 'project analyzer', 'skills match', 'ROI calculator', 'assessment', 'contact hub', 'business card'],
})

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" className="pt-20" tabIndex={-1}>
        <ToolsHub />
      </main>
      <FooterLight />
    </div>
  )
}

