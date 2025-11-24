/**
 * Error Tracking Utility
 * Provides centralized error tracking and reporting
 */

interface ErrorContext {
  url?: string
  userAgent?: string
  timestamp?: string
  userId?: string
  sessionId?: string
  componentStack?: string
  [key: string]: any
}

class ErrorTracker {
  private errorLog: Array<{ error: Error; context: ErrorContext; timestamp: string }> = []
  private maxLogSize = 50

  /**
   * Track an error with context
   */
  trackError(error: Error, context: ErrorContext = {}) {
    const errorEntry = {
      error,
      context: {
        ...context,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    }

    // Add to in-memory log
    this.errorLog.push(errorEntry)
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift()
    }

    // Store in localStorage
    try {
      const stored = localStorage.getItem('error-log')
      const errors = stored ? JSON.parse(stored) : []
      errors.push({
        message: error.message,
        stack: error.stack,
        ...errorEntry.context,
      })
      // Keep only last 20 errors
      const recent = errors.slice(-20)
      localStorage.setItem('error-log', JSON.stringify(recent))
    } catch (e) {
      console.error('Failed to store error in localStorage:', e)
    }

    // Track with Vercel Analytics if available
    if (typeof window !== 'undefined' && (window as any).va?.track) {
      try {
        ;(window as any).va.track('Error', {
          message: error.message,
          name: error.name,
          url: errorEntry.context.url,
        })
      } catch (e) {
        console.error('Failed to track error with analytics:', e)
      }
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', error, context)
    }
  }

  /**
   * Track a performance issue
   */
  trackPerformance(metric: string, value: number, context: ErrorContext = {}) {
    if (typeof window !== 'undefined' && (window as any).va?.track) {
      try {
        ;(window as any).va.track('Performance', {
          metric,
          value,
          ...context,
        })
      } catch (e) {
        console.error('Failed to track performance:', e)
      }
    }
  }

  /**
   * Get error log
   */
  getErrorLog() {
    return this.errorLog
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = []
    try {
      localStorage.removeItem('error-log')
    } catch (e) {
      console.error('Failed to clear error log:', e)
    }
  }

  /**
   * Get errors from localStorage
   */
  getStoredErrors() {
    try {
      const stored = localStorage.getItem('error-log')
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      console.error('Failed to get stored errors:', e)
      return []
    }
  }
}

// Singleton instance
export const errorTracker = new ErrorTracker()

/**
 * Track unhandled errors
 */
export function setupGlobalErrorHandling() {
  if (typeof window === 'undefined') return

  // Track unhandled errors
  window.addEventListener('error', (event) => {
    errorTracker.trackError(
      new Error(event.message),
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'unhandled',
      }
    )
  })

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason))
    
    errorTracker.trackError(error, {
      type: 'unhandledRejection',
    })
  })
}

/**
 * Track React errors (to be used with ErrorBoundary)
 */
export function trackReactError(error: Error, errorInfo: { componentStack?: string }) {
  errorTracker.trackError(error, {
    componentStack: errorInfo.componentStack || undefined,
    type: 'react',
  })
}

