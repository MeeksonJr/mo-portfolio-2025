import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import ProgressIndicators from '@/components/progress/progress-indicators'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Progress Indicators',
  description: 'Visual progress tracking components for multi-step processes, goals, and achievements.',
  type: 'website',
  tags: ['progress', 'indicators', 'tracking', 'ui', 'components'],
})

export default function ProgressIndicatorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" className="pt-20 pb-16" tabIndex={-1}>
        <ProgressIndicators />
      </main>
      <FooterLight />
    </div>
  )
}

