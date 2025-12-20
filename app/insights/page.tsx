import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import InsightsHub from '@/components/insights/insights-hub'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Insights Hub | Mohamed Datt',
  description: 'Explore portfolio analytics, activity feeds, personalized recommendations, project timelines, and skill visualizations.',
  type: 'website',
  tags: ['analytics', 'insights', 'activity', 'recommendations', 'timeline', 'skills', 'data visualization'],
})

export default function InsightsPage() {
  return (
    <>
      <StructuredData
        type="WebSite"
        title="Insights Hub | Mohamed Datt"
        description="Explore portfolio analytics, activity feeds, and personalized recommendations"
        url="/insights"
      />
      <EnhancedPageLayout
        title="Insights Hub"
        description="Explore portfolio analytics, activity feeds, personalized recommendations, project timelines, and skill visualizations."
      >
        <InsightsHub />
      </EnhancedPageLayout>
    </>
  )
}

