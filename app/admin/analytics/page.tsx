import { Metadata } from 'next'
import ContentAnalytics from '@/components/admin/content-analytics'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'

export const metadata: Metadata = {
  title: 'Content Analytics | Admin',
  description: 'Track your content performance and engagement',
}

export default function AnalyticsPage() {
  return (
    <EnhancedPageLayout
      title="Content Analytics"
      description="Track your content performance, engagement, and insights"
      showBreadcrumbs={true}
    >
      <ContentAnalytics />
    </EnhancedPageLayout>
  )
}
