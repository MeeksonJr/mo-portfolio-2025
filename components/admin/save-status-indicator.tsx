'use client'

import { CheckCircle2, Loader2, AlertCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface SaveStatusIndicatorProps {
  isSaving: boolean
  hasUnsavedChanges: boolean
  lastSave: Date | null
  error: Error | null
  className?: string
}

export default function SaveStatusIndicator({
  isSaving,
  hasUnsavedChanges,
  lastSave,
  error,
  className,
}: SaveStatusIndicatorProps) {
  if (error) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-red-600',
          className
        )}
      >
        <AlertCircle className="h-4 w-4" />
        <span>Save failed</span>
      </div>
    )
  }

  if (isSaving) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-muted-foreground',
          className
        )}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Saving...</span>
      </div>
    )
  }

  if (hasUnsavedChanges) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-yellow-600',
          className
        )}
      >
        <Clock className="h-4 w-4" />
        <span>Unsaved changes</span>
      </div>
    )
  }

  if (lastSave) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-green-600',
          className
        )}
      >
        <CheckCircle2 className="h-4 w-4" />
        <span>
          Saved{' '}
          {formatDistanceToNow(lastSave, {
            addSuffix: true,
          })}
        </span>
      </div>
    )
  }

  return null
}
