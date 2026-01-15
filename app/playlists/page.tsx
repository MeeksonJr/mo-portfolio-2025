import { Metadata } from 'next'
import PlaylistsList from '@/components/playlists/playlists-list'

export const metadata: Metadata = {
  title: 'Playlists | Music',
  description: 'Browse curated music playlists',
}

export default function PlaylistsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Playlists</h1>
        <p className="text-muted-foreground">
          Discover curated music collections
        </p>
      </div>
      <PlaylistsList />
    </div>
  )
}

