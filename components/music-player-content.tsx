'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react'
import { getProxyAudioUrl } from '@/lib/music-helpers'

interface Song {
  title: string
  file: string
}

export default function MusicPlayerContent() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Load songs dynamically from API
  useEffect(() => {
    const loadSongs = async () => {
      try {
        const response = await fetch('/api/music/songs')
        const data = await response.json()
        // Transform API response to match component format
        const transformedSongs = (data.songs || []).map((song: any) => ({
          title: song.title,
          file: getProxyAudioUrl(song.file_url) || song.file_url,
        }))
        setSongs(transformedSongs)
      } catch (error) {
        console.error('Failed to load songs:', error)
        setSongs([])
      } finally {
        setIsLoading(false)
      }
    }

    loadSongs()
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      const value = (audio.currentTime / audio.duration) * 100
      setProgress(isNaN(value) ? 0 : value)
    }

    const handleEnded = () => {
      if (songs.length > 0) {
        setCurrentTrack((prev) => (prev + 1) % songs.length)
        setIsPlaying(true)
        setTimeout(() => {
          audioRef.current?.play()
        }, 100)
      }
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentTrack, songs.length])

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % songs.length)
    setIsPlaying(true)
    setTimeout(() => {
      audioRef.current?.play()
    }, 100)
  }

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + songs.length) % songs.length)
    setIsPlaying(true)
    setTimeout(() => {
      audioRef.current?.play()
    }, 100)
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newProgress = parseFloat(e.target.value)
    audio.currentTime = (newProgress / 100) * audio.duration
    setProgress(newProgress)
  }

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading songs...</div>
  }

  if (songs.length === 0) {
    return <div className="text-center text-muted-foreground">No songs available</div>
  }

  return (
    <div className="space-y-4">
      <audio 
        ref={audioRef} 
        src={songs[currentTrack]?.file || undefined} 
        preload="auto"
        onError={(e) => {
          console.error('Audio loading error:', e)
          console.error('Failed to load:', songs[currentTrack]?.file)
        }}
      />
      
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
          onChange={handleProgressChange}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          aria-label="Progress"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {audioRef.current
              ? `${Math.floor(audioRef.current.currentTime || 0)}s`
              : '0s'}
          </span>
          <span>
            {audioRef.current && audioRef.current.duration
              ? `${Math.floor(audioRef.current.duration)}s`
              : '--'}
          </span>
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
                audioRef.current?.play()
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

