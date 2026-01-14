import { Metadata } from 'next'
import GamesHub from '@/components/games/games-hub'

export const metadata: Metadata = {
  title: 'Games',
  description: 'Play interactive games with score tracking, background music, and save functionality',
}

export default function GamesPage() {
  return <GamesHub />
}

