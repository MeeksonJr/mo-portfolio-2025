'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Star, Plus, Edit, Trash2, Check, X, Search, Filter } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'

interface Testimonial {
  id: string
  client_name: string
  client_title?: string
  client_company?: string
  client_avatar_url?: string
  client_email?: string
  rating: number
  testimonial_text: string
  project_id?: string
  project_name?: string
  testimonial_type: 'client' | 'colleague' | 'mentor' | 'student'
  status: 'pending' | 'approved' | 'rejected'
  is_featured: boolean
  display_order: number
  video_url?: string
  linkedin_url?: string
  twitter_url?: string
  website_url?: string
  created_at: string
}

export default function TestimonialsTable() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

  // Form state
  const [formData, setFormData] = useState<{
    client_name: string
    client_title: string
    client_company: string
    client_avatar_url: string
    client_email: string
    rating: number
    testimonial_text: string
    project_name: string
    testimonial_type: 'client' | 'colleague' | 'mentor' | 'student'
    status: 'pending' | 'approved' | 'rejected'
    is_featured: boolean
    display_order: number
    video_url: string
    linkedin_url: string
    twitter_url: string
    website_url: string
  }>({
    client_name: '',
    client_title: '',
    client_company: '',
    client_avatar_url: '',
    client_email: '',
    rating: 5,
    testimonial_text: '',
    project_name: '',
    testimonial_type: 'client',
    status: 'pending',
    is_featured: false,
    display_order: 0,
    video_url: '',
    linkedin_url: '',
    twitter_url: '',
    website_url: '',
  })

  useEffect(() => {
    loadTestimonials()
  }, [statusFilter])

  const loadTestimonials = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const url = statusFilter === 'all'
        ? '/api/admin/testimonials'
        : `/api/admin/testimonials?status=${statusFilter}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to load testimonials')

      const { data } = await response.json()
      setTestimonials(data || [])
    } catch (error: any) {
      console.error('Error loading testimonials:', error)
      toast.error('Failed to load testimonials')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingTestimonial(null)
    setFormData({
      client_name: '',
      client_title: '',
      client_company: '',
      client_avatar_url: '',
      client_email: '',
      rating: 5,
      testimonial_text: '',
      project_name: '',
      testimonial_type: 'client' as 'client' | 'colleague' | 'mentor' | 'student',
      status: 'pending' as 'pending' | 'approved' | 'rejected',
      is_featured: false,
      display_order: 0,
      video_url: '',
      linkedin_url: '',
      twitter_url: '',
      website_url: '',
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      client_name: testimonial.client_name,
      client_title: testimonial.client_title || '',
      client_company: testimonial.client_company || '',
      client_avatar_url: testimonial.client_avatar_url || '',
      client_email: testimonial.client_email || '',
      rating: testimonial.rating,
      testimonial_text: testimonial.testimonial_text,
      project_name: testimonial.project_name || '',
      testimonial_type: testimonial.testimonial_type,
      status: testimonial.status,
      is_featured: testimonial.is_featured,
      display_order: testimonial.display_order,
      video_url: testimonial.video_url || '',
      linkedin_url: testimonial.linkedin_url || '',
      twitter_url: testimonial.twitter_url || '',
      website_url: testimonial.website_url || '',
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

      const url = editingTestimonial
        ? `/api/admin/testimonials/${editingTestimonial.id}`
        : '/api/admin/testimonials'

      const method = editingTestimonial ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save testimonial')

      toast.success(editingTestimonial ? 'Testimonial updated' : 'Testimonial created')
      setIsDialogOpen(false)
      await loadTestimonials()
    } catch (error: any) {
      console.error('Error saving testimonial:', error)
      toast.error('Failed to save testimonial')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to delete testimonial')

      toast.success('Testimonial deleted')
      await loadTestimonials()
    } catch (error: any) {
      console.error('Error deleting testimonial:', error)
      toast.error('Failed to delete testimonial')
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in')
        return
      }

      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ status: 'approved' }),
      })

      if (!response.ok) throw new Error('Failed to approve testimonial')

      toast.success('Testimonial approved')
      await loadTestimonials()
    } catch (error: any) {
      console.error('Error approving testimonial:', error)
      toast.error('Failed to approve testimonial')
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'
        }`}
      />
    ))
  }

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.testimonial_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.client_company?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Testimonials</h1>
          <p className="text-muted-foreground">Manage client testimonials and reviews</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search testimonials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filteredTestimonials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No testimonials found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {testimonial.client_avatar_url ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.client_avatar_url}
                          alt={testimonial.client_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold">
                          {testimonial.client_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{testimonial.client_name}</h3>
                        <Badge
                          variant={
                            testimonial.status === 'approved'
                              ? 'default'
                              : testimonial.status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {testimonial.status}
                        </Badge>
                        {testimonial.is_featured && (
                          <Badge variant="outline">Featured</Badge>
                        )}
                      </div>
                      {testimonial.client_title && (
                        <p className="text-sm text-muted-foreground">
                          {testimonial.client_title}
                          {testimonial.client_company && ` at ${testimonial.client_company}`}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {renderStars(testimonial.rating)}
                        <span className="text-sm text-muted-foreground">
                          {testimonial.testimonial_type}
                        </span>
                      </div>
                      <p className="text-sm mt-2 line-clamp-2">{testimonial.testimonial_text}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {testimonial.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(testimonial.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(testimonial)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(testimonial.id)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? 'Edit Testimonial' : 'Create Testimonial'}
            </DialogTitle>
            <DialogDescription>
              {editingTestimonial
                ? 'Update testimonial details'
                : 'Add a new client testimonial'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_name">Client Name *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating *</Label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(v) => setFormData({ ...formData, rating: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <SelectItem key={r} value={r.toString()}>
                        {r} Stars
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_title">Client Title</Label>
                <Input
                  id="client_title"
                  value={formData.client_title}
                  onChange={(e) => setFormData({ ...formData, client_title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="client_company">Company</Label>
                <Input
                  id="client_company"
                  value={formData.client_company}
                  onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="testimonial_text">Testimonial Text *</Label>
              <Textarea
                id="testimonial_text"
                value={formData.testimonial_text}
                onChange={(e) => setFormData({ ...formData, testimonial_text: e.target.value })}
                rows={5}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testimonial_type">Type</Label>
                <Select
                  value={formData.testimonial_type}
                  onValueChange={(v: any) => setFormData({ ...formData, testimonial_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="colleague">Colleague</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: any) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_avatar_url">Avatar URL</Label>
                <Input
                  id="client_avatar_url"
                  value={formData.client_avatar_url}
                  onChange={(e) => setFormData({ ...formData, client_avatar_url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="project_name">Project Name</Label>
                <Input
                  id="project_name"
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked === true })}
                />
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Featured
                </Label>
              </div>
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                  }
                  className="w-24"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

