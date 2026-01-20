'use client'

import { useEffect, useState } from 'react'
import { Music, Play, Pause } from 'lucide-react'
import Link from 'next/link'
import { MusicProvider, useMusic } from '@/contexts/music-context'

function MusicWidgetContent() {
  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { isPlaying, handlePlayPause, currentTrack, songs: contextSongs, setCurrentTrack } = useMusic()

  useEffect(() => {
    fetchSongs()
    const interval = setInterval(fetchSongs, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (contextSongs.length > 0) {
      setSongs(contextSongs)
    }
  }, [contextSongs])

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/widgets/data?type=music-player&limit=10')
      const data = await response.json()
      if (data.success && data.widgets?.musicPlayer) {
        setSongs(data.widgets.musicPlayer)
      }
    } catch (error) {
      console.error('Error fetching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSongClick = (index: number) => {
    setCurrentTrack(index)
    if (!isPlaying) {
      handlePlayPause()
    }
  }

  if (loading && songs.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Music className="h-8 w-8 animate-pulse mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Music className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Music Player</h1>
        </div>

        {/* Current Track */}
        {songs.length > 0 && (
          <div className="mb-6 p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={handlePlayPause}
                className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-semibold line-clamp-1">
                  {songs[currentTrack]?.title || 'No song selected'}
                </p>
                {songs[currentTrack]?.artist && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {songs[currentTrack].artist}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Track {currentTrack + 1} of {songs.length}
            </p>
          </div>
        )}
        
        {/* Song List */}
        <div className="space-y-2">
          {songs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No songs available</p>
            </div>
          ) : (
            songs.map((song, index) => (
              <button
                key={song.id || index}
                onClick={() => handleSongClick(index)}
                className={`w-full p-4 rounded-lg border text-left transition-colors ${
                  index === currentTrack
                    ? 'bg-primary/10 border-primary'
                    : 'bg-card hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {index === currentTrack && isPlaying && (
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">{song.title || 'Unknown Song'}</p>
                    {song.artist && (
                      <p className="text-sm text-muted-foreground line-clamp-1">{song.artist}</p>
                    )}
                    {song.album && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{song.album}</p>
                    )}
                  </div>
                  {index === currentTrack && (
                    <Music className="h-4 w-4 text-primary" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        <Link
          href="/music"
          className="block mt-6 text-center text-primary hover:underline font-medium"
        >
          Open Full Music Player →
        </Link>
      </div>
    </div>
  )
}

export default function MusicWidget() {
  return (
    <MusicProvider>
      <MusicWidgetContent />
    </MusicProvider>
  )
}

