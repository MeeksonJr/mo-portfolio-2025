'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Home, RefreshCw, Terminal, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
          <div className="max-w-2xl w-full text-center space-y-8">
            {/* Terminal-style error display */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <h1 className="text-6xl font-bold text-foreground">Fatal</h1>
              </div>
              
              <div className="font-mono text-left bg-muted/50 p-6 rounded-lg border border-destructive/20">
                <div className="text-destructive mb-2">$ error --code FATAL --critical</div>
                <div className="text-muted-foreground">
                  <div className="mb-2">❌ Critical Application Error</div>
                  <div className="text-sm opacity-75">
                    A critical error occurred that prevented the application from loading.
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
                The application failed to initialize.
                <br />
                Please refresh the page or contact support if the issue persists.
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={reset} size="lg" className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Application
              </Button>
              
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

