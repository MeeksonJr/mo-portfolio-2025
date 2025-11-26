import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import ActivityStatusIndicator from '@/components/activity/activity-status-indicator'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Activity Status',
  description: 'Show your current activity and availability status. Update your status and share it with others.',
  type: 'website',
  tags: ['activity', 'status', 'availability', 'presence'],
})

export default function ActivityStatusPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" className="pt-20 pb-16" tabIndex={-1}>
        <ActivityStatusIndicator />
      </main>
      <FooterLight />
    </div>
  )
}

