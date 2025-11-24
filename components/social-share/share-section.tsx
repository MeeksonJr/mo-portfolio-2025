'use client'

import { Share2, Twitter, Linkedin, Facebook, Mail, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useState } from 'react'

interface ShareSectionProps {
  url?: string
  title?: string
  description?: string
  image?: string
}

export default function ShareSection({
  url,
  title = 'Mohamed Datt - Full Stack Developer',
  description = 'Creative Full Stack Developer specializing in AI-powered web applications',
  image,
}: ShareSectionProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = `${title} - ${description}`

  const handleShare = (platform: string) => {
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
      window.open(shareLink, '_blank', 'width=600,height=400')
      toast.success(`Opening ${platform}...`)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
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
          ...(image && { files: [] }),
        })
        toast.success('Shared successfully!')
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share')
        }
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share This Page
        </CardTitle>
        <CardDescription>
          Share this page with your network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Social Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button
              variant="outline"
              onClick={handleNativeShare}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Share2 className="h-5 w-5" />
              <span className="text-xs">Native</span>
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => handleShare('twitter')}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Twitter className="h-5 w-5 text-blue-400" />
            <span className="text-xs">Twitter</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('linkedin')}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Linkedin className="h-5 w-5 text-blue-600" />
            <span className="text-xs">LinkedIn</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('facebook')}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Facebook className="h-5 w-5 text-blue-700" />
            <span className="text-xs">Facebook</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('email')}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Mail className="h-5 w-5" />
            <span className="text-xs">Email</span>
          </Button>
        </div>

        {/* Copy Link */}
        <div className="flex gap-2">
          <Input
            value={shareUrl}
            readOnly
            className="flex-1 font-mono text-sm"
          />
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

