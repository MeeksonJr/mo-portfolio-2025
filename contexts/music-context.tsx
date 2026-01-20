'use client'

import { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from 'react'

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
  const [isLoading, setIsLoading] = useState(false) // Start as false, only set true when actively loading
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

  // Track if songs are currently being loaded to prevent concurrent calls
  const isLoadingRef = useRef(false)

  // Load songs - memoized to prevent infinite loops
  const loadSongs = useCallback(async () => {
    // Prevent multiple simultaneous loads
    if (isLoadingRef.current) {
      console.log('Songs are already loading, skipping...')
      return
    }

    // If songs are already loaded, don't reload unless forced
    if (songs.length > 0) {
      console.log('Songs already loaded, skipping...')
      return
    }

    try {
      isLoadingRef.current = true
      setIsLoading(true)
      console.log('Starting to load songs from API...')
      
      const { getProxyAudioUrl } = await import('@/lib/music-helpers')
      const response = await fetch('/api/music/songs')
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`Failed to fetch songs: ${response.status} - ${errorText}`)
      }
      
      const data = await response.json()
      console.log('Received songs data:', { songCount: data.songs?.length, hasSongs: !!data.songs })
      
      if (!data.songs || !Array.isArray(data.songs)) {
        console.error('Invalid songs data structure:', data)
        setSongs([])
        return
      }
      
      const transformedSongs = data.songs
        .filter((song: any) => {
          const hasFile = !!(song.file_url || song.file_path)
          if (!hasFile) {
            console.warn('Song missing file URL:', song.title || song.id)
          }
          return hasFile
        })
        .map((song: any) => ({
          title: song.title && song.artist 
            ? `${song.title} - ${song.artist}`
            : song.title || song.artist || 'Unknown Song',
          file: getProxyAudioUrl(song.file_url || song.file_path) || song.file_url || song.file_path,
        }))
      
      console.log(`Loaded ${transformedSongs.length} songs`)
      
      if (transformedSongs.length === 0) {
        console.warn('No songs with valid file URLs found after filtering')
      }
      
      setSongs(transformedSongs)
    } catch (error) {
      console.error('Failed to load songs:', error)
      setSongs([])
      // Don't throw - just log the error and show empty state
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
    }
  }, [songs.length]) // Depend on songs.length to allow retry when songs are empty

  // Update audio source when track changes (but not when isPlaying changes)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || songs.length === 0) return

    const currentSong = songs[currentTrack]
    if (currentSong?.file && audio.src !== currentSong.file) {
      // Only change source if it's different
      const wasPlaying = !audio.paused
      audio.src = currentSong.file
      audio.load() // Reload the audio element
      
      // Resume playing if it was playing before
      if (wasPlaying || isPlaying) {
        audio.play().catch(console.error)
      }
    }
  }, [currentTrack, songs]) // Removed isPlaying from deps

  // Sync audio playback state with isPlaying
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || songs.length === 0) return

    if (isPlaying && audio.paused) {
      audio.play().catch(console.error)
    } else if (!isPlaying && !audio.paused) {
      audio.pause()
    }
  }, [isPlaying, songs.length])

  // Update progress and handle track end
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (audio.duration) {
        const value = (audio.currentTime / audio.duration) * 100
        setProgress(isNaN(value) ? 0 : value)
      }
    }

    const handleEnded = () => {
      if (songs.length > 0) {
        const nextTrack = (currentTrack + 1) % songs.length
        setCurrentTrack(nextTrack)
        setIsPlaying(true)
      }
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [currentTrack, songs.length])

  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current
    if (!audio || songs.length === 0) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      // If no source is set, set it first
      if (!audio.src && songs[currentTrack]?.file) {
        audio.src = songs[currentTrack].file
        audio.load()
      }
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error('Play error:', error)
          setIsPlaying(false)
        })
    }
  }, [isPlaying, songs, currentTrack])

  const handleNext = useCallback(() => {
    if (songs.length === 0) return
    const nextTrack = (currentTrack + 1) % songs.length
    setCurrentTrack(nextTrack)
    setIsPlaying(true)
    // Audio will auto-play when source changes in useEffect
  }, [currentTrack, songs.length])

  const handlePrevious = useCallback(() => {
    if (songs.length === 0) return
    const prevTrack = (currentTrack - 1 + songs.length) % songs.length
    setCurrentTrack(prevTrack)
    setIsPlaying(true)
    // Audio will auto-play when source changes in useEffect
  }, [currentTrack, songs.length])

  const handleProgressChange = useCallback((newProgress: number) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return

    audio.currentTime = (newProgress / 100) * audio.duration
    setProgress(newProgress)
  }, [])

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

