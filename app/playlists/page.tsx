import { redirect } from 'next/navigation'

// Redirect old playlists page to unified music page
export default function PlaylistsPage() {
  redirect('/music?tab=playlists')
}
