'use client'

import { useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'

interface UseAutoSaveOptions {
  data: any
  onSave: (data: any) => Promise<void> | void
  interval?: number // milliseconds
  enabled?: boolean
  onSaveStart?: () => void
  onSaveSuccess?: () => void
  onSaveError?: (error: Error) => void
}

export function useAutoSave({
  data,
  onSave,
  interval = 30000, // 30 seconds
  enabled = true,
  onSaveStart,
  onSaveSuccess,
  onSaveError,
}: UseAutoSaveOptions) {
  const dataRef = useRef(data)
  const lastSaveRef = useRef<Date>(new Date())
  const timeoutRef = useRef<NodeJS.Timeout>()
  const isSavingRef = useRef(false)
  const hasUnsavedChangesRef = useRef(false)

  // Track data changes
  useEffect(() => {
    if (JSON.stringify(dataRef.current) !== JSON.stringify(data)) {
      hasUnsavedChangesRef.current = true
      dataRef.current = data
    }
  }, [data])

  // Save function
  const save = useCallback(async () => {
    if (isSavingRef.current || !hasUnsavedChangesRef.current) {
      return
    }

    try {
      isSavingRef.current = true
      hasUnsavedChangesRef.current = false
      onSaveStart?.()

      await onSave(dataRef.current)

      lastSaveRef.current = new Date()
      onSaveSuccess?.()
    } catch (error: any) {
      hasUnsavedChangesRef.current = true
      onSaveError?.(error)
      throw error
    } finally {
      isSavingRef.current = false
    }
  }, [onSave, onSaveStart, onSaveSuccess, onSaveError])

  // Auto-save interval
  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return
    }

    const scheduleSave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        save().catch((error) => {
          console.error('Auto-save failed:', error)
        })
      }, interval)
    }

    scheduleSave()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [enabled, interval, save, onSave])

  // Manual save function
  const manualSave = useCallback(async () => {
    await save()
  }, [save])

  // Get save status
  const getSaveStatus = useCallback(() => {
    return {
      isSaving: isSavingRef.current,
      hasUnsavedChanges: hasUnsavedChangesRef.current,
      lastSave: lastSaveRef.current,
    }
  }, [])

  return { manualSave, getSaveStatus }
}
