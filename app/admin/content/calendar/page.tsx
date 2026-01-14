import { Metadata } from 'next'
import ContentCalendar from '@/components/admin/content-calendar'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'

export const metadata: Metadata = {
  title: 'Content Calendar | Admin',
  description: 'Plan and schedule your content',
}

export default function ContentCalendarPage() {
  return (
    <EnhancedPageLayout
      title="Content Calendar"
      description="Plan and schedule your content across all types"
      showBreadcrumbs={true}
    >
      <ContentCalendar />
    </EnhancedPageLayout>
  )
}

