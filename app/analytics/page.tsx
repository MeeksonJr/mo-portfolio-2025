import { Metadata } from 'next'
import PublicAnalyticsDashboard from '@/components/analytics/public-analytics-dashboard'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Portfolio Analytics | Mohamed Datt',
  description: 'View portfolio statistics, popular content, and engagement metrics. See what content resonates most with visitors.',
  type: 'website',
  tags: ['analytics', 'statistics', 'portfolio metrics', 'Mohamed Datt'],
})

export default function AnalyticsPage() {
  return <PublicAnalyticsDashboard />
}

