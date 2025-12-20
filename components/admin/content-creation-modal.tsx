'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Sparkles, Image as ImageIcon, Save, Eye } from 'lucide-react'
import MDXEditor from '@/components/admin/mdx-editor'
import { useAutoSave } from '@/hooks/use-auto-save'
import SaveStatusIndicator from '@/components/admin/save-status-indicator'

type ContentType = 'blog' | 'case-study' | 'resource' | 'project'

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics: string[]
  stars: number
  forks: number
}

interface ContentCreationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  repo?: GitHubRepo | null
  contentType?: ContentType
  initialData?: any // For editing existing content
}

// Validation schemas for each content type
const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, 'Content is required'),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'scheduled']).default('draft'),
  featured_image: z.string().optional().nullable(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
  published_at: z.string().optional().nullable(),
})

const caseStudySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  tech_stack: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'scheduled']).default('draft'),
  featured_image: z.string().optional(),
  problem_statement: z.string().optional(),
  solution_overview: z.string().optional(),
  challenges: z.array(z.string()).default([]),
  results: z.string().optional(),
  lessons_learned: z.array(z.string()).default([]),
  published_at: z.string().optional(),
})

const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  type: z.enum(['tool', 'course', 'book', 'article', 'video', 'other']).default('tool'),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'scheduled']).default('draft'),
  featured_image: z.string().optional(),
  published_at: z.string().optional(),
})

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  tech_stack: z.array(z.string()).default([]),
  homepage_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_featured: z.boolean().default(false),
  display_order: z.number().default(0),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured_image: z.string().optional(),
})

