'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle, Loader2, Upload, Music, X } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'

export default function MusicSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    description: '',
    submitter_name: '',
    submitter_email: '',
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg', 'audio/flac', 'audio/x-m4a']
      if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|ogg|flac)$/i)) {
        toast.error('Please select a valid audio file (MP3, WAV, M4A, OGG, or FLAC)')
        return
      }

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error(`File too large. Maximum size is 50MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`)
        return
      }

      setSelectedFile(file)
      // Auto-fill title from filename if empty
      if (!formData.title) {
        const fileName = file.name.replace(/\.[^/.]+$/, '')
        setFormData((prev) => ({ ...prev, title: fileName }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      toast.error('Please select an audio file')
      return
    }

    if (!formData.title || !formData.submitter_name || !formData.submitter_email) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      // Upload file to Supabase Storage
      const bucketName = 'music'
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `submissions/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = fileName

      // Upload to Supabase Storage
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

      // Submit metadata via API
      const response = await fetch('/api/music/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          artist: formData.artist || null,
          album: formData.album || null,
          genre: formData.genre || null,
          description: formData.description || null,
          file_url: publicUrl,
          file_path: filePath,
          file_size: selectedFile.size,
          submitter_name: formData.submitter_name,
          submitter_email: formData.submitter_email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // If submission fails, try to delete uploaded file
        await supabase.storage.from(bucketName).remove([filePath])
        throw new Error(data.error || 'Failed to submit song')
      }

      setIsSuccess(true)
      setSelectedFile(null)
      setFormData({
        title: '',
        artist: '',
        album: '',
        genre: '',
        description: '',
        submitter_name: '',
        submitter_email: '',
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      toast.success('Song submitted successfully! It will be reviewed before being published.')
    } catch (error: any) {
      console.error('Error submitting song:', error)
      toast.error(error.message || 'Failed to submit song. Please try again.')
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  if (isSuccess) {
    return (
      <Card className="bg-background/95 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold">Thank You!</h3>
            <p className="text-muted-foreground">
              Your song has been submitted successfully. It will be reviewed and published soon.
            </p>
            <Button onClick={() => setIsSuccess(false)} variant="outline">
              Submit Another
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-background/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Submit Your Music
        </CardTitle>
        <CardDescription>
          Share your music with the community. All submissions will be reviewed before being published.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="audio-file">Audio File *</Label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                id="audio-file"
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Select audio file to upload"
                title="Select audio file to upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {selectedFile ? 'Change File' : 'Select Audio File'}
              </Button>
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Music className="h-4 w-4" />
                  <span>{selectedFile.name}</span>
                  <span className="text-xs">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: MP3, WAV, M4A, OGG, FLAC (Max 50MB)
            </p>
          </div>

          {/* Song Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Song Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter song title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist">Artist</Label>
              <Input
                id="artist"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                placeholder="Artist name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="album">Album</Label>
              <Input
                id="album"
                value={formData.album}
                onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                placeholder="Album name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                placeholder="e.g., Rock, Pop, Electronic"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about your song..."
              rows={4}
            />
          </div>

          {/* Submitter Info */}
          <div className="border-t pt-4 space-y-4">
            <h3 className="font-semibold">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="submitter_name">Your Name *</Label>
                <Input
                  id="submitter_name"
                  type="text"
                  value={formData.submitter_name}
                  onChange={(e) => setFormData({ ...formData, submitter_name: e.target.value })}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="submitter_email">Your Email *</Label>
                <Input
                  id="submitter_email"
                  type="email"
                  value={formData.submitter_email}
                  onChange={(e) => setFormData({ ...formData, submitter_email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Song'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

