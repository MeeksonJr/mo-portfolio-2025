import { Metadata } from 'next'
import PortfolioCodeViewer from '@/components/portfolio-code-viewer/portfolio-code-viewer'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Portfolio Code Viewer',
  description: 'Explore the actual code behind this portfolio. Browse real production code files from the repository with syntax highlighting.',
  type: 'website',
  tags: ['code', 'portfolio', 'source code', 'developer', 'open source'],
})

export default function PortfolioCodePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PortfolioCodeViewer />
      <FooterLight />
    </div>
  )
}

