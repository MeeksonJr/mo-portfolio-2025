import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import AchievementsPage from '@/components/achievements/achievements-page'
import StructuredData from '@/components/structured-data'

export const metadata: Metadata = {
  title: 'Achievements | Mohamed Datt',
  description: 'View your unlocked achievements and track your progress exploring the portfolio',
}

export default function Page() {
  return (
    <>
      <StructuredData
        type="WebSite"
        title="Achievements | Mohamed Datt"
        description="View unlocked achievements and track progress exploring the portfolio"
        url="/achievements"
      />
      <EnhancedPageLayout
        title="Achievements"
        description="View your unlocked achievements and track your progress exploring the portfolio."
      >
        <AchievementsPage />
      </EnhancedPageLayout>
    </>
  )
}

