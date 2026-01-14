import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import GamesHub from '@/components/games/games-hub'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Games | Mohamed Datt',
  description: 'Play interactive games including Snake, Tetris, Memory, Tic-Tac-Toe, Breakout, and Word Puzzle with score tracking and leaderboards',
  type: 'website',
})

export default function GamesPage() {
  return (
    <EnhancedPageLayout
      title="Games"
      description="Play interactive games with score tracking, background music, and save functionality"
      showBreadcrumbs={true}
    >
      <GamesHub />
    </EnhancedPageLayout>
  )
}

