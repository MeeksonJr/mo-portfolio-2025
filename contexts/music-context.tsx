'use client'

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react'

interface MusicContextType {
  isPlaying: boolean
  currentTrack: number
  songs: Array<{ title: string; file: string }>
  progress: number
  isLoading: boolean
  setIsPlaying: (playing: boolean) => void
  setCurrentTrack: (track: number) => void
  setSongs: (songs: Array<{ title: string; file: string }>) => void
  setProgress: (progress: number) => void
  setIsLoading: (loading: boolean) => void
  audioRef: React.RefObject<HTMLAudioElement | null>
  handlePlayPause: () => void
  handleNext: () => void
  handlePrevious: () => void
  handleProgressChange: (progress: number) => void
  loadSongs: () => Promise<void>
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const [songs, setSongs] = useState<Array<{ title: string; file: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Create audio element outside component to persist across unmounts
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      const audio = document.createElement('audio')
      audio.preload = 'auto'
      document.body.appendChild(audio)
      audioRef.current = audio

      // Cleanup on unmount
      return () => {
        if (audio && audio.parentNode) {
          audio.pause()
          audio.parentNode.removeChild(audio)
        }
        audioRef.current = null
      }
    }
  }, [])

  // Load songs
  const loadSongs = async () => {
    try {
      const { getProxyAudioUrl } = await import('@/lib/music-helpers')
      const response = await fetch('/api/music/songs')
      const data = await response.json()
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

  // Update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || songs.length === 0) return

    const currentSong = songs[currentTrack]
    if (currentSong?.file) {
      audio.src = currentSong.file
      if (isPlaying) {
        audio.play().catch(console.error)
      }
    }
  }, [currentTrack, songs, isPlaying])

  // Update progress
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
      audio.play().catch(console.error)
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

  const handleProgressChange = (newProgress: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = (newProgress / 100) * audio.duration
    setProgress(newProgress)
  }

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrack,
        songs,
        progress,
        isLoading,
        setIsPlaying,
        setCurrentTrack,
        setSongs,
        setProgress,
        setIsLoading,
        audioRef,
        handlePlayPause,
        handleNext,
        handlePrevious,
        handleProgressChange,
        loadSongs,
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider')
  }
  return context
}

