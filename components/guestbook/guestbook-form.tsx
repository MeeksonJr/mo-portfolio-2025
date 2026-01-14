'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function GuestbookForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website_url: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit message')
      }

      setIsSuccess(true)
      setFormData({
        name: '',
        email: '',
        message: '',
        website_url: '',
      })
      toast.success('Message submitted successfully! It will be reviewed before being published.')
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error('Error submitting guestbook message:', error)
      toast.error(error.message || 'Failed to submit message. Please try again.')
    } finally {
      setIsSubmitting(false)
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
              Your message has been submitted successfully. It will be reviewed and published soon.
            </p>
            <Button onClick={() => setIsSuccess(false)} variant="outline">
              Leave Another Message
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-background/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Leave a Message</CardTitle>
        <CardDescription>
          Share your thoughts, feedback, or just say hello!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={6}
              placeholder="Share your thoughts..."
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              {formData.message.length}/1000 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">Your Website (Optional)</Label>
            <Input
              id="website_url"
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Message'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

