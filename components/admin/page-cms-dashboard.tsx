'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Upload, X, Check, Wand2, Loader2, Image as ImageIcon, FileText, Save, RefreshCw, History } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import MDXEditor from '@/components/admin/mdx-editor'
import ImageVersionHistoryDialog from '@/components/admin/image-version-history-dialog'

const PAGES = [
  { 
    value: 'timeline', 
    label: 'Timeline', 
    sections: [
      'born-guinea', 
      'moved-nyc', 
      'learned-english', 
      'discovered-coding', 
      'started-college', 
      'competition-win', 
      'building-saas', 
      'current'
    ] 
  },
  { value: 'about', label: 'About', sections: ['hero', 'bio', 'skills', 'values', 'gallery'] },
  { value: 'work', label: 'Work', sections: ['hero', 'description'] },
  { value: 'services', label: 'Services', sections: ['hero', 'description', 'service-1', 'service-2', 'service-3'] },
  { value: 'home', label: 'Home', sections: ['hero', 'intro', 'cta'] },
]

type ContentItem = {
  id: string
  page_key: string
  section_key: string
  content_type: string
  content: string
  metadata: any
  version: number
}

type ImageItem = {
  id: string
  page_key: string
  section_key: string
  image_url: string
  alt_text: string
  caption: string
  display_order: number
  is_featured: boolean
  is_active: boolean
}

