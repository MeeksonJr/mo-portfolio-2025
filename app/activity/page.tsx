import { Metadata } from 'next'
import LiveActivityFeed from '@/components/activity/live-activity-feed'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Activity Feed | Mohamed Datt',
  description: 'Real-time feed of GitHub activity, blog posts, and project updates. Stay updated with the latest developments and contributions.',
  type: 'website',
  tags: ['activity', 'github', 'updates', 'feed', 'Mohamed Datt'],
})

export default function ActivityPage() {
  return <LiveActivityFeed />
}

