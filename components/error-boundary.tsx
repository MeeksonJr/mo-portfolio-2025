'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    })

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Report error to analytics (if available)
    if (typeof window !== 'undefined') {
      try {
        // Track error with Vercel Analytics
        if ((window as any).va?.track) {
          ;(window as any).va.track('Error', {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
          })
        }

        // Store error in localStorage for debugging
        const errorLog = {
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }

        const existingErrors = JSON.parse(localStorage.getItem('error-log') || '[]')
        existingErrors.push(errorLog)
        // Keep only last 10 errors
        const recentErrors = existingErrors.slice(-10)
        localStorage.setItem('error-log', JSON.stringify(recentErrors))
      } catch (e) {
        console.error('Failed to log error:', e)
      }
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
              <CardDescription>
                An error occurred while rendering this component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="font-mono text-sm bg-muted p-4 rounded-lg overflow-auto">
                  <div className="text-destructive font-semibold mb-2">
                    {this.state.error.name}: {this.state.error.message}
                  </div>
                  {process.env.NODE_ENV === 'development' && this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        Stack Trace
                      </summary>
                      <pre className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                  {process.env.NODE_ENV === 'development' &&
                    this.state.errorInfo?.componentStack && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                          Component Stack
                        </summary>
                        <pre className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={this.handleReset} variant="default">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
                {process.env.NODE_ENV === 'development' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const errorLog = localStorage.getItem('error-log')
                      if (errorLog) {
                        console.log('Error Log:', JSON.parse(errorLog))
                        alert('Error log printed to console')
                      }
                    }}
                  >
                    <Bug className="mr-2 h-4 w-4" />
                    View Log
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