export default function PageCMSDashboard() {
  const [selectedPage, setSelectedPage] = useState<string>('timeline')
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'content' | 'images'>('content')
  
  const [content, setContent] = useState<ContentItem | null>(null)
  const [contentValue, setContentValue] = useState('')
  const [contentType, setContentType] = useState<'text' | 'html' | 'mdx'>('text')
  const [isSavingContent, setIsSavingContent] = useState(false)
  
  const [images, setImages] = useState<ImageItem[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageAltText, setImageAltText] = useState('')
  const [imageCaption, setImageCaption] = useState('')
  const [versionHistoryImageId, setVersionHistoryImageId] = useState<string | null>(null)
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false)
  
  const [aiImproving, setAiImproving] = useState(false)
  const [aiContext, setAiContext] = useState('')

  const currentPage = PAGES.find(p => p.value === selectedPage)
  const currentSections = currentPage?.sections || []

  // Load content when page/section changes
  useEffect(() => {
    if (selectedPage && selectedSection) {
      loadContent()
      loadImages()
    }
  }, [selectedPage, selectedSection])

  const loadContent = async () => {
    if (!selectedPage || !selectedSection) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch(
        `/api/admin/pages/content?page_key=${selectedPage}&section_key=${selectedSection}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      )

      if (!response.ok) throw new Error('Failed to load content')

      const { data } = await response.json()
      if (data && data.length > 0) {
        const item = data[0]
        setContent(item)
        setContentValue(item.content)
        setContentType(item.content_type as 'text' | 'html' | 'mdx')
      } else {
        setContent(null)
        setContentValue('')
      }
    } catch (error: any) {
      console.error('Error loading content:', error)
      toast.error('Failed to load content')
    }
  }

  const loadImages = async () => {
    if (!selectedPage || !selectedSection) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch(
        `/api/admin/pages/images?page_key=${selectedPage}&section_key=${selectedSection}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      )

      if (!response.ok) throw new Error('Failed to load images')

      const { data } = await response.json()
      setImages(data || [])
    } catch (error: any) {
      console.error('Error loading images:', error)
      toast.error('Failed to load images')
    }
  }

  const handleSaveContent = async () => {
    if (!selectedPage || !selectedSection || !contentValue.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSavingContent(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch('/api/admin/pages/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          page_key: selectedPage,
          section_key: selectedSection,
          content_type: contentType,
          content: contentValue,
          metadata: {},
        }),
      })

      if (!response.ok) throw new Error('Failed to save content')

      toast.success('Content saved successfully')
      await loadContent()
    } catch (error: any) {
      console.error('Error saving content:', error)
      toast.error('Failed to save content')
    } finally {
      setIsSavingContent(false)
    }
  }

  const handleImproveContent = async (type: 'improve' | 'shorten' | 'lengthen' | 'rewrite' | 'fix-grammar' | 'enhance') => {
    if (!contentValue.trim()) {
      toast.error('Please enter content to improve')
      return
    }

    setAiImproving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch('/api/admin/ai/improve-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          content: contentValue,
          context: aiContext || `${selectedPage} - ${selectedSection}`,
          type,
        }),
      })

      if (!response.ok) throw new Error('Failed to improve content')

      const { improved } = await response.json()
      setContentValue(improved)
      toast.success('Content improved successfully')
    } catch (error: any) {
      console.error('Error improving content:', error)
      toast.error(error.message || 'Failed to improve content')
    } finally {
      setAiImproving(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB')
        return
      }
      setSelectedImage(file)
    }
  }

  const handleUploadImage = async () => {
    if (!selectedImage || !selectedPage || !selectedSection) {
      toast.error('Please select an image and page section')
      return
    }

    setUploadingImage(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const formData = new FormData()
      formData.append('file', selectedImage)
      formData.append('page_key', selectedPage)
      formData.append('section_key', selectedSection)
      formData.append('alt_text', imageAltText)
      formData.append('caption', imageCaption)
      formData.append('is_featured', 'false')

      const response = await fetch('/api/admin/pages/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload image')

      toast.success('Image uploaded successfully')
      setSelectedImage(null)
      setImageAltText('')
      setImageCaption('')
      await loadImages()
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleToggleImageActive = async (imageId: string, isActive: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch('/api/admin/pages/images', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: imageId,
          is_active: !isActive,
        }),
      })

      if (!response.ok) throw new Error('Failed to update image')

      toast.success('Image updated')
      await loadImages()
    } catch (error: any) {
      console.error('Error updating image:', error)
      toast.error('Failed to update image')
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image? It will be archived.')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch(`/api/admin/pages/images?id=${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to delete image')

      toast.success('Image deleted')
      await loadImages()
    } catch (error: any) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Page Content & Image Management</h1>
        <p className="text-muted-foreground">
          Manage content and images across all public pages with AI assistance
        </p>
      </div>

      {/* Page & Section Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Page & Section</CardTitle>
          <CardDescription>Choose which page and section to manage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="page-select">Page</Label>
              <Select value={selectedPage} onValueChange={(value) => {
                setSelectedPage(value)
                setSelectedSection('')
              }}>
                <SelectTrigger id="page-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGES.map((page) => (
                    <SelectItem key={page.value} value={page.value}>
                      {page.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="section-select">Section</Label>
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
                disabled={!selectedPage}
              >
                <SelectTrigger id="section-select">
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  {currentSections.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedPage && selectedSection && (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="content">
              <FileText className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="images">
              <ImageIcon className="h-4 w-4 mr-2" />
              Images ({images.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Content Editor</CardTitle>
                    <CardDescription>
                      {selectedPage} / {selectedSection}
                      {content && (
                        <Badge variant="outline" className="ml-2">
                          v{content.version}
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select value={contentType} onValueChange={(v) => {
                      if (v) setContentType(v as 'text' | 'html' | 'mdx')
                    }}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="mdx">MDX</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleSaveContent} disabled={isSavingContent}>
                      {isSavingContent ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* AI Context */}
                <div>
                  <Label htmlFor="ai-context">AI Context (optional)</Label>
                  <Input
                    id="ai-context"
                    value={aiContext}
                    onChange={(e) => setAiContext(e.target.value)}
                    placeholder="Provide context for AI improvements (e.g., 'Hero section for homepage')"
                  />
                </div>

                {/* Content Editor */}
                {contentType === 'mdx' ? (
                  <MDXEditor
                    value={contentValue}
                    onChange={(v) => {
                      if (v !== undefined) {
                        setContentValue(v)
                      }
                    }}
                  />
                ) : (
                  <Textarea
                    value={contentValue}
                    onChange={(e) => setContentValue(e.target.value)}
                    placeholder="Enter content..."
                    className="min-h-[300px] font-mono"
                  />
                )}

                {/* AI Improvement Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImproveContent('improve')}
                    disabled={aiImproving || !contentValue.trim()}
                  >
                    {aiImproving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4 mr-2" />
                    )}
                    Improve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImproveContent('shorten')}
                    disabled={aiImproving || !contentValue.trim()}
                  >
                    Shorten
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImproveContent('lengthen')}
                    disabled={aiImproving || !contentValue.trim()}
                  >
                    Lengthen
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImproveContent('rewrite')}
                    disabled={aiImproving || !contentValue.trim()}
                  >
                    Rewrite
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImproveContent('fix-grammar')}
                    disabled={aiImproving || !contentValue.trim()}
                  >
                    Fix Grammar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImproveContent('enhance')}
                    disabled={aiImproving || !contentValue.trim()}
                  >
                    Enhance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
                <CardDescription>Upload images for this section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="image-upload">Image File</Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                  {selectedImage && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{selectedImage.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="image-alt">Alt Text</Label>
                  <Input
                    id="image-alt"
                    value={imageAltText}
                    onChange={(e) => setImageAltText(e.target.value)}
                    placeholder="Descriptive alt text for accessibility"
                  />
                </div>
                <div>
                  <Label htmlFor="image-caption">Caption (optional)</Label>
                  <Input
                    id="image-caption"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="Image caption"
                  />
                </div>
                <Button
                  onClick={handleUploadImage}
                  disabled={!selectedImage || uploadingImage}
                >
                  {uploadingImage ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload Image
                </Button>
              </CardContent>
            </Card>

            {/* Image Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Images ({images.length})</CardTitle>
                <CardDescription>Manage images for this section</CardDescription>
              </CardHeader>
              <CardContent>
                {images.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No images uploaded yet
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className={`border rounded-lg p-4 space-y-2 ${
                          !image.is_active ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="relative aspect-video rounded overflow-hidden bg-muted">
                          <Image
                            src={image.image_url}
                            alt={image.alt_text || 'Image'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium truncate">
                            {image.alt_text || 'No alt text'}
                          </p>
                          {image.caption && (
                            <p className="text-xs text-muted-foreground truncate">
                              {image.caption}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <Badge variant={image.is_active ? 'default' : 'secondary'}>
                              {image.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            {image.is_featured && (
                              <Badge variant="outline">Featured</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setVersionHistoryImageId(image.id)
                              setVersionHistoryOpen(true)
                            }}
                            title="View version history"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleImageActive(image.id, image.is_active)}
                          >
                            {image.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteImage(image.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Image Version History Dialog */}
      {versionHistoryImageId && (
        <ImageVersionHistoryDialog
          open={versionHistoryOpen}
          onOpenChange={setVersionHistoryOpen}
          pageImageId={versionHistoryImageId}
          currentImageUrl={images.find(img => img.id === versionHistoryImageId)?.image_url}
          onVersionRestore={() => {
            loadImages()
            setVersionHistoryOpen(false)
          }}
        />
      )}
    </div>
  )
}

