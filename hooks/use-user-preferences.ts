'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getUserPreferences,
  saveUserPreferences,
  resetUserPreferences,
  type UserPreferences,
} from '@/lib/user-preferences'

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window !== 'undefined') {
      return getUserPreferences()
    }
    return getUserPreferences()
  })

  // Listen for preference updates from other components
  useEffect(() => {
    const handleUpdate = (event: CustomEvent<UserPreferences>) => {
      setPreferences(event.detail)
    }

    window.addEventListener('preferences-updated', handleUpdate as EventListener)
    return () => {
      window.removeEventListener('preferences-updated', handleUpdate as EventListener)
    }
  }, [])

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    saveUserPreferences(updates)
    setPreferences((prev) => ({
      ...prev,
      ...updates,
      contentFilters: {
        ...prev.contentFilters,
        ...(updates.contentFilters || {}),
      },
      readingMode: {
        ...prev.readingMode,
        ...(updates.readingMode || {}),
      },
    }))
  }, [])

  const reset = useCallback(() => {
    resetUserPreferences()
    setPreferences(getUserPreferences())
  }, [])

  return {
    preferences,
    updatePreferences,
    reset,
  }
}

