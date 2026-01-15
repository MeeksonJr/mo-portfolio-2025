import { Metadata } from 'next'
import PlaylistsManager from '@/components/admin/playlists-manager'

export const metadata: Metadata = {
  title: 'Playlists Management | Admin',
  description: 'Manage music playlists',
}

export default function AdminPlaylistsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PlaylistsManager />
    </div>
  )
}

