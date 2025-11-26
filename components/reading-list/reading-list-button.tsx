'use client'

import { useState, useEffect } from 'react'
import { BookOpen, BookOpenCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  addToReadingList,
  removeFromReadingList,
  isInReadingList,
  type ReadingListType,
} from '@/lib/reading-list'
import { showSuccessToast, showInfoToast } from '@/lib/toast-helpers'

interface ReadingListButtonProps {
  type: ReadingListType
  contentId: string
  title: string
  url: string
  description?: string
  image?: string
  category?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export default function ReadingListButton({
  type,
  contentId,
  title,
  url,
  description,
  image,
  category,
  variant = 'ghost',
  size = 'icon',
  className,
}: ReadingListButtonProps) {
  const [inList, setInList] = useState(false)

  useEffect(() => {
    setInList(isInReadingList(type, contentId))
  }, [type, contentId])

  const handleToggle = () => {
    if (inList) {
      const removed = removeFromReadingList(type, contentId)
      if (removed) {
        setInList(false)
        showInfoToast('Removed from reading list')
      }
    } else {
      const added = addToReadingList({
        type,
        contentId,
        title,
        url,
        description,
        image,
        category,
      })
      if (added) {
        setInList(true)
        showSuccessToast('Added to reading list')
      }
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      className={className}
      aria-label={inList ? 'Remove from reading list' : 'Add to reading list'}
      title={inList ? 'Remove from reading list' : 'Add to reading list'}
    >
      {inList ? (
        <BookOpenCheck className="h-4 w-4 fill-current" />
      ) : (
        <BookOpen className="h-4 w-4" />
      )}
    </Button>
  )
}

