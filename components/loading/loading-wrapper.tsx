'use client'

import { ReactNode } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { Progress } from '@/components/ui/progress'

interface LoadingWrapperProps {
  isLoading: boolean
  children: ReactNode
  skeleton?: ReactNode
  progress?: number
  message?: string
}

export function LoadingWrapper({
  isLoading,
  children,
  skeleton,
  progress,
  message = 'Loading...',
}: LoadingWrapperProps) {
  if (isLoading) {
    if (skeleton) {
      return <>{skeleton}</>
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        {progress !== undefined ? (
          <div className="w-full max-w-md space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground text-center">{message}</p>
          </div>
        ) : (
          <>
            <Spinner className="h-8 w-8 text-primary" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </>
        )}
      </div>
    )
  }

  return <>{children}</>
}

