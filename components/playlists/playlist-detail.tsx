'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Music, Play, Lock, ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { getProxyAudioUrl } from '@/lib/music-helpers'
import { toast } from 'sonner'

interface Playlist {
  id: string
  name: string
  description: string | null
  cover_image_url: string | null
  is_public: boolean
  created_at: string
  songs: Array<{
    id: string
    title: string
    artist: string | null
    album: string | null
    duration: number | null
    file_url: string
    position: number
  }>
  song_count: number
}

interface PlaylistDetailProps {
  playlistId: string
}

export default function PlaylistDetail({ playlistId }: PlaylistDetailProps) {
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPlaylist()
  }, [playlistId])

  const loadPlaylist = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/playlists/${playlistId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Playlist not found')
        } else {
          setError('Failed to load playlist')
        }
        return
      }

      const data = await response.json()
      setPlaylist(data.playlist)
    } catch (err) {
      console.error('Error loading playlist:', err)
      setError('Failed to load playlist')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPlaylist = () => {
    if (!playlist || playlist.songs.length === 0) {
      toast.error('No songs in this playlist')
      return
    }
    
    // Store playlist in localStorage for music player
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentPlaylist', JSON.stringify({
        id: playlist.id,
        name: playlist.name,
        songs: playlist.songs.map(song => ({
          title: song.title,
          file: getProxyAudioUrl(song.file_url) || song.file_url,
        })),
      }))
      
      // Navigate to music page with playlist loaded
      window.location.href = '/music?tab=songs'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading playlist...</p>
        </div>
      </div>
    )
  }

  if (error || !playlist) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {error || 'Playlist not found'}
          </h3>
          <Link href="/playlists">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Playlists
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/playlists">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Playlists
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Playlist Cover */}
        <div className="lg:col-span-1">
          <Card className="bg-background/95 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden">
                {playlist.cover_image_url ? (
                  <img
                    src={playlist.cover_image_url}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="h-24 w-24 text-primary/30" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Playlist Info */}
        <div className="lg:col-span-3">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {!playlist.is_public && (
                  <Badge variant="secondary">
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
              {playlist.description && (
                <p className="text-muted-foreground text-lg mb-4">
                  {playlist.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{playlist.song_count} songs</span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(playlist.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
            <Button onClick={handlePlayPlaylist} size="lg" disabled={playlist.songs.length === 0}>
              <Play className="h-5 w-5 mr-2" />
              Play Playlist
            </Button>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <Card className="bg-background/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Songs</h2>
          {playlist.songs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No songs in this playlist yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {playlist.songs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                >
                  <div className="w-8 text-center text-muted-foreground text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{song.title}</p>
                    {song.artist && (
                      <p className="text-sm text-muted-foreground truncate">
                        {song.artist}
                        {song.album && ` • ${song.album}`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(song.duration)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

