'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Plus, Trash2, Edit, Copy, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { adminNotificationManager } from '@/lib/notifications/admin-notifications'

interface ContentTemplate {
  id: string
  name: string
  description: string | null
  content_type: 'blog' | 'case-study' | 'resource' | 'project'
  template_data: {
    title?: string
    excerpt?: string
    content?: string
    tags?: string[]
    category?: string
    metadata?: Record<string, any>
  }
  created_at: string
  updated_at: string
}

interface ContentTemplatesProps {
  contentType: 'blog' | 'case-study' | 'resource' | 'project'
  onSelectTemplate?: (template: ContentTemplate) => void
}

export default function ContentTemplates({
  contentType,
  onSelectTemplate,
}: ContentTemplatesProps) {
  const [templates, setTemplates] = useState<ContentTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTemplate, setEditTemplate] = useState<ContentTemplate | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [templateData, setTemplateData] = useState<ContentTemplate['template_data']>({
    title: '',
    excerpt: '',
    content: '',
    tags: [],
    category: '',
    metadata: {},
  })

  useEffect(() => {
    if (dialogOpen) {
      fetchTemplates()
    }
  }, [dialogOpen, contentType])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch(
        `/api/admin/content/templates?content_type=${contentType}`,
        {
          headers,
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch templates')
      }

      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Template name is required')
      return
    }

    setIsSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const url = editTemplate
        ? `/api/admin/content/templates/${editTemplate.id}`
        : '/api/admin/content/templates'
      const method = editTemplate ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers,
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          content_type: contentType,
          template_data: templateData,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save template')
      }

      toast.success(editTemplate ? 'Template updated' : 'Template created')
      adminNotificationManager.success(
        editTemplate ? 'Template Updated' : 'Template Created',
        `Template "${name}" has been ${editTemplate ? 'updated' : 'created'}`
      )
      
      setDialogOpen(false)
      resetForm()
      fetchTemplates()
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save template')
      adminNotificationManager.error(
        'Save Failed',
        'Failed to save template. Please try again.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch(`/api/admin/content/templates/${templateId}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete template')
      }

      toast.success('Template deleted')
      adminNotificationManager.success('Template Deleted', 'Template has been deleted')
      fetchTemplates()
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Failed to delete template')
      adminNotificationManager.error(
        'Delete Failed',
        'Failed to delete template. Please try again.'
      )
    }
  }

  const handleEdit = (template: ContentTemplate) => {
    setEditTemplate(template)
    setName(template.name)
    setDescription(template.description || '')
    setTemplateData(template.template_data)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setEditTemplate(null)
    resetForm()
    setDialogOpen(true)
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setTemplateData({
      title: '',
      excerpt: '',
      content: '',
      tags: [],
      category: '',
      metadata: {},
    })
    setEditTemplate(null)
  }

  const handleSelect = (template: ContentTemplate) => {
    onSelectTemplate?.(template)
    setDialogOpen(false)
    toast.success(`Template "${template.name}" selected`)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleCreate}>
          <FileText className="h-4 w-4 mr-2" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Templates
            </span>
            <Button onClick={handleCreate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTitle>
          <DialogDescription>
            Create and manage reusable content templates for {contentType}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Template List */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Saved Templates</h3>
              <ScrollArea className="h-[500px]">
                {templates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No templates yet</p>
                    <p className="text-xs mt-2">Create your first template to get started</p>
                  </div>
                ) : (
                  <div className="space-y-2 pr-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{template.name}</h4>
                            {template.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {template.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {template.content_type}
                              </Badge>
                              {template.template_data.tags && template.template_data.tags.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {template.template_data.tags.length} tags
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleSelect(template)}
                              title="Use template"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(template)}
                              title="Edit template"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDelete(template.id)}
                              title="Delete template"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Template Editor */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">
                {editTemplate ? 'Edit Template' : 'Create Template'}
              </h3>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name *</Label>
                    <Input
                      id="template-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Technical Blog Post Template"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-description">Description</Label>
                    <Textarea
                      id="template-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of this template..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-title">Title</Label>
                    <Input
                      id="template-title"
                      value={templateData.title || ''}
                      onChange={(e) =>
                        setTemplateData({ ...templateData, title: e.target.value })
                      }
                      placeholder="Template title..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-excerpt">Excerpt</Label>
                    <Textarea
                      id="template-excerpt"
                      value={templateData.excerpt || ''}
                      onChange={(e) =>
                        setTemplateData({ ...templateData, excerpt: e.target.value })
                      }
                      placeholder="Template excerpt..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-content">Content</Label>
                    <Textarea
                      id="template-content"
                      value={templateData.content || ''}
                      onChange={(e) =>
                        setTemplateData({ ...templateData, content: e.target.value })
                      }
                      placeholder="Template content (markdown supported)..."
                      rows={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-category">Category</Label>
                    <Input
                      id="template-category"
                      value={templateData.category || ''}
                      onChange={(e) =>
                        setTemplateData({ ...templateData, category: e.target.value })
                      }
                      placeholder="Template category..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-tags">Tags (comma-separated)</Label>
                    <Input
                      id="template-tags"
                      value={templateData.tags?.join(', ') || ''}
                      onChange={(e) =>
                        setTemplateData({
                          ...templateData,
                          tags: e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter((t) => t.length > 0),
                        })
                      }
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSave} disabled={isSaving || !name.trim()} className="flex-1">
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          {editTemplate ? 'Update' : 'Create'} Template
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false)
                        resetForm()
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

