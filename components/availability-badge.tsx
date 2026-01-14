'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Briefcase, CheckCircle2 } from 'lucide-react'
import { getUserPreferences } from '@/lib/user-preferences'

interface AvailabilityBadgeProps {
  variant?: 'default' | 'compact'
  className?: string
}

export default function AvailabilityBadge({ variant = 'default', className = '' }: AvailabilityBadgeProps) {
  const [isOpenToWork, setIsOpenToWork] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check user preferences for availability status
    const prefs = getUserPreferences()
    // You can add availability status to user preferences if needed
    // For now, default to true (open to work)
    setIsOpenToWork(true) // Set this based on your preference or user settings
  }, [])

  if (!mounted || !isOpenToWork) return null

  if (variant === 'compact') {
    return (
      <Badge
        variant="default"
        className={`bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30 ${className}`}
      >
        <Briefcase className="h-3 w-3 mr-1" />
        Open to Work
      </Badge>
    )
  }

  return (
    <Badge
      variant="default"
      className={`bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30 px-3 py-1.5 ${className}`}
    >
      <CheckCircle2 className="h-4 w-4 mr-2" />
      <span className="font-semibold">Open to Work</span>
    </Badge>
  )
}

