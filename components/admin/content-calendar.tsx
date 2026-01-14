'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, Plus, Edit, Trash2, Filter, 
  FileText, Briefcase, Mail, Share2, 
  Clock, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'

interface ContentCalendarItem {
  id: string
  title: string
  content_type: 'blog_post' | 'project' | 'case_study' | 'newsletter' | 'social_media' | 'other'
  status: 'planned' | 'in_progress' | 'review' | 'scheduled' | 'published' | 'cancelled'
  scheduled_date: string | null
  published_date: string | null
  due_date: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  description: string | null
  tags: string[]
  notes: string | null
}

const contentTypeIcons = {
  blog_post: FileText,
  project: Briefcase,
  case_study: FileText,
  newsletter: Mail,
  social_media: Share2,
  other: FileText,
}

const statusColors = {
  planned: 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
  in_progress: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  review: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
  scheduled: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
  published: 'bg-green-500/20 text-green-600 dark:text-green-400',
  cancelled: 'bg-red-500/20 text-red-600 dark:text-red-400',
}

const priorityColors = {
  low: 'bg-gray-500/20 text-gray-600',
  medium: 'bg-blue-500/20 text-blue-600',
  high: 'bg-orange-500/20 text-orange-600',
  urgent: 'bg-red-500/20 text-red-600',
}

export default function ContentCalendar() {
  const [items, setItems] = useState<ContentCalendarItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedItem, setSelectedItem] = useState<ContentCalendarItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    fetchCalendarItems()
  }, [currentMonth, filterStatus, filterType])

  const fetchCalendarItems = async () => {
    setLoading(true)
    try {
      const startDate = startOfMonth(currentMonth).toISOString()
      const endDate = endOfMonth(currentMonth).toISOString()

      const params = new URLSearchParams()
      params.set('startDate', startDate)
      params.set('endDate', endDate)
      if (filterStatus !== 'all') params.set('status', filterStatus)
      if (filterType !== 'all') params.set('contentType', filterType)

      const response = await fetch(`/api/admin/content-calendar?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch calendar items')
      
      const { data } = await response.json()
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching calendar items:', error)
      toast.error('Failed to load calendar items')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedItem(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: ContentCalendarItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this calendar item?')) return

    try {
      const response = await fetch(`/api/admin/content-calendar/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete item')
      
      toast.success('Calendar item deleted')
      fetchCalendarItems()
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Failed to delete calendar item')
    }
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getItemsForDate = (date: Date) => {
    return items.filter(item => {
      if (!item.scheduled_date) return false
      return isSameDay(new Date(item.scheduled_date), date)
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Content Calendar</h2>
          <p className="text-muted-foreground">Plan and schedule your content</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="blog_post">Blog Posts</SelectItem>
              <SelectItem value="project">Projects</SelectItem>
              <SelectItem value="case_study">Case Studies</SelectItem>
              <SelectItem value="newsletter">Newsletters</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      <Card className="bg-background/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {format(currentMonth, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading calendar...</div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold text-sm py-2">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {days.map((day) => {
                const dayItems = getItemsForDate(day)
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isToday = isSameDay(day, new Date())

                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-[100px] p-2 border rounded-lg ${
                      isCurrentMonth ? 'bg-background' : 'bg-muted/30'
                    } ${isToday ? 'ring-2 ring-primary' : ''}`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${isCurrentMonth ? '' : 'text-muted-foreground'}`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayItems.slice(0, 3).map((item) => {
                        const Icon = contentTypeIcons[item.content_type]
                        return (
                          <div
                            key={item.id}
                            className="text-xs p-1 rounded cursor-pointer hover:bg-muted transition-colors flex items-center gap-1"
                            onClick={() => handleEdit(item)}
                          >
                            <Icon className="h-3 w-3" />
                            <span className="truncate">{item.title}</span>
                            <Badge className={`text-xs ${statusColors[item.status]}`}>
                              {item.status}
                            </Badge>
                          </div>
                        )
                      })}
                      {dayItems.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayItems.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* List View */}
      <Card className="bg-background/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Upcoming Items</CardTitle>
          <CardDescription>Items scheduled for the current month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items
              .filter(item => item.scheduled_date && new Date(item.scheduled_date) >= new Date())
              .sort((a, b) => {
                if (!a.scheduled_date || !b.scheduled_date) return 0
                return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
              })
              .slice(0, 10)
              .map((item) => {
                const Icon = contentTypeIcons[item.content_type]
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          {item.scheduled_date && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(item.scheduled_date), 'MMM d, yyyy')}
                            </span>
                          )}
                          <Badge className={statusColors[item.status]}>{item.status}</Badge>
                          <Badge className={priorityColors[item.priority]}>{item.priority}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <ContentCalendarDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
        onSuccess={fetchCalendarItems}
      />
    </div>
  )
}

// Dialog component for creating/editing calendar items
function ContentCalendarDialog({
  open,
  onOpenChange,
  item,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: ContentCalendarItem | null
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    title: '',
    content_type: 'blog_post' as ContentCalendarItem['content_type'],
    status: 'planned' as ContentCalendarItem['status'],
    scheduled_date: '',
    due_date: '',
    priority: 'medium' as ContentCalendarItem['priority'],
    description: '',
    tags: [] as string[],
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        content_type: item.content_type,
        status: item.status,
        scheduled_date: item.scheduled_date ? format(new Date(item.scheduled_date), 'yyyy-MM-dd') : '',
        due_date: item.due_date ? format(new Date(item.due_date), 'yyyy-MM-dd') : '',
        priority: item.priority,
        description: item.description || '',
        tags: item.tags || [],
        notes: item.notes || '',
      })
    } else {
      setFormData({
        title: '',
        content_type: 'blog_post',
        status: 'planned',
        scheduled_date: '',
        due_date: '',
        priority: 'medium',
        description: '',
        tags: [],
        notes: '',
      })
    }
  }, [item, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = item
        ? `/api/admin/content-calendar/${item.id}`
        : '/api/admin/content-calendar'
      const method = item ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          scheduled_date: formData.scheduled_date || null,
          due_date: formData.due_date || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to save calendar item')

      toast.success(item ? 'Calendar item updated' : 'Calendar item created')
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving calendar item:', error)
      toast.error('Failed to save calendar item')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Calendar Item' : 'Create Calendar Item'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="content_type">Content Type *</Label>
              <Select
                value={formData.content_type}
                onValueChange={(value) => setFormData({ ...formData, content_type: value as ContentCalendarItem['content_type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog_post">Blog Post</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="case_study">Case Study</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as ContentCalendarItem['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as ContentCalendarItem['priority'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scheduled_date">Scheduled Date</Label>
              <Input
                id="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : item ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

