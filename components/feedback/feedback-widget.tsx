'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, MessageSquare, Star, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface FeedbackWidgetProps {
  contentId: string
  contentType: 'blog_post' | 'case_study' | 'project' | 'resource'
  className?: string
}

interface FeedbackStats {
  total: number
  helpful: number
  notHelpful: number
  helpfulPercentage: number
  averageRating: number | null
  ratingCount: number
}

export default function FeedbackWidget({
  contentId,
  contentType,
  className = '',
}: FeedbackWidgetProps) {
  const [helpful, setHelpful] = useState<boolean | null>(null)
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showCommentDialog, setShowCommentDialog] = useState(false)
  const [stats, setStats] = useState<FeedbackStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    fetchStats()
    // Check if user already submitted feedback
    const feedbackKey = `feedback_${contentType}_${contentId}`
    const submitted = localStorage.getItem(feedbackKey)
    if (submitted) {
      setIsSubmitted(true)
      const data = JSON.parse(submitted)
      setHelpful(data.helpful)
      setRating(data.rating)
    }
  }, [contentId, contentType])

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `/api/feedback?contentId=${contentId}&contentType=${contentType}`
      )
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching feedback stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleFeedback = async (isHelpful: boolean) => {
    if (isSubmitted) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          contentType,
          helpful: isHelpful,
        }),
      })

      if (response.ok) {
        setHelpful(isHelpful)
        setIsSubmitted(true)
        const feedbackKey = `feedback_${contentType}_${contentId}`
        localStorage.setItem(feedbackKey, JSON.stringify({ helpful: isHelpful }))
        toast.success('Thank you for your feedback!')
        fetchStats()
      } else {
        toast.error('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('Failed to submit feedback')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRating = async (value: number) => {
    if (isSubmitted) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          contentType,
          rating: value,
        }),
      })

      if (response.ok) {
        setRating(value)
        setIsSubmitted(true)
        const feedbackKey = `feedback_${contentType}_${contentId}`
        localStorage.setItem(feedbackKey, JSON.stringify({ rating: value }))
        toast.success('Thank you for your rating!')
        fetchStats()
      } else {
        toast.error('Failed to submit rating')
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
      toast.error('Failed to submit rating')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          contentType,
          comment: comment.trim(),
          helpful,
          rating,
        }),
      })

      if (response.ok) {
        toast.success('Thank you for your comment!')
        setComment('')
        setShowCommentDialog(false)
        fetchStats()
      } else {
        toast.error('Failed to submit comment')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast.error('Failed to submit comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Was this helpful? */}
      <Card className="bg-background/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Was this helpful?</h3>
              {stats && stats.total > 0 && (
                <p className="text-sm text-muted-foreground">
                  {stats.helpfulPercentage}% found this helpful ({stats.total} {stats.total === 1 ? 'response' : 'responses'})
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={helpful === true ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFeedback(true)}
                disabled={isSubmitting || isSubmitted}
                className="gap-2"
              >
                {isSubmitted && helpful === true ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ThumbsUp className="h-4 w-4" />
                )}
                Yes
              </Button>
              <Button
                variant={helpful === false ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFeedback(false)}
                disabled={isSubmitting || isSubmitted}
                className="gap-2"
              >
                {isSubmitted && helpful === false ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ThumbsDown className="h-4 w-4" />
                )}
                No
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card className="bg-background/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Rate this content</h3>
              {stats && stats.averageRating && (
                <p className="text-sm text-muted-foreground">
                  {stats.averageRating.toFixed(1)} / 5.0 ({stats.ratingCount} {stats.ratingCount === 1 ? 'rating' : 'ratings'})
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleRating(value)}
                  disabled={isSubmitting || isSubmitted}
                  aria-label={`Rate ${value} out of 5`}
                  title={`Rate ${value} out of 5`}
                  className={`p-1 transition-colors ${
                    rating !== null && value <= rating
                      ? 'text-yellow-500'
                      : 'text-muted-foreground hover:text-yellow-500'
                  } ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      rating !== null && value <= rating ? 'fill-current' : ''
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comment */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full gap-2">
            <MessageSquare className="h-4 w-4" />
            Leave a comment
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share your thoughts</DialogTitle>
            <DialogDescription>
              Your feedback helps improve the content quality.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="What did you think about this content?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCommentDialog(false)
                  setComment('')
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCommentSubmit} disabled={!comment.trim() || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

