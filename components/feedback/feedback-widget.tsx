'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, Star, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
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
        
        // Track achievement
        if (typeof window !== 'undefined' && (window as any).unlockAchievement) {
          ;(window as any).unlockAchievement('feedback-given')
        }
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
    if (isSubmitted || isSubmitting) return

    // Optimistically update UI
    setRating(value)
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

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        const feedbackKey = `feedback_${contentType}_${contentId}`
        localStorage.setItem(feedbackKey, JSON.stringify({ rating: value }))
        toast.success(`Thank you for rating this ${value} out of 5!`)
        fetchStats()
      } else {
        // Revert optimistic update on error
        setRating(null)
        toast.error(data.error || 'Failed to submit rating. Please try again.')
      }
    } catch (error) {
      // Revert optimistic update on error
      setRating(null)
      console.error('Error submitting rating:', error)
      toast.error('Failed to submit rating. Please try again.')
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-semibold mb-1">Rate this content</h3>
              {stats && stats.averageRating && (
                <p className="text-sm text-muted-foreground">
                  {stats.averageRating.toFixed(1)} / 5.0 ({stats.ratingCount} {stats.ratingCount === 1 ? 'rating' : 'ratings'})
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => {
                const isActive = rating !== null && value <= rating
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => !isSubmitted && handleRating(value)}
                    disabled={isSubmitting || isSubmitted}
                    aria-label={`Rate ${value} out of 5`}
                    title={isSubmitted ? 'Already rated' : `Rate ${value} out of 5`}
                    className={`p-1 transition-all duration-200 ${
                      isActive
                        ? 'text-yellow-500 scale-110'
                        : 'text-muted-foreground hover:text-yellow-400 hover:scale-110'
                    } ${isSubmitted ? 'cursor-default opacity-60' : 'cursor-pointer'}`}
                  >
                    <Star
                      className={`h-6 w-6 transition-all ${
                        isActive ? 'fill-current' : ''
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          </div>
          {isSubmitting && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting rating...
            </div>
          )}
          {isSubmitted && rating !== null && (
            <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              Thank you for rating this content {rating} out of 5!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

