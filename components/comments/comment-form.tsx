'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface CommentFormProps {
  contentType: 'blog_post' | 'case_study' | 'project' | 'resource'
  contentId: string
  parentId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function CommentForm({
  contentType,
  contentId,
  parentId,
  onSuccess,
  onCancel,
}: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    author_website: '',
    content: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
          parent_id: parentId || null,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit comment')
      }

      setFormData({
        author_name: '',
        author_email: '',
        author_website: '',
        content: '',
      })
      toast.success('Comment submitted successfully! It will be reviewed before being published.')
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error('Error submitting comment:', error)
      toast.error(error.message || 'Failed to submit comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-background/95 backdrop-blur-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author_name">Your Name *</Label>
              <Input
                id="author_name"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                required
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author_email">Your Email (Optional)</Label>
              <Input
                id="author_email"
                type="email"
                value={formData.author_email}
                onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="author_website">Your Website (Optional)</Label>
            <Input
              id="author_website"
              type="url"
              value={formData.author_website}
              onChange={(e) => setFormData({ ...formData, author_website: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Comment *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={4}
              placeholder="Share your thoughts..."
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground">
              {formData.content.length}/2000 characters (Markdown supported)
            </p>
          </div>

          <div className="flex gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                parentId ? 'Post Reply' : 'Post Comment'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

