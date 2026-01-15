'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Play, Pause, SkipForward, SkipBack, Search, Music2, Shuffle, Repeat, 
  Volume2, VolumeX, Heart, MoreVertical, Clock, ListMusic, Lock,
  PlayCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProxyAudioUrl } from '@/lib/music-helpers'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { toast } from 'sonner'

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

interface Playlist {
  id: string
  name: string
  description: string | null
  cover_image_url: string | null
  is_public: boolean
  created_at: string
  song_count?: number
  songs?: Array<{
    id: string
    title: string
    artist: string | null
    position: number
  }>
}

const TAB_OPTIONS = [
  { value: 'all', label: 'All', icon: Music2, description: 'Browse all music content' },
  { value: 'songs', label: 'Songs', icon: PlayCircle, description: 'Browse all songs' },
  { value: 'playlists', label: 'Playlists', icon: ListMusic, description: 'Browse playlists' },
]

export default function MusicHub() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('all')
  
  // Music player state
  const [songs, setSongs] = useState<Song[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [playlistsLoading, setPlaylistsLoading] = useState(true)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off')
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null)
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([])

  // Initialize tab from URL
  useEffect(() => {
    const tab = searchParams.get('tab') || 'all'
    if (TAB_OPTIONS.some(t => t.value === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/music?tab=${value}`, { scroll: false })
  }

  // Load songs
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
              localStorage.removeItem('currentPlaylist')
              setLoading(false)
              return
            } catch (e) {
              console.error('Error parsing stored playlist:', e)
              localStorage.removeItem('currentPlaylist')
            }
          }
        }
        
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

  // Load playlists
  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        setPlaylistsLoading(true)
        const response = await fetch('/api/playlists?includeSongs=false')
        if (!response.ok) throw new Error('Failed to fetch playlists')
        const data = await response.json()
        setPlaylists(data.playlists || [])
      } catch (error) {
        console.error('Error loading playlists:', error)
      } finally {
        setPlaylistsLoading(false)
      }
    }
    loadPlaylists()
  }, [])

  // Filter songs
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
      audio.src = getProxyAudioUrl(currentSong.file_url) || currentSong.file_url
      audio.volume = isMuted ? 0 : volume / 100
      if (isPlaying) {
        audio.play().catch(console.error)
      }
    }
  }, [currentTrack, filteredSongs, isPlaying, volume, isMuted])

  // Update volume when it changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : volume / 100
  }, [volume, isMuted])

  const togglePlay = () => {
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

  const handlePlayPlaylist = async (playlist: Playlist) => {
    try {
      const response = await fetch(`/api/playlists/${playlist.id}`)
      if (!response.ok) throw new Error('Failed to load playlist')
      
      const data = await response.json()
      const playlistSongs = data.playlist.songs || []
      
      if (playlistSongs.length === 0) {
        toast.error('This playlist is empty')
        return
      }

      // Convert playlist songs to player format
      const convertedSongs = playlistSongs.map((song: any) => ({
        id: song.id,
        title: song.title,
        artist: song.artist,
        album: song.album,
        genre: song.genre,
        file_url: song.file_url,
        duration: song.duration,
        play_count: 0,
        cover_image_url: song.cover_image_url,
      }))

      setSongs(convertedSongs)
      setFilteredSongs(convertedSongs)
      setCurrentTrack(0)
      setIsPlaying(true)
      setCurrentPlaylist(playlist)
      toast.success(`Playing ${playlist.name}`)
    } catch (error) {
      console.error('Error loading playlist:', error)
      toast.error('Failed to load playlist')
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const genres = Array.from(new Set(songs.map((s) => s.genre).filter(Boolean))) as string[]
  const currentSong = filteredSongs[currentTrack]

  // Filter playlists by search
  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (playlist.description && playlist.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Music Library
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover, play, and organize your favorite music
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Search songs, artists, albums, playlists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-background/95 backdrop-blur-sm border-border/50"
              />
            </div>
          </div>

          {/* Genre Filter */}
          {genres.length > 0 && (
            <div className="max-w-2xl mx-auto mb-6">
              <select
                value={selectedGenre || ''}
                onChange={(e) => setSelectedGenre(e.target.value || null)}
                className="w-full px-4 py-2 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-24">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Tab Navigation */}
          <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b mb-6">
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList 
                className="grid w-full grid-cols-3 h-auto p-1 bg-muted/60 backdrop-blur-sm min-w-max"
                aria-label="Music navigation tabs"
              >
                {TAB_OPTIONS.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.value
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-6 data-[state=active]:bg-background/95 data-[state=active]:backdrop-blur-sm data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border/50 transition-all"
                      aria-label={`${tab.label} tab`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>
          </div>

          {/* All Tab */}
          <TabsContent value="all" className="mt-0">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Songs Section */}
              <Card className="bg-background/95 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <PlayCircle className="h-5 w-5" />
                      Songs ({filteredSongs.length})
                    </h2>
                  </div>
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
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                      {filteredSongs.slice(0, 10).map((song, index) => (
                        <motion.button
                          key={song.id}
                          onClick={() => handleSongSelect(index)}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            index === currentTrack
                              ? 'bg-primary/20 border-2 border-primary'
                              : 'bg-muted/50 hover:bg-muted border-2 border-transparent'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              {index === currentTrack && isPlaying ? (
                                <Pause className="text-primary" size={16} />
                              ) : (
                                <Play className="text-primary" size={16} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{song.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {song.artist && <span className="truncate">{song.artist}</span>}
                                {song.album && <span>• {song.album}</span>}
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
                </CardContent>
              </Card>

              {/* Playlists Section */}
              <Card className="bg-background/95 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <ListMusic className="h-5 w-5" />
                      Playlists ({filteredPlaylists.length})
                    </h2>
                  </div>
                  {playlistsLoading ? (
                    <div className="text-center py-8">
                      <Music2 className="mx-auto animate-pulse text-primary" size={32} />
                    </div>
                  ) : filteredPlaylists.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ListMusic className="mx-auto mb-2" size={32} />
                      <p>No playlists found</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {filteredPlaylists.slice(0, 6).map((playlist) => (
                        <motion.div
                          key={playlist.id}
                          className="group flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          whileHover={{ scale: 1.02 }}
                        >
                          <Link href={`/playlists/${playlist.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden flex-shrink-0">
                              {playlist.cover_image_url ? (
                                <img src={playlist.cover_image_url} alt={playlist.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Music className="h-8 w-8 text-primary/30" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{playlist.name}</h3>
                              {playlist.description && (
                                <p className="text-sm text-muted-foreground line-clamp-1">{playlist.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">{playlist.song_count || 0} songs</span>
                                {!playlist.is_public && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Lock className="h-3 w-3 mr-1" />
                                    Private
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.preventDefault()
                              handlePlayPlaylist(playlist)
                            }}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Songs Tab */}
          <TabsContent value="songs" className="mt-0">
            <Card className="bg-background/95 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">All Songs ({filteredSongs.length})</h2>
                </div>
                {loading ? (
                  <div className="text-center py-12">
                    <Music2 className="mx-auto animate-pulse text-primary" size={48} />
                    <p className="mt-4 text-muted-foreground">Loading songs...</p>
                  </div>
                ) : filteredSongs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Music2 className="mx-auto mb-4" size={48} />
                    <p className="text-lg">No songs found</p>
                    <p className="text-sm mt-2">Try adjusting your search or filters</p>
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
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
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
                          <div className="text-sm text-muted-foreground flex items-center gap-4">
                            <span>{song.duration ? formatTime(song.duration) : '--:--'}</span>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Playlists Tab */}
          <TabsContent value="playlists" className="mt-0">
            {playlistsLoading ? (
              <div className="text-center py-12">
                <Music2 className="mx-auto animate-pulse text-primary" size={48} />
                <p className="mt-4 text-muted-foreground">Loading playlists...</p>
              </div>
            ) : filteredPlaylists.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ListMusic className="mx-auto mb-4" size={48} />
                <p className="text-lg">No playlists found</p>
                <p className="text-sm mt-2">Try adjusting your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlaylists.map((playlist) => (
                  <Link key={playlist.id} href={`/playlists/${playlist.id}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group"
                    >
                      <Card className="bg-background/95 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all cursor-pointer h-full">
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
                                <Button 
                                  size="lg" 
                                  variant="secondary" 
                                  className="rounded-full" 
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handlePlayPlaylist(playlist)
                                  }}
                                >
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
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Persistent Music Player */}
      {currentSong && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/50 shadow-2xl"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              {/* Song Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Music2 className="text-primary" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{currentSong.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {currentSong.artist || 'Unknown Artist'}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShuffle(!shuffle)} className={shuffle ? 'text-primary' : ''}>
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handlePrevious}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button size="lg" onClick={togglePlay} className="rounded-full w-12 h-12">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleNext}>
                  <SkipForward className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setRepeat(repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off')}
                  className={repeat !== 'off' ? 'text-primary' : ''}
                >
                  <Repeat className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress & Time */}
              <div className="flex items-center gap-2 flex-1 max-w-xs">
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                  aria-label="Seek"
                />
                <span className="text-xs text-muted-foreground w-12">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseInt(e.target.value))
                    setIsMuted(false)
                  }}
                  className="w-20 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                  aria-label="Volume"
                />
              </div>
            </div>
          </div>
          <audio ref={audioRef} preload="metadata" />
        </motion.div>
      )}
    </div>
  )
}

