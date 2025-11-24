import { Metadata } from 'next'
import InteractiveProjectTimeline from '@/components/projects/project-timeline'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Project Timeline | Mohamed Datt',
  description: 'Visual timeline of all projects in chronological order. Filter by technology, type, and explore project journey with animated transitions.',
  type: 'website',
  tags: ['projects', 'timeline', 'portfolio', 'Mohamed Datt'],
})

export default async function ProjectTimelinePage() {
  return <InteractiveProjectTimeline />
}

