'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Music, Plus, Edit, Trash2, Search, RefreshCw, ListMusic, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'

interface Playlist {
  id: string
  name: string
  description: string | null
  cover_image_url: string | null
  is_public: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  song_count?: number
  songs?: Array<{
    id: string
    title: string
    artist: string | null
    position: number
  }>
}

interface Song {
  id: string
  title: string
  artist: string | null
  album: string | null
  genre: string | null
}

export default function PlaylistsManager() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cover_image_url: '',
    is_public: true,
  })
  const [showAddSongsDialog, setShowAddSongsDialog] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [availableSongs, setAvailableSongs] = useState<Song[]>([])
  const [loadingSongs, setLoadingSongs] = useState(false)

  useEffect(() => {
    loadPlaylists()
  }, [])

  const loadPlaylists = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch('/api/admin/playlists?includeSongs=false', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to load playlists')

      const data = await response.json()
      setPlaylists(data.playlists || [])
    } catch (error: any) {
      console.error('Error loading playlists:', error)
      toast.error('Failed to load playlists')
    } finally {
      setIsLoading(false)
    }
  }

  const loadPlaylistSongs = async (playlistId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/playlists/${playlistId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to load playlist songs')

      const data = await response.json()
      return data.playlist.songs || []
    } catch (error) {
      console.error('Error loading playlist songs:', error)
      return []
    }
  }

  const loadAvailableSongs = async () => {
    setLoadingSongs(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch('/api/admin/music/songs?status=approved', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please log in again.')
          return
        }
        throw new Error('Failed to load songs')
      }

      const data = await response.json()
      setAvailableSongs(data.songs || [])
    } catch (error) {
      console.error('Error loading songs:', error)
      toast.error('Failed to load songs')
    } finally {
      setLoadingSongs(false)
    }
  }

  const handleCreate = () => {
    setEditingPlaylist(null)
    setFormData({
      name: '',
      description: '',
      cover_image_url: '',
      is_public: true,
    })
    setIsDialogOpen(true)
  }

  const handleEdit = async (playlist: Playlist) => {
    setEditingPlaylist(playlist)
    setFormData({
      name: playlist.name,
      description: playlist.description || '',
      cover_image_url: playlist.cover_image_url || '',
      is_public: playlist.is_public,
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const url = editingPlaylist
        ? `/api/admin/playlists/${editingPlaylist.id}`
        : '/api/admin/playlists'

      const response = await fetch(url, {
        method: editingPlaylist ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save playlist')
      }

      toast.success(`Playlist ${editingPlaylist ? 'updated' : 'created'} successfully`)
      setIsDialogOpen(false)
      setEditingPlaylist(null)
      loadPlaylists()
    } catch (error: any) {
      console.error('Error saving playlist:', error)
      toast.error(error.message || 'Failed to save playlist')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch(`/api/admin/playlists/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete playlist')
      }

      toast.success('Playlist deleted successfully')
      loadPlaylists()
    } catch (error: any) {
      console.error('Error deleting playlist:', error)
      toast.error(error.message || 'Failed to delete playlist')
    }
  }

  const handleAddSongs = async (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    await loadAvailableSongs()
    setShowAddSongsDialog(true)
  }

  const handleAddSongToPlaylist = async (songId: string) => {
    if (!selectedPlaylist) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch(`/api/playlists/${selectedPlaylist.id}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ song_id: songId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add song to playlist')
      }

      toast.success('Song added to playlist')
      loadPlaylists()
    } catch (error: any) {
      console.error('Error adding song to playlist:', error)
      toast.error(error.message || 'Failed to add song to playlist')
    }
  }

  const handleRemoveSong = async (playlistId: string, songId: string) => {
    if (!confirm('Remove this song from the playlist?')) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch(`/api/playlists/${playlistId}/songs/${songId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to remove song')
      }

      toast.success('Song removed from playlist')
      loadPlaylists()
    } catch (error: any) {
      console.error('Error removing song:', error)
      toast.error(error.message || 'Failed to remove song')
    }
  }

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (playlist.description && playlist.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Playlists Management</CardTitle>
              <CardDescription>
                Create and manage music playlists
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadPlaylists} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Playlist
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search playlists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Playlists Grid */}
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredPlaylists.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No playlists found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlaylists.map((playlist) => (
                <Card key={playlist.id} className="bg-background/95 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{playlist.name}</h3>
                          {playlist.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {playlist.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={playlist.is_public ? 'default' : 'secondary'}>
                              {playlist.is_public ? 'Public' : 'Private'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {playlist.song_count || 0} songs
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(playlist.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSongs(playlist)}
                          className="flex-1"
                        >
                          <ListMusic className="h-4 w-4 mr-1" />
                          Manage Songs
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(playlist)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(playlist.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPlaylist ? 'Edit Playlist' : 'Create Playlist'}
            </DialogTitle>
            <DialogDescription>
              {editingPlaylist ? 'Update playlist details' : 'Create a new music playlist'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Playlist Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Playlist"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your playlist..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cover_image_url">Cover Image URL</Label>
              <Input
                id="cover_image_url"
                type="url"
                value={formData.cover_image_url}
                onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                placeholder="https://example.com/cover.jpg"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_public">Public Playlist</Label>
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingPlaylist ? 'Update' : 'Create'} Playlist
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Songs Dialog */}
      <Dialog open={showAddSongsDialog} onOpenChange={setShowAddSongsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Songs: {selectedPlaylist?.name}
            </DialogTitle>
            <DialogDescription>
              Add or remove songs from this playlist
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {loadingSongs ? (
              <div className="text-center py-8">Loading songs...</div>
            ) : (
              <div className="space-y-2">
                {availableSongs.map((song) => {
                  const isInPlaylist = selectedPlaylist?.songs?.some(
                    (ps) => ps.id === song.id
                  )
                  return (
                    <div
                      key={song.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{song.title}</p>
                        {song.artist && (
                          <p className="text-sm text-muted-foreground">{song.artist}</p>
                        )}
                      </div>
                      {isInPlaylist ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveSong(selectedPlaylist!.id, song.id)}
                          className="text-red-600"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSongToPlaylist(song.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

