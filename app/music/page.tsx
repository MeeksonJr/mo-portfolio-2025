import { Metadata } from 'next'
import MusicHub from '@/components/music/music-hub'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import StructuredData from '@/components/structured-data'

export const metadata: Metadata = {
  title: 'Music | Library',
  description: 'Discover, play, and organize your favorite music. Browse songs and playlists in one place.',
}

import Navigation from '@/components/navigation'

export default function MusicPage() {
  return (
    <>
      <StructuredData
        type="WebSite"
        title="Music Library"
        description="Discover, play, and organize your favorite music"
        url="/music"
      />
      <div className="relative h-screen w-full overflow-hidden bg-background">
        <div className="absolute top-0 left-0 w-full z-50">
          <Navigation />
        </div>
        <div className="h-full pt-16">
          <MusicHub />
        </div>
      </div>
    </>
  )
}
