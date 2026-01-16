'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, SkipForward, SkipBack, Search, Music2, Shuffle, Repeat, Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProxyAudioUrl } from '@/lib/music-helpers'
import PageContainer from '@/components/layout/page-container'

interface Song {
  id: string
  title: string
  artist: string | null
  album: string | null
  genre: string | null
  file_url: string
  duration: number | null
  play_count: number
  cover_image_url: string | null
}

export default function MusicPlayerPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off')
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Load songs (check for playlist first)
  useEffect(() => {
    const loadSongs = async () => {
      try {
        setLoading(true)
        
        // Check if there's a playlist in localStorage
        if (typeof window !== 'undefined') {
          const storedPlaylist = localStorage.getItem('currentPlaylist')
          if (storedPlaylist) {
            try {
              const playlist = JSON.parse(storedPlaylist)
              // Convert playlist songs to the format expected by the player
              const playlistSongs = playlist.songs.map((song: any) => ({
                id: `playlist-${playlist.id}-${song.title}`,
                title: song.title,
                artist: null,
                album: null,
                genre: null,
                file_url: song.file,
                duration: null,
                play_count: 0,
                cover_image_url: null,
              }))
              setSongs(playlistSongs)
              setFilteredSongs(playlistSongs)
              // Clear the stored playlist after loading
              localStorage.removeItem('currentPlaylist')
              setLoading(false)
              return
            } catch (e) {
              console.error('Error parsing stored playlist:', e)
              localStorage.removeItem('currentPlaylist')
            }
          }
        }
        
        // Load all songs if no playlist
        const response = await fetch('/api/music/songs')
        if (!response.ok) throw new Error('Failed to fetch songs')
        const data = await response.json()
        setSongs(data.songs || [])
        setFilteredSongs(data.songs || [])
      } catch (error) {
        console.error('Error loading songs:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSongs()
  }, [])

  // Filter songs based on search and genre
  useEffect(() => {
    let filtered = songs

    if (searchQuery) {
      filtered = filtered.filter(
        (song) =>
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.album?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedGenre) {
      filtered = filtered.filter((song) => song.genre === selectedGenre)
    }

    setFilteredSongs(filtered)
  }, [searchQuery, selectedGenre, songs])

  // Get unique genres
  const genres = Array.from(new Set(songs.map((s) => s.genre).filter(Boolean))) as string[]

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setCurrentTime(audio.currentTime)
      setProgress((audio.currentTime / audio.duration) * 100 || 0)
    }

    const updateDuration = () => {
      setDuration(audio.duration || 0)
    }

    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0
        audio.play()
      } else if (repeat === 'all' || shuffle) {
        handleNext()
      } else {
        handleNext()
      }
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [repeat, shuffle])

  // Update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || filteredSongs.length === 0) return

    const currentSong = filteredSongs[currentTrack]
    if (currentSong) {
      const proxyUrl = getProxyAudioUrl(currentSong.file_url) || currentSong.file_url
      audio.src = proxyUrl
      audio.load() // Reload the audio element with new source
      if (isPlaying) {
        audio.play().catch((error) => {
          console.error('Error playing audio:', error)
          setIsPlaying(false)
        })
      }
    }
  }, [currentTrack, filteredSongs, isPlaying])

  // Volume control
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : volume / 100
  }, [volume, isMuted])

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
    if (filteredSongs.length === 0) return

    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * filteredSongs.length)
      setCurrentTrack(randomIndex)
    } else {
      setCurrentTrack((prev) => (prev + 1) % filteredSongs.length)
    }
    setIsPlaying(true)
  }

  const handlePrevious = () => {
    if (filteredSongs.length === 0) return
    setCurrentTrack((prev) => (prev - 1 + filteredSongs.length) % filteredSongs.length)
    setIsPlaying(true)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const newTime = (parseFloat(e.target.value) / 100) * audio.duration
    audio.currentTime = newTime
    setProgress(parseFloat(e.target.value))
  }

  const handleSongSelect = (index: number) => {
    setCurrentTrack(index)
    setIsPlaying(true)
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentSong = filteredSongs[currentTrack]

  return (
    <PageContainer width="wide" padding="tight">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Music Library
        </h1>
        <p className="text-muted-foreground mb-4">Discover and play music</p>
        <div className="flex justify-center gap-4">
          <a
            href="/playlists"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-sm font-medium"
          >
            <Music2 className="h-4 w-4" />
            Browse Playlists
          </a>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <label htmlFor="genre-select" className="sr-only">Filter by genre</label>
          <select
            id="genre-select"
            value={selectedGenre || ''}
            onChange={(e) => setSelectedGenre(e.target.value || null)}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Filter by genre"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Songs List */}
        <div className="lg:col-span-2">
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {searchQuery || selectedGenre ? 'Search Results' : 'All Songs'} ({filteredSongs.length})
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <Music2 className="mx-auto animate-pulse text-primary" size={32} />
              </div>
            ) : filteredSongs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Music2 className="mx-auto mb-2" size={32} />
                <p>No songs found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredSongs.map((song, index) => (
                  <motion.button
                    key={song.id}
                    onClick={() => handleSongSelect(index)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      index === currentTrack
                        ? 'bg-primary/20 border-2 border-primary'
                        : 'bg-muted/50 hover:bg-muted border-2 border-transparent'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {index === currentTrack && isPlaying ? (
                          <Pause className="text-primary" size={20} />
                        ) : (
                          <Play className="text-primary" size={20} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{song.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {song.artist && <span>{song.artist}</span>}
                          {song.album && <span>• {song.album}</span>}
                          {song.genre && <span>• {song.genre}</span>}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {song.duration ? formatTime(song.duration) : '--:--'}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Now Playing Sidebar */}
        {currentSong && (
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Now Playing</h2>
              <div className="space-y-4">
                {/* Album Art Placeholder */}
                <div className="aspect-square w-full bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center">
                  <Music2 className="text-primary" size={64} />
                </div>

                {/* Song Info */}
                <div className="text-center">
                  <h3 className="text-lg font-bold">{currentSong.title}</h3>
                  {currentSong.artist && (
                    <p className="text-muted-foreground">{currentSong.artist}</p>
                  )}
                  {currentSong.album && (
                    <p className="text-sm text-muted-foreground mt-1">{currentSong.album}</p>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <label htmlFor="progress-slider" className="sr-only">Progress</label>
                  <input
                    id="progress-slider"
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    aria-label="Progress"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setShuffle(!shuffle)}
                      className={`p-2 rounded-lg transition-colors ${
                        shuffle ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`}
                      aria-label="Shuffle"
                    >
                      <Shuffle size={20} />
                    </button>
                    <button
                      onClick={handlePrevious}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                      aria-label="Previous"
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
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                      aria-label="Next"
                    >
                      <SkipForward size={24} />
                    </button>
                    <button
                      onClick={() => {
                        if (repeat === 'off') setRepeat('all')
                        else if (repeat === 'all') setRepeat('one')
                        else setRepeat('off')
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        repeat !== 'off' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`}
                      aria-label="Repeat"
                    >
                      <Repeat size={20} />
                    </button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      aria-label="Volume"
                    />
                    <span className="text-xs text-muted-foreground w-10 text-right">{volume}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        preload="metadata"
        onError={(e) => {
          console.error('Audio loading error:', e)
          const audio = e.currentTarget
          if (audio.error) {
            console.error('Audio error code:', audio.error.code)
            console.error('Failed to load:', filteredSongs[currentTrack]?.file_url)
          }
        }}
      />
    </PageContainer>
  )
}

