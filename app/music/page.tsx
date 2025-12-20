import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import MusicPlayerPage from '@/components/music-player-page'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = genMeta({
  title: 'Music',
  description: 'Browse and play music from Mohamed Datt\'s collection. Discover new tracks, search by artist or genre, and enjoy a Spotify-like music experience.',
  type: 'website',
})

export default function MusicPage() {
  return (
    <>
      <StructuredData
        type="WebSite"
        title="Music"
        description="Browse and play music collection"
        url="/music"
      />
      <EnhancedPageLayout
        title="Music"
        description="Browse and play music from my collection. Discover new tracks, search by artist or genre, and enjoy a Spotify-like music experience."
      >
        <MusicPlayerPage />
      </EnhancedPageLayout>
    </>
  )
}

