'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import CommentForm from './comment-form'
import CommentItem from './comment-item'

interface Comment {
  id: string
  author_name: string
  author_email: string | null
  author_website: string | null
  content: string
  created_at: string
  replies?: Comment[]
  reactions: {
    like: number
    helpful: number
    love: number
    insightful: number
  }
}

interface CommentsSectionProps {
  contentType: 'blog_post' | 'case_study' | 'project' | 'resource'
  contentId: string
  initialComments?: Comment[]
}

export default function CommentsSection({
  contentType,
  contentId,
  initialComments = [],
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const fetchComments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/comments?contentType=${contentType}&contentId=${contentId}`)
      const data = await response.json()
      if (data.comments) {
        setComments(data.comments)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast.error('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialComments.length === 0) {
      fetchComments()
    }
  }, [])

  const handleCommentSuccess = () => {
    setShowForm(false)
    fetchComments()
  }

  return (
    <div className="space-y-6">
      <Card className="bg-background/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments ({comments.length})
              </CardTitle>
              <CardDescription>
                Share your thoughts and join the conversation
              </CardDescription>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                Add Comment
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {showForm && (
            <CommentForm
              contentType={contentType}
              contentId={contentId}
              onSuccess={handleCommentSuccess}
              onCancel={() => setShowForm(false)}
            />
          )}

          {loading && comments.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  contentType={contentType}
                  contentId={contentId}
                  onReplySuccess={fetchComments}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

