'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Music, X, Trash2, Search, Loader2, Check, XCircle, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Song {
  id: string
  title: string
  artist: string | null
  album: string | null
  genre: string | null
  file_url: string
  file_size: number
  duration: number | null
  play_count: number
  created_at: string
  status?: 'pending' | 'approved' | 'rejected'
  submitter_name?: string | null
  submitter_email?: string | null
}

export default function MusicUploadManager() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    description: '',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Load songs
  const loadSongs = useCallback(async () => {
    try {
      setLoading(true)
      
      // Get session token for authentication
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        console.error('No session found')
        setSongs([])
        return
      }

      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const response = await fetch(`/api/admin/music/songs?${params.toString()}`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized - session may have expired')
          setSongs([])
          return
        }
        throw new Error('Failed to fetch songs')
      }
      
      const data = await response.json()
      setSongs(data.songs || [])
    } catch (error) {
      console.error('Error loading songs:', error)
      setSongs([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, statusFilter])

  // Load songs on mount and when search changes
  useEffect(() => {
    loadSongs()
  }, [loadSongs])

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedFile(file)
      // Auto-fill title from filename
      const fileName = file.name.replace(/\.[^/.]+$/, '')
      setUploadForm((prev) => ({
        ...prev,
        title: prev.title || fileName,
      }))
      setShowUploadModal(true)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.flac'],
    },
    maxFiles: 1,
    disabled: isUploading,
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const fileName = file.name.replace(/\.[^/.]+$/, '')
      setUploadForm((prev) => ({
        ...prev,
        title: prev.title || fileName,
      }))
      setShowUploadModal(true)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !uploadForm.title) {
      alert('Please select a file and enter a title')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Get session token from Supabase client
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        alert('You must be logged in to upload songs')
        return
      }

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024 // 50MB
      if (selectedFile.size > maxSize) {
        alert(`File too large. Maximum size is 50MB. Your file is ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB.`)
        setIsUploading(false)
        return
      }

      // Upload directly to Supabase Storage (bypasses Vercel 4.5MB limit)
      const bucketName = 'music'
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = fileName

      // Upload to Supabase Storage with progress tracking
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, selectedFile, {
          contentType: selectedFile.type,
          upsert: false,
          cacheControl: '3600',
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        throw new Error(`Failed to upload file: ${uploadError.message}`)
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath)
      const publicUrl = urlData.publicUrl

      // Save song metadata to database via API
      const { data: { session: sessionForAPI } } = await supabase.auth.getSession()
      const response = await fetch('/api/admin/music/save-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionForAPI?.access_token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: uploadForm.title,
          artist: uploadForm.artist || null,
          album: uploadForm.album || null,
          genre: uploadForm.genre || null,
          description: uploadForm.description || null,
          file_url: publicUrl,
          file_path: filePath,
          file_size: selectedFile.size,
        }),
      })

      if (!response.ok) {
        // If metadata save fails, try to delete uploaded file
        await supabase.storage.from(bucketName).remove([filePath])
        
        let errorMessage = 'Failed to save song metadata'
        try {
          const error = await response.json()
          errorMessage = error.error || errorMessage
        } catch (e) {
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      if (!data.success || !data.song) {
        throw new Error(data.error || 'Upload succeeded but song data not returned')
      }

      console.log('Upload successful, song data:', data.song)
      alert('Song uploaded successfully!')
      
      // Reset form
      setSelectedFile(null)
      setUploadForm({
        title: '',
        artist: '',
        album: '',
        genre: '',
        description: '',
      })
      setShowUploadModal(false)
      
      // Reload songs with a small delay to ensure DB is updated
      setTimeout(() => {
        loadSongs()
      }, 500)
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(`Upload failed: ${error.message}`)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleApprove = async (songId: string, status: 'approved' | 'rejected') => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        alert('You must be logged in')
        return
      }

      const response = await fetch(`/api/admin/music/songs/${songId}/approve`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `Failed to ${status} song`)
      }

      toast.success(`Song ${status} successfully!`)
      loadSongs()
    } catch (error: any) {
      console.error('Approve error:', error)
      toast.error(error.message || `Failed to ${status} song`)
    }
  }

  const handleDelete = async (songId: string) => {
    if (!confirm('Are you sure you want to delete this song?')) return

    try {
      // Get session token for authentication
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        alert('You must be logged in to delete songs')
        return
      }

      const response = await fetch(`/api/admin/music/songs?id=${songId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete song')
      }

      toast.success('Song deleted successfully!')
      loadSongs()
    } catch (error: any) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Failed to delete song')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upload Music</h2>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Upload size={20} />
            Upload Song
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? 'Drop the file here' : 'Drag & drop a music file here'}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to select (MP3, WAV, M4A, OGG, FLAC)
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass rounded-xl p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              statusFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1 ${
              statusFilter === 'pending'
                ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/50'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Clock size={14} />
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1 ${
              statusFilter === 'approved'
                ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/50'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Check size={14} />
            Approved
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1 ${
              statusFilter === 'rejected'
                ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/50'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <XCircle size={14} />
            Rejected
          </button>
        </div>
      </div>

      {/* Songs List */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Your Music Library</h2>
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="mx-auto animate-spin text-primary" size={32} />
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Music className="mx-auto mb-2" size={32} />
            <p>No songs found. Upload your first song to get started!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {songs.map((song) => (
              <div
                key={song.id}
                className={`flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors ${
                  song.status === 'pending' 
                    ? 'bg-yellow-500/10 border border-yellow-500/30' 
                    : song.status === 'rejected'
                    ? 'bg-red-500/10 border border-red-500/30'
                    : 'bg-muted/50'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{song.title}</h3>
                    {song.status === 'pending' && (
                      <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded flex items-center gap-1">
                        <Clock size={12} />
                        Pending
                      </span>
                    )}
                    {song.status === 'rejected' && (
                      <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-600 dark:text-red-400 rounded flex items-center gap-1">
                        <XCircle size={12} />
                        Rejected
                      </span>
                    )}
                  </div>
                  {song.submitter_name && (
                    <p className="text-xs text-muted-foreground mb-1">
                      Submitted by: {song.submitter_name} {song.submitter_email && `(${song.submitter_email})`}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {song.artist && <span>{song.artist}</span>}
                    {song.album && <span>• {song.album}</span>}
                    {song.genre && <span>• {song.genre}</span>}
                    <span>• {formatFileSize(song.file_size)}</span>
                    {song.status === 'approved' && <span>• {song.play_count} plays</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {song.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(song.id, 'approved')}
                        className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                        aria-label={`Approve ${song.title}`}
                        title={`Approve ${song.title}`}
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={() => handleApprove(song.id, 'rejected')}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        aria-label={`Reject ${song.title}`}
                        title={`Reject ${song.title}`}
                      >
                        <XCircle size={20} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(song.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    aria-label={`Delete ${song.title}`}
                    title={`Delete ${song.title}`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => !isUploading && setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Upload Song</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close upload modal"
                >
                  <X size={20} />
                </button>
              </div>

              {selectedFile && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Song title"
                    disabled={isUploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Artist</label>
                  <input
                    type="text"
                    value={uploadForm.artist}
                    onChange={(e) => setUploadForm({ ...uploadForm, artist: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Artist name"
                    disabled={isUploading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Album</label>
                    <input
                      type="text"
                      value={uploadForm.album}
                      onChange={(e) => setUploadForm({ ...uploadForm, album: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Album name"
                      disabled={isUploading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Genre</label>
                    <input
                      type="text"
                      value={uploadForm.genre}
                      onChange={(e) => setUploadForm({ ...uploadForm, genre: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Genre"
                      disabled={isUploading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Song description (optional)"
                    rows={3}
                    disabled={isUploading}
                  />
                </div>

                {!selectedFile && (
                <div>
                  <label htmlFor="file-input" className="block text-sm font-medium mb-1">Select File</label>
                  <input
                    id="file-input"
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isUploading}
                    aria-label="Select audio file"
                  />
                </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleUpload()
                    }}
                    disabled={isUploading || !selectedFile || !uploadForm.title}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        Upload
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    disabled={isUploading}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

