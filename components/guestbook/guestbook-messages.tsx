'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Smile, ThumbsUp, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface GuestbookMessage {
  id: string
  name: string
  email: string | null
  message: string
  website_url: string | null
  created_at: string
  reactions: {
    like: number
    heart: number
    smile: number
  }
}

interface GuestbookMessagesProps {
  initialMessages?: GuestbookMessage[]
}

export default function GuestbookMessages({ initialMessages = [] }: GuestbookMessagesProps) {
  const [messages, setMessages] = useState<GuestbookMessage[]>(initialMessages)
  const [loading, setLoading] = useState(false)
  const [reactingIds, setReactingIds] = useState<Set<string>>(new Set())

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/guestbook')
      const data = await response.json()
      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialMessages.length === 0) {
      fetchMessages()
    }
  }, [])

  const handleReaction = async (messageId: string, reactionType: 'like' | 'heart' | 'smile') => {
    if (reactingIds.has(messageId)) return

    setReactingIds((prev) => new Set(prev).add(messageId))

    try {
      const response = await fetch(`/api/guestbook/${messageId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reaction_type: reactionType }),
      })

      if (response.ok) {
        // Refresh messages to get updated reaction counts
        await fetchMessages()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to add reaction')
      }
    } catch (error) {
      console.error('Error adding reaction:', error)
      toast.error('Failed to add reaction')
    } finally {
      setReactingIds((prev) => {
        const next = new Set(prev)
        next.delete(messageId)
        return next
      })
    }
  }

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <Card className="bg-background/95 backdrop-blur-sm">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No messages yet. Be the first to leave a message!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id} className="bg-background/95 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{message.name}</h4>
                    {message.website_url && (
                      <a
                        href={message.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground underline"
                      >
                        Website
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <p className="text-foreground whitespace-pre-wrap">{message.message}</p>

              <div className="flex items-center gap-4 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction(message.id, 'like')}
                  disabled={reactingIds.has(message.id)}
                  className="h-8"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{message.reactions.like}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction(message.id, 'heart')}
                  disabled={reactingIds.has(message.id)}
                  className="h-8"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{message.reactions.heart}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction(message.id, 'smile')}
                  disabled={reactingIds.has(message.id)}
                  className="h-8"
                >
                  <Smile className="h-4 w-4 mr-1" />
                  <span>{message.reactions.smile}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

