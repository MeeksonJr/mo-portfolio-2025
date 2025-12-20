import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import LiveProjectShowcase from '@/components/demos/live-project-showcase'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Live Project Demos | Mohamed Datt',
  description: 'See Mohamed Datt\'s projects in action. Interactive live demos of real working applications.',
  type: 'website',
  tags: ['demos', 'projects', 'live', 'showcase', 'Mohamed Datt'],
})

export default function DemosPage() {
  return (
    <>
      <StructuredData
        type="WebSite"
        title="Live Project Demos | Mohamed Datt"
        description="See projects in action. Interactive live demos of real working applications"
        url="/demos"
      />
      <EnhancedPageLayout
        title="Live Project Demos"
        description="See my projects in action. Interactive live demos of real working applications."
      >
        <LiveProjectShowcase />
      </EnhancedPageLayout>
    </>
  )
}

