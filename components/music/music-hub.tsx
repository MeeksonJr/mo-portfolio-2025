'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Play, Pause, SkipForward, SkipBack, Search, Music2, Shuffle, Repeat, 
  Volume2, VolumeX, ListMusic, Download, Disc3, 
  PlayCircle, Upload, Menu, Heart
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProxyAudioUrl } from '@/lib/music-helpers'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'

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

export default function MusicHub() {
  const router = useRouter()
  
  // Audio state
  const [songs, setSongs] = useState<Song[]>([])
  const [currentTrack, setCurrentTrack] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off')
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  
  const audioRef = useRef<HTMLAudioElement>(null)

  // Load songs from the database
  useEffect(() => {
    const loadSongs = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/music/songs')
        if (!response.ok) throw new Error('Failed to fetch songs')
        const data = await response.json()
        setSongs(data.songs || [])
      } catch (error) {
        console.error('Error loading songs:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSongs()
  }, [])

  // Filter songs based on search
  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setCurrentTime(audio.currentTime)
      setProgress((audio.currentTime / audio.duration) * 100 || 0)
    }

    const updateDuration = () => setDuration(audio.duration || 0)

    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0
        audio.play()
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
  }, [repeat, shuffle, filteredSongs])

  // Update Audio source when track changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || filteredSongs.length === 0) return

    const selectedSong = filteredSongs[currentTrack]
    if (selectedSong) {
      const src = getProxyAudioUrl(selectedSong.file_url) || selectedSong.file_url
      if (audio.src !== src && !audio.src.includes(src)) {
        audio.src = src
      }
      audio.volume = isMuted ? 0 : volume / 100
      
      if (isPlaying) {
        audio.play().catch(e => console.log('Playback prevented', e))
      }
    }
  }, [currentTrack, filteredSongs, isPlaying])

  // Volume handler
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : volume / 100
  }, [volume, isMuted])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || filteredSongs.length === 0) return

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
      setCurrentTrack(Math.floor(Math.random() * filteredSongs.length))
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

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return
    const newTime = (value[0] / 100) * duration
    audio.currentTime = newTime
    setProgress(value[0])
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentSong = filteredSongs[currentTrack]

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background">
      <audio ref={audioRef} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Space (Optional future use for navigation) */}
        <div className="hidden lg:flex w-64 flex-col bg-background border-r border-border p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Disc3 className="w-6 h-6 text-primary animate-[spin_5s_linear_infinite]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Audio Vault</h1>
          </div>
          
          <div className="space-y-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Library</div>
            <Button variant="secondary" className="w-full justify-start font-medium">
              <Music2 className="mr-3 h-4 w-4" /> All Songs
            </Button>
            <Button variant="ghost" className="w-full justify-start font-medium hover:bg-white/5">
              <ListMusic className="mr-3 h-4 w-4" /> Playlists
            </Button>
            <Button variant="ghost" className="w-full justify-start font-medium hover:bg-white/5">
              <Heart className="mr-3 h-4 w-4" /> Liked Tracks
            </Button>
          </div>

          <div className="mt-auto space-y-4">
            <Link href="/music/submit">
              <Button variant="outline" className="w-full justify-start">
                <Upload className="mr-3 h-4 w-4" /> Submit Music
              </Button>
            </Link>
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col relative overflow-y-auto">
          {/* Dynamic Background Gradient */}
          <div className={cn(
            "absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000",
            isPlaying ? "bg-gradient-to-br from-primary/30 via-background to-background" : "bg-gradient-to-br from-muted via-background to-background"
          )} />

          {/* Header */}
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search songs, artists, or albums..." 
                className="pl-10 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </header>

          {/* Song List */}
          <div className="p-6 pb-32 max-w-5xl mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Tracks</h2>
              <p className="text-muted-foreground">Your curated audio experience.</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Music2 className="h-8 w-8 animate-bounce text-muted-foreground" />
              </div>
            ) : filteredSongs.length === 0 ? (
              <div className="text-center p-12 bg-muted/20 rounded-2xl border border-white/5">
                <Disc3 className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No tracks found</h3>
                <p className="text-muted-foreground text-sm">Adjust your search to find more music.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredSongs.map((song, idx) => {
                  const isThisPlaying = isPlaying && currentTrack === idx
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={song.id}
                      onClick={() => {
                        setCurrentTrack(idx)
                        if (!isPlaying || currentTrack !== idx) setIsPlaying(true)
                      }}
                      className={cn(
                        "group flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer hover:bg-muted/50",
                        currentTrack === idx ? "bg-primary/5" : ""
                      )}
                    >
                      {/* Track Number / Play Icon */}
                      <div className="w-8 text-center text-muted-foreground hidden sm:block relative">
                        {isThisPlaying ? (
                          <div className="flex items-end justify-center gap-[2px] h-4">
                            <motion.div animate={{ height: ["4px", "12px", "4px"] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-primary rounded-t-sm" />
                            <motion.div animate={{ height: ["8px", "16px", "8px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-primary rounded-t-sm" />
                            <motion.div animate={{ height: ["12px", "6px", "12px"] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1 bg-primary rounded-t-sm" />
                          </div>
                        ) : (
                          <span className="group-hover:opacity-0 transition-opacity">{idx + 1}</span>
                        )}
                        <Play className={cn(
                          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity",
                          isThisPlaying ? "hidden" : ""
                        )} />
                      </div>

                      {/* Art */}
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                        {song.cover_image_url ? (
                          <img src={song.cover_image_url} alt={song.title} className="object-cover w-full h-full" />
                        ) : (
                          <Music2 className="h-5 w-5 text-muted-foreground/50" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className={cn("font-medium truncate", currentTrack === idx ? "text-primary" : "")}>
                          {song.title}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {song.artist || 'Unknown Artist'}
                        </div>
                      </div>

                      {/* Album (Desktop only) */}
                      <div className="hidden md:block flex-1 text-sm text-muted-foreground truncate pr-4">
                        {song.album || 'Single'}
                      </div>

                      {/* Duration */}
                      <div className="text-sm text-muted-foreground w-12 text-right">
                        {song.duration ? formatTime(song.duration) : '--:--'}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Persistent Bottom Bar (The Player) */}
      <AnimatePresence>
        {currentSong && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 h-24 bg-background/80 backdrop-blur-2xl border-t border-border z-50 px-4 sm:px-6 flex items-center justify-between"
          >
            
            {/* Now Playing Info */}
            <div className="flex items-center gap-4 w-1/3 min-w-0">
              <div className="relative w-14 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0 shadow-lg">
                <div className={cn("absolute inset-0 flex items-center justify-center", isPlaying ? "animate-[spin_4s_linear_infinite]" : "")}>
                  {currentSong.cover_image_url ? (
                    <img src={currentSong.cover_image_url} alt={currentSong.title} className="w-full h-full object-cover rounded-full p-1 bg-black" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary/20 to-primary/60 p-1 flex items-center justify-center">
                       <Disc3 className="text-background w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-sm truncate">{currentSong.title}</h4>
                <p className="text-xs text-muted-foreground truncate">{currentSong.artist || 'Unknown Artist'}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center justify-center w-1/3 max-w-xl px-4 gap-2">
              <div className="flex items-center gap-6">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setShuffle(!shuffle)}>
                  <Shuffle className={cn("h-4 w-4", shuffle && "text-primary")} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handlePrevious}>
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button size="icon" className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-1" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleNext}>
                  <SkipForward className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setRepeat(repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off')}>
                  <Repeat className={cn("h-4 w-4", repeat !== 'off' && "text-primary")} />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3 w-full text-xs text-muted-foreground font-medium">
                <span className="w-10 text-right">{formatTime(currentTime)}</span>
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  className="flex-1"
                  onValueChange={handleSeek}
                />
                <span className="w-10">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Extra Controls */}
            <div className="flex items-center justify-end gap-4 w-1/3">
              <div className="flex items-center gap-2 w-32 hidden sm:flex">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  className="w-full"
                  onValueChange={(val) => {
                    setVolume(val[0])
                    if (val[0] > 0) setIsMuted(false)
                  }}
                />
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
