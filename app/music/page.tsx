import { Metadata } from 'next'
import MusicHub from '@/components/music/music-hub'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import StructuredData from '@/components/structured-data'

export const metadata: Metadata = {
  title: 'Music | Library',
  description: 'Discover, play, and organize your favorite music. Browse songs and playlists in one place.',
}

export default function MusicPage() {
  return (
    <>
      <StructuredData
        type="WebSite"
        title="Music Library"
        description="Discover, play, and organize your favorite music"
        url="/music"
      />
      <EnhancedPageLayout showBreadcrumbs={false}>
        <MusicHub />
      </EnhancedPageLayout>
    </>
  )
}
