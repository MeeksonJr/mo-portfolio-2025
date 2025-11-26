import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import PersonalDashboard from '@/components/dashboard/personal-dashboard'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Personal Dashboard',
  description: 'Your personal dashboard showing portfolio exploration stats, bookmarks, reading list, and achievements.',
  type: 'website',
  tags: ['dashboard', 'bookmarks', 'reading list', 'achievements'],
})

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" className="pt-20 pb-16" tabIndex={-1}>
        <PersonalDashboard />
      </main>
      <FooterLight />
    </div>
  )
}

