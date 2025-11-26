import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import LiveCodingTerminal from '@/components/terminal/live-coding-terminal'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Live Coding Terminal',
  description: 'Explore real code snippets from the portfolio with syntax highlighting and live preview. Interactive code terminal.',
  type: 'website',
  tags: ['code', 'terminal', 'snippets', 'programming', 'development'],
})

export default function LiveCodingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" className="pt-20 pb-16" tabIndex={-1}>
        <LiveCodingTerminal />
      </main>
      <FooterLight />
    </div>
  )
}