export default function ContentCreationModal({
  open,
  onOpenChange,
  repo,
  contentType = 'blog',
  initialData,
}: ContentCreationModalProps) {
  const [selectedType, setSelectedType] = useState<ContentType>(contentType)
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [generatingField, setGeneratingField] = useState<string | null>(null)
  const [readmeContent, setReadmeContent] = useState<string | null>(null)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  
  const isEditing = !!initialData

  // Get the appropriate schema based on content type
  const getSchema = () => {
    switch (selectedType) {
      case 'blog':
        return blogPostSchema
      case 'case-study':
        return caseStudySchema
      case 'resource':
        return resourceSchema
      case 'project':
        return projectSchema
      default:
        return blogPostSchema
    }
  }

  const form = useForm<any>({
    resolver: zodResolver(getSchema()) as any,
    defaultValues: getDefaultValues(),
    mode: 'onChange', // Validate on change for better UX
  })

  function getDefaultValues() {
    // If editing, use initial data
    if (initialData) {
      return {
        ...initialData,
        tags: initialData.tags || [],
        tech_stack: initialData.tech_stack || [],
        challenges: initialData.challenges || [],
        lessons_learned: initialData.lessons_learned || [],
      }
    }

    const baseDefaults = {
      status: 'draft' as const,
    }

    if (repo) {
      const slug = repo.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      switch (selectedType) {
        case 'blog':
          return {
            ...baseDefaults,
            title: repo.name,
            slug,
            excerpt: repo.description || '',
            content: `# ${repo.name}\n\n${repo.description || ''}\n\n## Overview\n\n`,
            category: '',
            tags: repo.topics || [],
            tech_stack: repo.language ? [repo.language] : [],
          }
        case 'case-study':
          return {
            ...baseDefaults,
            title: repo.name,
            slug,
            description: repo.description || '',
            content: `# ${repo.name}\n\n${repo.description || ''}\n\n`,
            tech_stack: repo.language ? [repo.language] : [],
            tags: repo.topics || [],
          }
        case 'resource':
          return {
            ...baseDefaults,
            title: repo.name,
            slug,
            description: repo.description || '',
            url: repo.homepage || repo.html_url || '',
            tags: repo.topics || [],
          }
        case 'project':
          return {
            ...baseDefaults,
            name: repo.name,
            description: repo.description || '',
            tech_stack: repo.language ? [repo.language] : [],
            homepage_url: repo.homepage || '',
            github_url: repo.html_url,
            is_featured: false,
            display_order: 0,
          }
        default:
          return baseDefaults
      }
    }

    // Default values when no repo
    switch (selectedType) {
      case 'blog':
        return {
          ...baseDefaults,
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          category: '',
          tags: [],
        }
      case 'case-study':
        return {
          ...baseDefaults,
          title: '',
          slug: '',
          description: '',
          content: '',
          tech_stack: [],
          tags: [],
        }
      case 'resource':
        return {
          ...baseDefaults,
          title: '',
          slug: '',
          description: '',
          url: '',
          type: 'tool' as const,
          category: '',
          tags: [],
        }
      case 'project':
        return {
          ...baseDefaults,
          name: '',
          description: '',
          tech_stack: [],
          homepage_url: '',
          github_url: '',
          is_featured: false,
          display_order: 0,
        }
    }
  }

  // Reset form when repo, content type, or initialData changes
  useEffect(() => {
    console.log('Form reset triggered:', { repo: !!repo, selectedType, hasInitialData: !!initialData })
    const defaultValues = getDefaultValues()
    console.log('Default values:', defaultValues)
    form.reset(defaultValues)
    if (initialData?.featured_image) {
      setGeneratedImageUrl(initialData.featured_image)
    } else {
      setGeneratedImageUrl(null)
    }
    if (!initialData) {
      setReadmeContent(null)
    }
  }, [repo, selectedType, initialData])

  // Fetch README when repo is available
  useEffect(() => {
    const fetchReadme = async () => {
      if (repo && repo.full_name) {
        try {
          // Get session token from client
          const { data: { session } } = await supabase.auth.getSession()
          const headers: HeadersInit = { 'Content-Type': 'application/json' }
          
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`
          }

          const response = await fetch('/api/admin/github/readme', {
            method: 'POST',
            headers,
            credentials: 'include', // Include cookies
            body: JSON.stringify({
              repoId: repo.id,
              fullName: repo.full_name,
              defaultBranch: 'main',
            }),
          })
          const data = await response.json()
          if (data.success && data.content) {
            setReadmeContent(data.content)
          } else if (data.error) {
            console.error('Error fetching README:', data.error)
          }
        } catch (error) {
          console.error('Error fetching README:', error)
        }
      }
    }
    fetchReadme()
  }, [repo])

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    form.setValue('title' as any, value)
    if (selectedType !== 'project') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      form.setValue('slug' as any, slug)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues('tags' as any) || []
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue('tags' as any, [...currentTags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues('tags' as any) || []
    form.setValue('tags' as any, currentTags.filter((t: string) => t !== tag))
  }

  const handleAddTechStack = (tech: string) => {
    if (tech.trim()) {
      const currentStack = form.getValues('tech_stack' as any) || []
      if (!currentStack.includes(tech.trim())) {
        form.setValue('tech_stack' as any, [...currentStack, tech.trim()])
      }
    }
  }

  const handleRemoveTechStack = (tech: string) => {
    const currentStack = form.getValues('tech_stack' as any) || []
    form.setValue('tech_stack' as any, currentStack.filter((t: string) => t !== tech))
  }

  const handleGenerateField = async (fieldType: 'all' | 'title' | 'excerpt' | 'content' | 'description' | 'seo' | 'problem' | 'solution' | 'results') => {
    if (!readmeContent && !repo?.description) {
      alert('README content is required. Please wait for it to load or ensure the repository has a description.')
      return
    }

    if (isGeneratingContent || generatingField) {
      return // Prevent multiple simultaneous generations
    }

    setGeneratingField(fieldType)
    setIsGeneratingContent(true)
    
    try {
      // Get session token from client
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
          readmeContent: readmeContent || repo?.description || '',
          contentType: selectedType,
          repoName: repo?.name || '',
          repoDescription: repo?.description || '',
          techStack: repo?.language ? [repo.language] : [],
          fieldType, // Specify which field to generate
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        // Handle quota errors specifically
        if (response.status === 429 || result.quotaExceeded || result.error?.includes('quota') || result.error?.includes('429')) {
          throw new Error('AI generation quota exceeded. Please wait a few minutes or check your API plan. You can still manually fill in the fields.')
        }
        throw new Error(result.error || 'Failed to generate content')
      }

      // Populate form with generated content based on field type
      if (result.data) {
        const generated = result.data
        
        if (fieldType === 'all' || fieldType === 'title') {
          if (selectedType === 'blog' || selectedType === 'case-study' || selectedType === 'resource') {
            if (generated.title) {
              form.setValue('title', generated.title)
              if (fieldType === 'title') return // Only generate title
            }
          } else if (selectedType === 'project') {
            if (generated.name) {
              form.setValue('name', generated.name)
              if (fieldType === 'title') return
            }
          }
        }

        if (fieldType === 'all' || fieldType === 'excerpt') {
          if (selectedType === 'blog' && generated.excerpt) {
            form.setValue('excerpt', generated.excerpt)
            if (fieldType === 'excerpt') return
          }
        }

        if (fieldType === 'all' || fieldType === 'description') {
          if ((selectedType === 'case-study' || selectedType === 'resource' || selectedType === 'project') && generated.description) {
            form.setValue('description', generated.description)
            if (fieldType === 'description') return
          }
        }

        if (fieldType === 'all' || fieldType === 'content') {
          if ((selectedType === 'blog' || selectedType === 'case-study') && generated.content) {
            form.setValue('content', generated.content)
            if (fieldType === 'content') return
          }
        }

        if (fieldType === 'all' || fieldType === 'seo') {
          if (selectedType === 'blog') {
            if (generated.seo_title) form.setValue('seo_title', generated.seo_title)
            if (generated.seo_description) form.setValue('seo_description', generated.seo_description)
            if (fieldType === 'seo') return
          }
        }

        if (fieldType === 'all' || fieldType === 'problem') {
          if (selectedType === 'case-study' && generated.problem_statement) {
            form.setValue('problem_statement', generated.problem_statement)
            if (fieldType === 'problem') return
          }
        }

        if (fieldType === 'all' || fieldType === 'solution') {
          if (selectedType === 'case-study' && generated.solution_overview) {
            form.setValue('solution_overview', generated.solution_overview)
            if (fieldType === 'solution') return
          }
        }

        if (fieldType === 'all' || fieldType === 'results') {
          if (selectedType === 'case-study' && generated.results) {
            form.setValue('results', generated.results)
            if (fieldType === 'results') return
          }
        }

        // For 'all', populate remaining fields
        if (fieldType === 'all') {
          if (selectedType === 'blog') {
            if (generated.category) form.setValue('category', generated.category)
            if (generated.tags) form.setValue('tags', generated.tags)
          } else if (selectedType === 'case-study') {
            if (generated.challenges) form.setValue('challenges', generated.challenges)
            if (generated.lessons_learned) form.setValue('lessons_learned', generated.lessons_learned)
            if (generated.tech_stack) form.setValue('tech_stack', generated.tech_stack)
          } else if (selectedType === 'resource') {
            if (generated.type) form.setValue('type', generated.type)
            if (generated.category) form.setValue('category', generated.category)
            if (generated.tags) form.setValue('tags', generated.tags)
          } else if (selectedType === 'project') {
            if (generated.tech_stack) form.setValue('tech_stack', generated.tech_stack)
          }
        }
      }
    } catch (error: any) {
      console.error('Error generating content:', error)
      const errorMessage = error.message || 'Failed to generate content'
      
      // Show user-friendly error message
      if (errorMessage.includes('quota')) {
        alert(`⚠️ ${errorMessage}\n\nTip: You can manually fill in the fields or wait a few minutes before trying again.`)
      } else {
        alert(`Failed to generate content: ${errorMessage}`)
      }
    } finally {
      setIsGeneratingContent(false)
      setGeneratingField(null)
    }
  }

  const handleGenerateImage = async () => {
    if (!readmeContent && !repo?.description) {
      alert('README content is required. Please wait for it to load or ensure the repository has a description.')
      return
    }

    setIsGeneratingImage(true)
    try {
      // Get session token from client
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch('/api/admin/ai/generate-image', {
        method: 'POST',
        headers,
        credentials: 'include', // Include cookies
        body: JSON.stringify({
          readmeContent: readmeContent || repo?.description || '',
          contentType: selectedType,
          repoName: repo?.name || '',
          repoDescription: repo?.description || '',
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        // Handle quota errors specifically
        if (response.status === 429 || result.quotaExceeded || result.error?.includes('quota') || result.error?.includes('429')) {
          throw new Error('AI generation quota exceeded. Please wait a few minutes or check your API plan. You can still manually add an image URL.')
        }
        throw new Error(result.error || 'Failed to generate image')
      }

      // Set the generated image URL
      if (result.imageUrl) {
        form.setValue('featured_image' as any, result.imageUrl)
        setGeneratedImageUrl(result.imageUrl) // Store for preview
      }

      alert(`Image generated successfully! Description: ${result.imageDescription}`)
    } catch (error: any) {
      console.error('Error generating image:', error)
      const errorMessage = error.message || 'Failed to generate image'
      
      // Show user-friendly error message
      if (errorMessage.includes('quota')) {
        alert(`⚠️ ${errorMessage}\n\nTip: You can manually add an image URL or wait a few minutes before trying again.`)
      } else {
        alert(`Failed to generate image: ${errorMessage}`)
      }
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Auto-save function for drafts
  const handleAutoSave = async (data: any) => {
    // Only auto-save drafts, not published content
    if (data.status !== 'draft') return

    try {
      const endpointMap: Record<ContentType, string> = {
        'blog': '/api/admin/content/blog',
        'case-study': '/api/admin/content/case-studies',
        'resource': '/api/admin/content/resources',
        'project': '/api/admin/content/projects',
      }

      let endpoint = endpointMap[selectedType]
      let method = 'POST'

      if (isEditing && initialData?.id) {
        endpoint = `${endpoint}/${initialData.id}`
        method = 'PUT'
      }

      const cleanedData = { ...data }
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === '') {
          if (['excerpt', 'category', 'seo_title', 'seo_description', 'published_at', 'description', 'url', 'homepage_url', 'featured_image'].includes(key)) {
            cleanedData[key] = null
          } else {
            delete cleanedData[key]
          }
        }
      })

      const payload = {
        ...cleanedData,
        status: 'draft', // Always save as draft for auto-save
        github_repo_id: repo?.id || initialData?.github_repo_id,
      }

      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      await fetch(endpoint, {
        method,
        headers,
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      setSaveError(null)
    } catch (error: any) {
      console.error('Auto-save error:', error)
      setSaveError(error)
      throw error
    }
  }

  // Watch form status for auto-save enablement
  const formStatus = form.watch('status')
  const isDraft = formStatus === 'draft'
  const formValues = form.watch() // Watch all form values for auto-save

  // Auto-save hook
  const { getSaveStatus } = useAutoSave({
    data: formValues,
    onSave: handleAutoSave,
    interval: 30000, // 30 seconds
    enabled: open && (isEditing || isDraft), // Only enable for drafts
    onSaveError: (error) => {
      console.error('Auto-save failed:', error)
      setSaveError(error)
    },
  })

  const saveStatus = getSaveStatus()

  const onSubmit = async (data: any) => {
    console.log('=== FORM SUBMISSION STARTED ===')
    console.log('Form data:', data)
    console.log('Form errors:', form.formState.errors)
    console.log('Is editing:', isEditing)
    console.log('Initial data:', initialData)
    console.log('Selected type:', selectedType)
    
    // Clean up the data before validation check
    // Convert empty strings to null/undefined for optional fields
    const cleanedData = { ...data }
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === '') {
        // For optional fields, set to null
        if (['excerpt', 'category', 'seo_title', 'seo_description', 'published_at', 'description', 'url', 'homepage_url', 'featured_image'].includes(key)) {
          cleanedData[key] = null
        } else {
          delete cleanedData[key]
        }
      }
    })
    
    // If status is published and published_at is not set, set it to now
    if (cleanedData.status === 'published' && !cleanedData.published_at) {
      cleanedData.published_at = new Date().toISOString()
    }
    
    // Check for form validation errors after cleanup
    const errors = form.formState.errors
    if (Object.keys(errors).length > 0) {
      console.error('Form validation errors:', errors)
      // Try to clear published_at error if it's just about empty string
      if (errors.published_at && cleanedData.status === 'published') {
        form.clearErrors('published_at')
        // Update the form value
        form.setValue('published_at', cleanedData.published_at, { shouldValidate: false })
      } else {
        alert('Please fix the form errors before saving. Check the fields marked with errors.')
        return
      }
    }

    setIsSubmitting(true)
    console.log('Setting isSubmitting to true')
    try {
      // Map content type to endpoint
      const endpointMap: Record<ContentType, string> = {
        'blog': '/api/admin/content/blog',
        'case-study': '/api/admin/content/case-studies',
        'resource': '/api/admin/content/resources',
        'project': '/api/admin/content/projects',
      }
      
      let endpoint = endpointMap[selectedType]
      let method = 'POST'
      
      // If editing, use PUT method and append ID to endpoint
      if (isEditing && initialData?.id) {
        endpoint = `${endpoint}/${initialData.id}`
        method = 'PUT'
      }
      
      // Use cleanedData instead of data
      const payload = {
        ...cleanedData,
        github_repo_id: repo?.id || initialData?.github_repo_id,
      }

      // For projects, ensure github_url is always provided
      if (selectedType === 'project') {
        // If github_url is empty or missing, use repo's html_url as fallback
        if (!payload.github_url || payload.github_url === '') {
          payload.github_url = repo?.html_url || initialData?.github_url || ''
        }
        // Ensure github_url is never removed or null for projects
        if (!payload.github_url) {
          throw new Error('GitHub URL is required for projects. Please provide a valid GitHub URL.')
        }
      }

      console.log('Submitting payload:', { endpoint, method, payload })

      // Clean up payload: remove undefined, convert empty strings to null for optional fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key]
        } else if (payload[key] === '' && ['excerpt', 'category', 'seo_title', 'seo_description', 'published_at', 'description', 'url', 'homepage_url'].includes(key)) {
          // Convert empty strings to null for optional fields
          payload[key] = null
        } else if (payload[key] === '' && key !== 'github_url') {
          // Remove empty strings for other fields (except github_url which is required for projects)
          delete payload[key]
        }
      })

      // If status is published and published_at is not set, set it to now
      if (payload.status === 'published' && !payload.published_at) {
        payload.published_at = new Date().toISOString()
      }

      // Get session token for authentication
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch(endpoint, {
        method,
        headers,
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      console.log('Response:', { status: response.status, result })

      if (!response.ok) {
        const errorMessage = result.error || result.message || 'Failed to save content'
        console.error('Save failed:', errorMessage)
        throw new Error(errorMessage)
      }

      // Success - close modal and refresh
      console.log('Save successful!')
      onOpenChange(false)
      form.reset()
      // Use router refresh instead of window.reload
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    } catch (error: any) {
      console.error('Error saving content:', error)
      const errorMessage = error.message || 'Unknown error occurred'
      alert(`Failed to save: ${errorMessage}\n\nCheck the browser console for more details.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{isEditing ? 'Edit Content' : 'Create Content'}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? `Edit ${selectedType === 'blog' ? 'blog post' : selectedType === 'case-study' ? 'case study' : selectedType === 'resource' ? 'resource' : 'project'}`
                  : repo
                  ? `Create content from repository: ${repo.name}`
                  : 'Create new content'}
              </DialogDescription>
            </div>
            {(isEditing || formValues.status === 'draft') && (
              <SaveStatusIndicator
                isSaving={saveStatus.isSaving}
                hasUnsavedChanges={saveStatus.hasUnsavedChanges}
                lastSave={saveStatus.lastSave}
                error={saveError}
              />
            )}
          </div>
        </DialogHeader>

        <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as ContentType)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="blog">Blog Post</TabsTrigger>
            <TabsTrigger value="case-study">Case Study</TabsTrigger>
            <TabsTrigger value="resource">Resource</TabsTrigger>
            <TabsTrigger value="project">Project</TabsTrigger>
          </TabsList>

          <ScrollArea className="max-h-[60vh] pr-4 mt-4">
            <form 
              onSubmit={form.handleSubmit(
                (data) => {
                  console.log('=== FORM VALIDATION PASSED ===')
                  console.log('Validated data:', data)
                  onSubmit(data)
                },
                (errors) => {
                  console.log('=== FORM VALIDATION FAILED ===')
                  console.log('Validation errors:', errors)
                  const formValues = form.getValues()
                  // If the only error is published_at and status is published, auto-fix it
                  const errorKeys = Object.keys(errors)
                  if (errorKeys.length === 1 && errorKeys[0] === 'published_at' && formValues.status === 'published') {
                    console.log('Auto-fixing published_at error...')
                    const fixedPublishedAt = new Date().toISOString()
                    form.setValue('published_at', fixedPublishedAt, { shouldValidate: false })
                    // Clear the error
                    form.clearErrors('published_at')
                    // Retry submission
                    setTimeout(() => {
                      form.handleSubmit(onSubmit)()
                    }, 100)
                  } else {
                    console.error('Form validation errors:', errors)
                    alert('Please fix the form errors before saving. Check the fields marked with errors.')
                  }
                }
              )} 
              className="space-y-6"
            >
              {/* Content Type Specific Forms */}
              {selectedType === 'blog' && (
                <TabsContent value="blog" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        {...form.register('title')}
                        onChange={(e) => handleTitleChange(e.target.value)}
                      />
                      {form.formState.errors.title && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.title.message as string}
                        </p>
                      )}
                    </div>
                    {repo && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleGenerateField('title')}
                        disabled={isGeneratingContent}
                        className="ml-4"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {generatingField === 'title' ? 'Generating...' : 'Generate Title'}
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input id="slug" {...form.register('slug')} />
                    {form.formState.errors.slug && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.slug.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      {repo && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateField('excerpt')}
                          disabled={isGeneratingContent}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {generatingField === 'excerpt' ? 'Generating...' : 'AI Generate'}
                        </Button>
                      )}
                    </div>
                    <Textarea
                      id="excerpt"
                      {...form.register('excerpt')}
                      rows={3}
                      placeholder="Brief description of the blog post"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="content">Content *</Label>
                      {repo && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateField('content')}
                          disabled={isGeneratingContent}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {generatingField === 'content' ? 'Generating...' : 'AI Generate'}
                        </Button>
                      )}
                    </div>
                    <MDXEditor
                      value={form.watch('content') || ''}
                      onChange={(value) => form.setValue('content', value || '', { shouldValidate: true })}
                      placeholder="Write your blog post content in Markdown/MDX format..."
                      minHeight={400}
                    />
                    {form.formState.errors.content && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.content.message as string}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input id="category" {...form.register('category')} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={form.watch('status') || 'draft'}
                        onValueChange={(value) => {
                          console.log('Status changed to:', value)
                          form.setValue('status', value as any, { shouldValidate: true })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.status && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.status.message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                        placeholder="Add a tag and press Enter"
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(form.watch('tags') || []).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                          {tag}
                          <X className="ml-1 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="featured_image">Featured Image URL</Label>
                      {repo && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleGenerateImage}
                          disabled={isGeneratingImage}
                        >
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {isGeneratingImage ? 'Generating...' : 'Generate Image'}
                        </Button>
                      )}
                    </div>
                    <Input 
                      id="featured_image" 
                      {...form.register('featured_image')}
                      onChange={(e) => {
                        form.setValue('featured_image', e.target.value)
                        // Update preview when manually changed
                        if (e.target.value) {
                          setGeneratedImageUrl(e.target.value)
                        }
                      }}
                    />
                    {/* Image Preview */}
                    {form.watch('featured_image') && (
                      <div className="mt-2">
                        <img
                          src={form.watch('featured_image')}
                          alt="Featured image preview"
                          className="w-full h-auto rounded-md border border-gray-200 max-h-64 object-contain bg-gray-50"
                          onError={(e) => {
                            // If image fails to load, hide the preview
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="seo_title">SEO Title</Label>
                        {repo && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerateField('seo')}
                            disabled={isGeneratingContent}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            {generatingField === 'seo' ? 'Generating...' : 'AI Generate'}
                          </Button>
                        )}
                      </div>
                      <Input id="seo_title" {...form.register('seo_title')} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seo_description">SEO Description</Label>
                      <Textarea
                        id="seo_description"
                        {...form.register('seo_description')}
                        rows={2}
                      />
                    </div>
                  </div>
                </TabsContent>
              )}

              {selectedType === 'case-study' && (
                <TabsContent value="case-study" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        {...form.register('title')}
                        onChange={(e) => handleTitleChange(e.target.value)}
                      />
                    </div>
                    {repo && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleGenerateField('title')}
                        disabled={isGeneratingContent}
                        className="ml-4"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {generatingField === 'title' ? 'Generating...' : 'Generate Title'}
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input id="slug" {...form.register('slug')} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="description">Description</Label>
                      {repo && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateField('description')}
                          disabled={isGeneratingContent}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {generatingField === 'description' ? 'Generating...' : 'AI Generate'}
                        </Button>
                      )}
                    </div>
                    <Textarea id="description" {...form.register('description')} rows={3} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="content">Content *</Label>
                      {repo && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateField('content')}
                          disabled={isGeneratingContent}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {generatingField === 'content' ? 'Generating...' : 'AI Generate'}
                        </Button>
                      )}
                    </div>
                    <MDXEditor
                      value={form.watch('content') || ''}
                      onChange={(value) => form.setValue('content', value || '', { shouldValidate: true })}
                      placeholder="Write your case study content in Markdown/MDX format..."
                      minHeight={400}
                    />
                    {form.formState.errors.content && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.content.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Tech Stack</Label>
                    {repo?.language && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTechStack(repo.language!)}
                        className="mb-2"
                      >
                        Add {repo.language}
                      </Button>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(form.watch('tech_stack') || []).map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTechStack(tech)}>
                          {tech}
                          <X className="ml-1 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="problem_statement">Problem Statement</Label>
                      {repo && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateField('problem')}
                          disabled={isGeneratingContent}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {generatingField === 'problem' ? 'Generating...' : 'AI Generate'}
                        </Button>
                      )}
                    </div>
                    <Textarea id="problem_statement" {...form.register('problem_statement')} rows={3} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="solution_overview">Solution Overview</Label>
                      {repo && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateField('solution')}
                          disabled={isGeneratingContent}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {generatingField === 'solution' ? 'Generating...' : 'AI Generate'}
                        </Button>
                      )}
                    </div>
                    <Textarea id="solution_overview" {...form.register('solution_overview')} rows={3} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="results">Results</Label>
                      {repo && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateField('results')}
                          disabled={isGeneratingContent}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {generatingField === 'results' ? 'Generating...' : 'AI Generate'}
                        </Button>
                      )}
                    </div>
                    <Textarea id="results" {...form.register('results')} rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={form.watch('status')}
                      onValueChange={(value) => form.setValue('status', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              )}

              {selectedType === 'resource' && (
                <TabsContent value="resource" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        {...form.register('title')}
                        onChange={(e) => handleTitleChange(e.target.value)}
                      />
                    </div>
                    {repo && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleGenerateField('title')}
                        disabled={isGeneratingContent}
                        className="ml-4"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {generatingField === 'title' ? 'Generating...' : 'Generate Title'}
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input id="slug" {...form.register('slug')} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="description">Description</Label>
                      {repo && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateField('description')}
                          disabled={isGeneratingContent}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {generatingField === 'description' ? 'Generating...' : 'AI Generate'}
                        </Button>
                      )}
                    </div>
                    <Textarea id="description" {...form.register('description')} rows={3} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="url">URL</Label>
                      <Input id="url" {...form.register('url')} type="url" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={form.watch('type')}
                        onValueChange={(value) => form.setValue('type', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tool">Tool</SelectItem>
                          <SelectItem value="course">Course</SelectItem>
                          <SelectItem value="book">Book</SelectItem>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" {...form.register('category')} />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                        placeholder="Add a tag and press Enter"
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(form.watch('tags') || []).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                          {tag}
                          <X className="ml-1 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={form.watch('status')}
                      onValueChange={(value) => form.setValue('status', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              )}

              {selectedType === 'project' && (
                <TabsContent value="project" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" {...form.register('name')} />
                    </div>
                    {repo && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleGenerateField('title')}
                        disabled={isGeneratingContent}
                        className="ml-4"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {generatingField === 'title' ? 'Generating...' : 'Generate Name'}
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="description">Description</Label>
                      {repo && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateField('description')}
                          disabled={isGeneratingContent}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {generatingField === 'description' ? 'Generating...' : 'AI Generate'}
                        </Button>
                      )}
                    </div>
                    <Textarea id="description" {...form.register('description')} rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label>Tech Stack</Label>
                    {repo?.language && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTechStack(repo.language!)}
                        className="mb-2"
                      >
                        Add {repo.language}
                      </Button>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(form.watch('tech_stack') || []).map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTechStack(tech)}>
                          {tech}
                          <X className="ml-1 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="homepage_url">Homepage URL</Label>
                      <Input id="homepage_url" {...form.register('homepage_url')} type="url" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github_url">GitHub URL *</Label>
                      <Input id="github_url" {...form.register('github_url')} type="url" disabled={!!repo} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="is_featured">Featured</Label>
                      <Select
                        value={form.watch('is_featured') ? 'true' : 'false'}
                        onValueChange={(value) => form.setValue('is_featured', value === 'true')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="false">No</SelectItem>
                          <SelectItem value="true">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="display_order">Display Order</Label>
                      <Input
                        id="display_order"
                        type="number"
                        {...form.register('display_order', { valueAsNumber: true })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={form.watch('status')}
                        onValueChange={(value) => form.setValue('status', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  onClick={(e) => {
                    console.log('=== SAVE BUTTON CLICKED ===')
                    console.log('Form values:', form.getValues())
                    console.log('Form errors:', form.formState.errors)
                    console.log('Is submitting:', isSubmitting)
                    // Don't prevent default - let form submission happen
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Content'}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

