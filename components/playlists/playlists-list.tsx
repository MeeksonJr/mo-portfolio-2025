'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Music, Play, Lock } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Playlist {
  id: string
  name: string
  description: string | null
  cover_image_url: string | null
  is_public: boolean
  created_at: string
  song_count?: number
}

export default function PlaylistsList() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPlaylists()
  }, [])

  const loadPlaylists = async () => {
    try {
      const response = await fetch('/api/playlists')
      if (!response.ok) throw new Error('Failed to load playlists')

      const data = await response.json()
      setPlaylists(data.playlists || [])
    } catch (error) {
      console.error('Error loading playlists:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading playlists...</p>
      </div>
    )
  }

  if (playlists.length === 0) {
    return (
      <div className="text-center py-12">
        <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No playlists yet</h3>
        <p className="text-muted-foreground">Check back later for curated playlists!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {playlists.map((playlist) => (
        <Link key={playlist.id} href={`/playlists/${playlist.id}`}>
          <Card className="group hover:shadow-lg transition-shadow cursor-pointer bg-background/95 backdrop-blur-sm border-border/50">
            <CardContent className="p-0">
              <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg overflow-hidden">
                {playlist.cover_image_url ? (
                  <img
                    src={playlist.cover_image_url}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="h-16 w-16 text-primary/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="lg" variant="secondary" className="rounded-full">
                      <Play className="h-5 w-5 mr-2" />
                      Play
                    </Button>
                  </div>
                </div>
                {!playlist.is_public && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{playlist.name}</h3>
                {playlist.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {playlist.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{playlist.song_count || 0} songs</span>
                  <span>{formatDistanceToNow(new Date(playlist.created_at), { addSuffix: true })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

