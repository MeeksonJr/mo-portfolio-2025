'use client'

import { BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface SeriesBadgeProps {
  seriesName: string
  variant?: 'default' | 'outline'
  className?: string
}

export default function SeriesBadge({
  seriesName,
  variant = 'outline',
  className = '',
}: SeriesBadgeProps) {
  if (!seriesName) return null

  return (
    <Link href={`/blog/series/${encodeURIComponent(seriesName)}`}>
      <Badge
        variant={variant}
        className={`bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/30 transition-colors ${className}`}
      >
        <BookOpen className="h-3 w-3 mr-1" />
        {seriesName}
      </Badge>
    </Link>
  )
}

