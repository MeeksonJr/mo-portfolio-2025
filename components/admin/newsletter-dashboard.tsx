'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import {
  Mail,
  Plus,
  Send,
  Save,
  Wand2,
  Image as ImageIcon,
  Eye,
  Trash2,
  Calendar,
  Users,
  TrendingUp,
  Loader2,
  Upload,
  X,
  Sparkles,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'

interface NewsletterCampaign {
  id: string
  title: string
  subject: string
  content_html: string
  content_text?: string
  preview_text?: string
  featured_image_url?: string
  images?: string[]
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled'
  scheduled_at?: string
  sent_at?: string
  sent_to_count: number
  opened_count: number
  clicked_count: number
  content_type?: string
  content_id?: string
  created_at: string
}

export default function NewsletterDashboard() {
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('campaigns')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content_html: '',
    content_text: '',
    preview_text: '',
    featured_image_url: '',
    images: [] as string[],
    content_type: 'custom' as 'blog' | 'project' | 'case-study' | 'music' | 'custom',
    content_id: '',
    auto_send: false,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Load campaigns and subscriber count
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Load campaigns
      const campaignsResponse = await fetch('/api/admin/newsletter/campaigns', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json()
        setCampaigns(campaignsData.campaigns || [])
      }

      // Load subscriber count
      const subscribersResponse = await fetch('/api/admin/newsletter/subscribers/count', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      if (subscribersResponse.ok) {
        const subscribersData = await subscribersResponse.json()
        setSubscriberCount(subscribersData.count || 0)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load newsletter data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSaveDraft = async () => {
    if (!formData.title || !formData.subject || !formData.content_html) {
      toast.error('Please fill in title, subject, and content')
      return
    }

    setIsSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch('/api/admin/newsletter/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...formData,
          status: 'draft',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save draft')
      }

      toast.success('Draft saved successfully!')
      setShowCreateModal(false)
      resetForm()
      loadData()
    } catch (error: any) {
      console.error('Error saving draft:', error)
      toast.error(error.message || 'Failed to save draft')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSend = async () => {
    if (!formData.title || !formData.subject || !formData.content_html) {
      toast.error('Please fill in title, subject, and content')
      return
    }

    if (!confirm(`Send newsletter to ${subscriberCount} subscribers?`)) {
      return
    }

    setIsSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send newsletter')
      }

      toast.success('Newsletter sent successfully!')
      setShowCreateModal(false)
      resetForm()
      loadData()
    } catch (error: any) {
      console.error('Error sending newsletter:', error)
      toast.error(error.message || 'Failed to send newsletter')
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerateContent = async () => {
    if (!formData.title) {
      toast.error('Please enter a title first')
      return
    }

    setIsGenerating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch('/api/admin/newsletter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          subject: formData.subject,
          content_type: formData.content_type,
          content_id: formData.content_id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate content')
      }

      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        content_html: data.content_html || prev.content_html,
        content_text: data.content_text || prev.content_text,
        preview_text: data.preview_text || prev.preview_text,
        subject: data.subject || prev.subject,
      }))
      toast.success('Content generated successfully!')
    } catch (error: any) {
      console.error('Error generating content:', error)
      toast.error(error.message || 'Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
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
      formData.append('file', file)
      formData.append('type', 'newsletter')

      const response = await fetch('/api/admin/newsletter/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload image')
      }

      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        featured_image_url: data.url,
        images: [...(prev.images || []), data.url],
      }))
      toast.success('Image uploaded successfully!')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      content_html: '',
      content_text: '',
      preview_text: '',
      featured_image_url: '',
      images: [],
      content_type: 'custom',
      content_id: '',
      auto_send: false,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-500/10 text-green-600'
      case 'sending':
        return 'bg-blue-500/10 text-blue-600'
      case 'scheduled':
        return 'bg-yellow-500/10 text-yellow-600'
      case 'draft':
        return 'bg-gray-500/10 text-gray-600'
      default:
        return 'bg-red-500/10 text-red-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and send newsletters to your subscribers
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus size={20} />
          Create Newsletter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Subscribers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {subscriberCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Draft Campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter((c) => c.status === 'draft').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sent Campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter((c) => c.status === 'sent').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Open Rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {campaigns.filter((c) => c.status === 'sent').length > 0
                ? Math.round(
                    (campaigns
                      .filter((c) => c.status === 'sent')
                      .reduce((acc, c) => acc + (c.opened_count / Math.max(c.sent_to_count, 1)) * 100, 0) /
                      campaigns.filter((c) => c.status === 'sent').length) *
                      100
                  ) / 100
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
          <CardDescription>Manage your newsletter campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="mx-auto animate-spin text-primary" size={32} />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="mx-auto mb-2" size={32} />
              <p>No campaigns yet. Create your first newsletter!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{campaign.title}</h3>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{campaign.subject}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {campaign.sent_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(campaign.sent_at).toLocaleDateString()}
                        </span>
                      )}
                      {campaign.status === 'sent' && (
                        <>
                          <span>Sent: {campaign.sent_to_count}</span>
                          <span>Opened: {campaign.opened_count}</span>
                          <span>Clicked: {campaign.clicked_count}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {campaign.status === 'draft' && (
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Newsletter Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Create Newsletter</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
              >
                <X size={20} />
              </Button>
            </div>

            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <Select
                    value={formData.content_type}
                    onValueChange={(value: any) =>
                      setFormData((prev) => ({ ...prev, content_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Custom Newsletter</SelectItem>
                      <SelectItem value="blog">Blog Post</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="case-study">Case Study</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Newsletter title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, subject: e.target.value }))
                    }
                    placeholder="Email subject line"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Content (HTML) *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateContent}
                      disabled={isGenerating || !formData.title}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate with AI
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    value={formData.content_html}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, content_html: e.target.value }))
                    }
                    placeholder="Newsletter content (HTML)"
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preview Text</Label>
                  <Input
                    value={formData.preview_text}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, preview_text: e.target.value }))
                    }
                    placeholder="Preview text shown in email clients"
                  />
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-4">
                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="flex-1"
                    />
                    {uploadingImage && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                  </div>
                  {formData.featured_image_url && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <Image
                        src={formData.featured_image_url}
                        alt="Featured"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <div className="border rounded-lg p-4 bg-background">
                  <h3 className="font-semibold mb-2">{formData.subject || 'Subject'}</h3>
                  {formData.featured_image_url && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={formData.featured_image_url}
                        alt="Featured"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div
                    dangerouslySetInnerHTML={{ __html: formData.content_html || '<p>No content yet</p>' }}
                    className="prose prose-sm max-w-none"
                  />
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-send on publish</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically send newsletter when content is published
                    </p>
                  </div>
                  <Switch
                    checked={formData.auto_send}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, auto_send: checked }))
                    }
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleSaveDraft}
                disabled={isSaving}
                variant="outline"
                className="flex-1"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </>
                )}
              </Button>
              <Button
                onClick={handleSend}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send to {subscriberCount} Subscribers
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

