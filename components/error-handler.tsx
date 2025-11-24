'use client'

import { useEffect } from 'react'
import { setupGlobalErrorHandling } from '@/lib/error-tracking'

/**
 * Global Error Handler Component
 * Sets up global error tracking on mount
 */
export function ErrorHandler() {
  useEffect(() => {
    setupGlobalErrorHandling()
  }, [])

  return null
}

