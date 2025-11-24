'use client'

import { useState } from 'react'
import { Mail, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'inline'
  source?: string
  className?: string
}

export function NewsletterSignup({ variant = 'default', source = 'website', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || null, source }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.alreadySubscribed) {
          toast.info('You are already subscribed to the newsletter!')
        } else if (data.pending) {
          toast.info('Please check your email to confirm your subscription')
        } else {
          toast.error(data.error || 'Failed to subscribe')
        }
        return
      }

      setIsSuccess(true)
      setEmail('')
      setName('')
      toast.success('Please check your email to confirm your subscription!')

      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast.error('Failed to subscribe. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`space-y-2 ${className}`}>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isSuccess}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={isLoading || isSuccess}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSuccess ? (
              <Check className="h-4 w-4" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
          </Button>
        </div>
        {isSuccess && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Check your email to confirm!
          </p>
        )}
      </form>
    )
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading || isSuccess}
          className="flex-1"
          required
        />
        <Button type="submit" disabled={isLoading || isSuccess}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Subscribing...
            </>
          ) : isSuccess ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Subscribed!
            </>
          ) : (
            'Subscribe'
          )}
        </Button>
      </form>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Newsletter
        </CardTitle>
        <CardDescription>
          Get updates on new blog posts, projects, and insights delivered to your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading || isSuccess}
            />
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isSuccess}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || isSuccess}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : isSuccess ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Check your email!
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </>
            )}
          </Button>
          {isSuccess && (
            <p className="text-sm text-center text-green-600 dark:text-green-400">
              Please check your email to confirm your subscription.
            </p>
          )}
          <p className="text-xs text-center text-muted-foreground">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

