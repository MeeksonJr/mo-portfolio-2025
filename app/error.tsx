'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Home, RefreshCw, Terminal, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { errorTracker } from '@/lib/error-tracking'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Application error:', error)
    
    // Track error
    errorTracker.trackError(error, {
      type: 'page-error',
      digest: error.digest,
    })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Terminal-style error display */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <h1 className="text-6xl font-bold text-foreground">500</h1>
          </div>
          
          <div className="font-mono text-left bg-muted/50 p-6 rounded-lg border border-destructive/20">
            <div className="text-destructive mb-2">$ error --code 500 --fatal</div>
            <div className="text-muted-foreground">
              <div className="mb-2">❌ Internal Server Error</div>
              <div className="text-sm opacity-75">
                An unexpected error occurred.
                <br />
                The application encountered an issue while processing your request.
                <br />
                <br />
                {error.digest && (
                  <>
                    Error ID: <span className="text-primary font-mono">{error.digest}</span>
                    <br />
                  </>
                )}
                {process.env.NODE_ENV === 'development' && error.message && (
                  <>
                    <br />
                    Details: <span className="text-destructive text-xs">{error.message}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-lg text-muted-foreground">
            Something went wrong on our end.
            <br />
            Don't worry, we've been notified and are working on it.
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button onClick={reset} size="lg" className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Help text */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            If this problem persists, please{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contact us
            </Link>
            {' '}and include the error ID above.
          </p>
        </div>
      </div>
    </div>
  )
}

