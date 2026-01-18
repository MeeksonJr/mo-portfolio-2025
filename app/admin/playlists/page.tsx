import { Metadata } from 'next'
import PlaylistsManager from '@/components/admin/playlists-manager'
import PageContainer from '@/components/layout/page-container'

export const metadata: Metadata = {
  title: 'Playlists Management | Admin',
  description: 'Manage music playlists',
}

export default function AdminPlaylistsPage() {
  return (
    <PageContainer width="wide" padding="default">
      <div className="py-8">
        <PlaylistsManager />
      </div>
    </PageContainer>
  )
}

