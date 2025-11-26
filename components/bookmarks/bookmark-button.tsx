'use client'

import { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  addBookmark,
  removeBookmark,
  isBookmarked,
  type BookmarkType,
} from '@/lib/bookmarks'
import { showSuccessToast, showInfoToast } from '@/lib/toast-helpers'

interface BookmarkButtonProps {
  type: BookmarkType
  contentId: string
  title: string
  url: string
  description?: string
  image?: string
  tags?: string[]
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export default function BookmarkButton({
  type,
  contentId,
  title,
  url,
  description,
  image,
  tags,
  variant = 'ghost',
  size = 'icon',
  className,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    setBookmarked(isBookmarked(type, contentId))
  }, [type, contentId])

  const handleToggle = () => {
    if (bookmarked) {
      const removed = removeBookmark(type, contentId)
      if (removed) {
        setBookmarked(false)
        showInfoToast('Removed from bookmarks')
      }
    } else {
      const added = addBookmark({
        type,
        contentId,
        title,
        url,
        description,
        image,
        tags,
      })
      if (added) {
        setBookmarked(true)
        showSuccessToast('Added to bookmarks')
      }
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      className={className}
      aria-label={bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
      title={bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      {bookmarked ? (
        <BookmarkCheck className="h-4 w-4 fill-current" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
    </Button>
  )
}

