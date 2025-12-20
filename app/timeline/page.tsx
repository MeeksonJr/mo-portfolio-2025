import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import InteractiveTimeline from '@/components/timeline/interactive-timeline'
import StructuredData from '@/components/structured-data'

export const metadata: Metadata = {
  title: 'Timeline | Mohamed Datt',
  description: 'Interactive timeline of Mohamed Datt\'s journey from Guinea to NYC to Norfolk - A story of growth, learning, and building',
}

export default function TimelinePage() {
  return (
    <>
      <StructuredData
        type="Person"
        title="Mohamed Datt's Journey Timeline"
        description="Interactive timeline showing the journey from Guinea to NYC to Norfolk"
        url="/timeline"
      />
      <EnhancedPageLayout
        title="Timeline"
        description="Interactive timeline of my journey from Guinea to NYC to Norfolk - A story of growth, learning, and building."
      >
        <InteractiveTimeline />
      </EnhancedPageLayout>
    </>
  )
}

