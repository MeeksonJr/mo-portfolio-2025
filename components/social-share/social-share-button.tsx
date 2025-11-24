'use client'

import { useState } from 'react'
import { Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, Copy, Check, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface SocialShareButtonProps {
  url?: string
  title?: string
  description?: string
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  contentType?: 'blog' | 'project' | 'case-study' | 'page'
  contentId?: string
  onShare?: (platform: string) => void
}

export default function SocialShareButton({
  url,
  title = 'Mohamed Datt - Full Stack Developer',
  description = 'Creative Full Stack Developer specializing in AI-powered web applications',
  className,
  variant = 'outline',
  size = 'default',
  contentType,
  contentId,
  onShare,
}: SocialShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = `${title} - ${description}`

  const handleShare = async (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(title)
    const encodedText = encodeURIComponent(shareText)

    let shareLink = ''

    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
        break
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'email':
        shareLink = `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`
        break
      default:
        return
    }

    if (shareLink) {
      // Track share event
      if (contentType && contentId) {
        try {
          await fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content_type: contentType,
              content_id: contentId,
              event_type: 'share',
              metadata: { platform, url: shareUrl, title },
            }),
          })
        } catch (error) {
          console.error('Failed to track share:', error)
        }
      }

      // Call custom onShare callback
      if (onShare) {
        onShare(platform)
      }

      window.open(shareLink, '_blank', 'width=600,height=400')
      toast.success(`Opening ${platform}...`)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      
      // Track copy link as share
      if (contentType && contentId) {
        try {
          await fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content_type: contentType,
              content_id: contentId,
              event_type: 'share',
              metadata: { platform: 'copy', url: shareUrl, title },
            }),
          })
        } catch (error) {
          console.error('Failed to track share:', error)
        }
      }

      if (onShare) {
        onShare('copy')
      }

      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        })

        // Track native share
        if (contentType && contentId) {
          try {
            await fetch('/api/analytics/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content_type: contentType,
                content_id: contentId,
                event_type: 'share',
                metadata: { platform: 'native', url: shareUrl, title },
              }),
            })
          } catch (error) {
            console.error('Failed to track share:', error)
          }
        }

        if (onShare) {
          onShare('native')
        }

        toast.success('Shared successfully!')
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share')
        }
      }
    } else {
      // Fallback to copy
      handleCopyLink()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share via...
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('linkedin')}>
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('email')}>
          <Mail className="h-4 w-4 mr-2" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

