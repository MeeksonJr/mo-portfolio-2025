import { Metadata } from 'next'
import MusicHub from '@/components/music/music-hub'

export const metadata: Metadata = {
  title: 'Music | Library',
  description: 'Discover, play, and organize your favorite music. Browse songs and playlists in one place.',
}

export default function MusicPage() {
  return <MusicHub />
}
