import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import InsightsHub from '@/components/insights/insights-hub'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Insights Hub | Mohamed Datt',
  description: 'Explore portfolio analytics, activity feeds, personalized recommendations, project timelines, and skill visualizations.',
  type: 'website',
  tags: ['analytics', 'insights', 'activity', 'recommendations', 'timeline', 'skills', 'data visualization'],
})

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" className="pt-20" tabIndex={-1}>
        <InsightsHub />
      </main>
      <FooterLight />
    </div>
  )
}

