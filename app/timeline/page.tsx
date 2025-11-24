import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
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
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 pb-16">
          <InteractiveTimeline />
        </main>
        <FooterLight />
      </div>
    </>
  )
}

