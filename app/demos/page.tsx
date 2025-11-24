import { Metadata } from 'next'
import LiveProjectShowcase from '@/components/demos/live-project-showcase'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Live Project Demos | Mohamed Datt',
  description: 'See Mohamed Datt\'s projects in action. Interactive live demos of real working applications.',
  type: 'website',
  tags: ['demos', 'projects', 'live', 'showcase', 'Mohamed Datt'],
})

export default function DemosPage() {
  return <LiveProjectShowcase />
}

