import { Metadata } from 'next'
import AchievementsPage from '@/components/achievements/achievements-page'

export const metadata: Metadata = {
  title: 'Achievements | Mohamed Datt',
  description: 'View your unlocked achievements and track your progress exploring the portfolio',
}

export default function Page() {
  return <AchievementsPage />
}

