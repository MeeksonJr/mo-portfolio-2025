'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Wand2, Image as ImageIcon, FileText, Sparkles, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function AIToolsDashboard() {
  const [activeTab, setActiveTab] = useState('image')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generatedContent, setGeneratedContent] = useState<string>('')
  
  // Image generation state
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageModel, setImageModel] = useState('stabilityai/stable-diffusion-xl-base-1.0')
  
  // Content generation state
  const [contentType, setContentType] = useState('blog')
  const [contentTopic, setContentTopic] = useState('')
  const [contentLength, setContentLength] = useState('medium')
  const [contentTone, setContentTone] = useState('professional')

  const supabase = createClient()

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error('Please enter an image description')
      return
    }

    setIsGenerating(true)
    setGeneratedImage(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      // Use the existing API which expects repo-based format, but we'll adapt it
      // by using the prompt as the description
      const response = await fetch('/api/admin/ai/generate-image', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          readmeContent: imagePrompt,
          contentType: 'blog', // Default content type
          repoName: 'Custom Image',
          repoDescription: imagePrompt,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate image')
      }

      if (result.imageUrl) {
        setGeneratedImage(result.imageUrl)
        toast.success('Image generated successfully!')
      } else {
        throw new Error('No image URL returned')
      }
    } catch (error: any) {
      console.error('Error generating image:', error)
      toast.error(error.message || 'Failed to generate image')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateContent = async () => {
    if (!contentTopic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    setIsGenerating(true)
    setGeneratedContent('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch('/api/admin/ai/generate-content', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          contentType,
          topic: contentTopic,
          length: contentLength,
          tone: contentTone,
          fieldType: 'all',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate content')
      }

      if (result.content) {
        setGeneratedContent(result.content)
        toast.success('Content generated successfully!')
      } else {
        throw new Error('No content returned')
      }
    } catch (error: any) {
      console.error('Error generating content:', error)
      toast.error(error.message || 'Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="image">
          <ImageIcon className="mr-2 h-4 w-4" />
          Image Generation
        </TabsTrigger>
        <TabsTrigger value="content">
          <FileText className="mr-2 h-4 w-4" />
          Content Generation
        </TabsTrigger>
        <TabsTrigger value="enhance">
          <Sparkles className="mr-2 h-4 w-4" />
          Content Enhancement
        </TabsTrigger>
      </TabsList>

      <TabsContent value="image" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Image</CardTitle>
            <CardDescription>
              Create images using AI models. Perfect for blog covers, project thumbnails, and more.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-model">Model</Label>
              <Select value={imageModel} onValueChange={setImageModel}>
                <SelectTrigger id="image-model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stabilityai/stable-diffusion-xl-base-1.0">
                    Stable Diffusion XL
                  </SelectItem>
                  <SelectItem value="stabilityai/stable-diffusion-2-1">
                    Stable Diffusion 2.1
                  </SelectItem>
                  <SelectItem value="SG161222/Realistic_Vision_V5.1_noVAE">
                    Realistic Vision V5.1
                  </SelectItem>
                  <SelectItem value="runwayml/stable-diffusion-v1-5">
                    Stable Diffusion v1.5
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-prompt">Image Description</Label>
              <Textarea
                id="image-prompt"
                placeholder="Describe the image you want to generate... e.g., 'A modern tech workspace with a laptop, code on screen, and green terminal aesthetic'"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={handleGenerateImage} 
              disabled={isGenerating || !imagePrompt.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>

            {generatedImage && (
              <div className="space-y-2">
                <Label>Generated Image</Label>
                <div className="relative rounded-lg border overflow-hidden">
                  <img 
                    src={generatedImage} 
                    alt="Generated" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleCopyToClipboard(generatedImage)}
                    className="flex-1"
                  >
                    Copy Image URL
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(generatedImage, '_blank')}
                    className="flex-1"
                  >
                    Open in New Tab
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="content" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Content</CardTitle>
            <CardDescription>
              Create blog posts, case studies, or project descriptions using AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger id="content-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Blog Post</SelectItem>
                    <SelectItem value="case-study">Case Study</SelectItem>
                    <SelectItem value="project">Project Description</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-length">Length</Label>
                <Select value={contentLength} onValueChange={setContentLength}>
                  <SelectTrigger id="content-length">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-tone">Tone</Label>
              <Select value={contentTone} onValueChange={setContentTone}>
                <SelectTrigger id="content-tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-topic">Topic / Description</Label>
              <Textarea
                id="content-topic"
                placeholder="Enter the topic or description for your content... e.g., 'Building a modern portfolio with Next.js and TypeScript'"
                value={contentTopic}
                onChange={(e) => setContentTopic(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleGenerateContent} 
              disabled={isGenerating || !contentTopic.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>

            {generatedContent && (
              <div className="space-y-2">
                <Label>Generated Content</Label>
                <div className="relative">
                  <Textarea
                    value={generatedContent}
                    readOnly
                    rows={15}
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopyToClipboard(generatedContent)}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="enhance" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Enhancement</CardTitle>
            <CardDescription>
              Enhance existing content with SEO optimization, grammar checks, and more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Content enhancement tools coming soon!</p>
              <p className="text-sm mt-2">
                This will include SEO optimization, grammar checking, and content improvement suggestions.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

