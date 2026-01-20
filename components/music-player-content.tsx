'use client'

import { useEffect } from 'react'
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react'
import { useMusic } from '@/contexts/music-context'

export default function MusicPlayerContent() {
  const {
    isPlaying,
    currentTrack,
    songs,
    progress,
    isLoading,
    audioRef,
    setIsPlaying,
    setCurrentTrack,
    handlePlayPause,
    handleNext,
    handlePrevious,
    handleProgressChange,
    loadSongs,
  } = useMusic()

  // Load songs on mount
  useEffect(() => {
    loadSongs()
  }, [loadSongs])

  const handleProgressChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleProgressChange(parseFloat(e.target.value))
  }

  // Helper to format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentTime = audioRef.current?.currentTime || 0
  const duration = audioRef.current?.duration || 0

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading songs...</div>
  }

  if (songs.length === 0) {
    return <div className="text-center text-muted-foreground">No songs available</div>
  }

  return (
    <div className="space-y-4">
      {/* Audio element is managed by MusicProvider context and persists across component unmounts */}
      
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-1">{songs[currentTrack]?.title}</h3>
        <p className="text-sm text-muted-foreground">
          Track {currentTrack + 1} of {songs.length}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="progress-slider" className="sr-only">
          Progress
        </label>
        <input
          id="progress-slider"
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChangeEvent}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          aria-label="Progress"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePrevious}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Previous track"
        >
          <SkipBack size={24} />
        </button>
        <button
          onClick={handlePlayPause}
          className="p-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Next track"
        >
          <SkipForward size={24} />
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        <p className="text-xs font-semibold text-muted-foreground">Playlist:</p>
        {songs.map((song, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentTrack(index)
              setIsPlaying(true)
              setTimeout(() => {
                audioRef.current?.play().catch(console.error)
              }, 100)
            }}
            className={`w-full text-left p-2 rounded-lg transition-colors ${
              index === currentTrack
                ? 'bg-primary/20 text-primary font-medium'
                : 'hover:bg-muted'
            }`}
          >
            {song.title}
          </button>
        ))}
      </div>
    </div>
  )
}

