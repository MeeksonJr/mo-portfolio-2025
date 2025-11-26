"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipForward, SkipBack, Music2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getProxyAudioUrl } from "@/lib/music-helpers"

interface Song {
  title: string
  file: string
}

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false)
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
        if (!response.ok) throw new Error('Failed to fetch songs')
        const data = await response.json()
        // Transform API response to match component format
        const transformedSongs = (data.songs || []).map((song: any) => ({
          title: song.title || song.artist ? `${song.title}${song.artist ? ' - ' + song.artist : ''}` : 'Unknown',
          file: getProxyAudioUrl(song.file_url || song.file_path) || song.file_url || song.file_path,
        }))
        setSongs(transformedSongs)
      } catch (error) {
        console.error('Failed to load songs:', error)
        // Fallback to hardcoded songs if API fails
        setSongs([
          { title: "Dreamin'", file: "/songs/Dreamin'.mp3" },
          { title: "Driftwood Dreams", file: "/songs/Driftwood Dreams.mp3" },
          { title: "End of Time", file: "/songs/End of Time.mp3" },
          { title: "Lost In the Garden", file: "/songs/Lost In the Garden.mp3" },
          { title: "Now It Rains", file: "/songs/Now It Rains.mp3" },
        ])
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
        setTimeout(() => audioRef.current?.play(), 100)
      }
    }

    audio.addEventListener("timeupdate", updateProgress)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateProgress)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentTrack, songs.length])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
      // Track achievement when music is played
      if (typeof window !== 'undefined' && (window as any).unlockAchievement) {
        ;(window as any).unlockAchievement('music-player')
      }
    }
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    if (songs.length === 0) return
    setCurrentTrack((prev) => (prev + 1) % songs.length)
    setIsPlaying(true)
    setTimeout(() => audioRef.current?.play(), 100)
  }

  const handlePrevious = () => {
    if (songs.length === 0) return
    setCurrentTrack((prev) => (prev - 1 + songs.length) % songs.length)
    setIsPlaying(true)
    setTimeout(() => audioRef.current?.play(), 100)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const value = Number.parseFloat(e.target.value)
    audio.currentTime = (value / 100) * audio.duration
    setProgress(value)
  }

  // Don't render if no songs are loaded
  if (isLoading || songs.length === 0) {
    return null
  }

  return (
    <>
      {/* Floating Play Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed left-6 bottom-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:shadow-xl flex items-center justify-center text-white group"
          >
            <Music2 className="w-6 h-6 group-hover:animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Music Player */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed left-6 bottom-6 z-40 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Music2 className="w-5 h-5" />
                <span className="font-semibold">Now Playing</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
                aria-label="Close music player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Track Info */}
            <div className="p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                  {songs[currentTrack]?.title || 'Unknown'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track {currentTrack + 1} of {songs.length}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <label htmlFor="music-progress" className="sr-only">
                  Music progress
                </label>
                <input
                  id="music-progress"
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  // Dynamic gradient based on progress - inline style required for real-time updates
                  style={{
                    background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`,
                  }}
                  aria-label="Music progress"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  aria-label="Previous track"
                >
                  <SkipBack className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all hover:scale-110"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white fill-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white fill-white" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  aria-label="Next track"
                >
                  <SkipForward className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={songs[currentTrack]?.file || undefined}
        preload="auto"
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setProgress(0)
          }
        }}
        onError={(e) => {
          console.error('Audio loading error:', e)
          console.error('Failed to load:', songs[currentTrack]?.file)
          const audio = e.currentTarget
          if (audio.error?.code === audio.error?.MEDIA_ERR_SRC_NOT_SUPPORTED) {
            console.error('Media source not supported. Trying to reload...')
            // Try reloading after a short delay
            setTimeout(() => {
              if (audioRef.current && songs[currentTrack]?.file) {
                audioRef.current.load()
              }
            }, 1000)
          }
        }}
      />
    </>
  )
}
