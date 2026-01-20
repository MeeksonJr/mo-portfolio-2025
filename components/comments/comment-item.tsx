'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThumbsUp, Heart, Lightbulb, HelpCircle, Reply, Loader2 } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { toast } from 'sonner'
import CommentForm from './comment-form'

interface Comment {
  id: string
  author_name: string | null
  author_email: string | null
  author_website: string | null
  content: string
  created_at: string
  approved_at: string | null
  replies?: Comment[]
  reactions: {
    like: number
    helpful: number
    love: number
    insightful: number
  }
}

interface CommentItemProps {
  comment: Comment
  contentType: 'blog_post' | 'case_study' | 'project' | 'resource'
  contentId: string
  onReplySuccess?: () => void
  depth?: number
}

export default function CommentItem({
  comment,
  contentType,
  contentId,
  onReplySuccess,
  depth = 0,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [reacting, setReacting] = useState(false)

  const handleReaction = async (reactionType: 'like' | 'helpful' | 'love' | 'insightful') => {
    if (reacting) return

    setReacting(true)
    try {
      const response = await fetch(`/api/comments/${comment.id}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reaction_type: reactionType }),
      })

      if (response.ok) {
        if (onReplySuccess) {
          onReplySuccess()
        }
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to add reaction')
      }
    } catch (error) {
      console.error('Error adding reaction:', error)
      toast.error('Failed to add reaction')
    } finally {
      setReacting(false)
    }
  }

  const reactions = [
    { type: 'like' as const, icon: ThumbsUp, count: comment.reactions.like, label: 'Like' },
    { type: 'helpful' as const, icon: HelpCircle, count: comment.reactions.helpful, label: 'Helpful' },
    { type: 'love' as const, icon: Heart, count: comment.reactions.love, label: 'Love' },
    { type: 'insightful' as const, icon: Lightbulb, count: comment.reactions.insightful, label: 'Insightful' },
  ]

  return (
    <div className={`space-y-4 ${depth > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''}`}>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold">{comment.author_name || 'Anonymous'}</h4>
              {comment.author_website && (
                <a
                  href={comment.author_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Website
                </a>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span>Posted: {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
              {comment.approved_at && (
                <>
                  <span>•</span>
                  <span>Approved: {formatDistanceToNow(new Date(comment.approved_at), { addSuffix: true })}</span>
                </>
              )}
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{format(new Date(comment.created_at), 'MMM d, yyyy h:mm a')}</span>
            </div>
          </div>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{comment.content}</p>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t">
          {reactions.map((reaction) => (
            <Button
              key={reaction.type}
              variant="ghost"
              size="sm"
              onClick={() => handleReaction(reaction.type)}
              disabled={reacting}
              className="h-8"
              title={reaction.label}
            >
              <reaction.icon className="h-4 w-4 mr-1" />
              <span>{reaction.count}</span>
            </Button>
          ))}
          {depth < 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="h-8"
            >
              <Reply className="h-4 w-4 mr-1" />
              Reply
            </Button>
          )}
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-4">
          <CommentForm
            contentType={contentType}
            contentId={contentId}
            parentId={comment.id}
            onSuccess={() => {
              setShowReplyForm(false)
              if (onReplySuccess) {
                onReplySuccess()
              }
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4 mt-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              contentType={contentType}
              contentId={contentId}
              onReplySuccess={onReplySuccess}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

