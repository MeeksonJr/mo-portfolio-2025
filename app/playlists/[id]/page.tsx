import { Metadata } from 'next'
import PlaylistDetail from '@/components/playlists/playlist-detail'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/playlists/${id}`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      return {
        title: 'Playlist Not Found',
      }
    }
    
    const data = await response.json()
    const playlist = data.playlist
    
    return {
      title: `${playlist.name} | Playlist`,
      description: playlist.description || `Listen to ${playlist.name}`,
    }
  } catch {
    return {
      title: 'Playlist',
    }
  }
}

export default async function PlaylistPage({ params }: PageProps) {
  const { id } = await params
  
  return <PlaylistDetail playlistId={id} />
}

