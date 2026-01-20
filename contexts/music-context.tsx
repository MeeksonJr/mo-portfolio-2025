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

  // Track if songs have been loaded to prevent infinite loops
  const songsLoadedRef = useRef(false)

  // Load songs - memoized to prevent infinite loops
  const loadSongs = useCallback(async () => {
    // Prevent multiple simultaneous loads
    if (songsLoadedRef.current || isLoading) {
      return
    }

    try {
      setIsLoading(true)
      songsLoadedRef.current = true // Set early to prevent concurrent calls
      const { getProxyAudioUrl } = await import('@/lib/music-helpers')
      const response = await fetch('/api/music/songs')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch songs: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.songs || !Array.isArray(data.songs)) {
        console.error('Invalid songs data:', data)
        setSongs([])
        songsLoadedRef.current = false // Reset on error so it can retry
        return
      }
      
      const transformedSongs = data.songs
        .filter((song: any) => song.file_url) // Only include songs with file_url
        .map((song: any) => ({
          title: song.title || song.artist ? `${song.title || 'Unknown'}${song.artist ? ' - ' + song.artist : ''}` : 'Unknown Song',
          file: getProxyAudioUrl(song.file_url) || song.file_url,
        }))
      
      if (transformedSongs.length === 0) {
        console.warn('No songs with valid file URLs found')
      }
      
      setSongs(transformedSongs)
    } catch (error) {
      console.error('Failed to load songs:', error)
      setSongs([])
      songsLoadedRef.current = false // Reset on error so it can retry
    } finally {
      setIsLoading(false)
    }
  }, [isLoading]) // Only depend on isLoading

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

