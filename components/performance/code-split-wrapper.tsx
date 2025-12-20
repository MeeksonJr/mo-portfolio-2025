'use client'

import { ReactNode, Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface CodeSplitWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
}

export default function CodeSplitWrapper({
  children,
  fallback,
  className = '',
}: CodeSplitWrapperProps) {
  const defaultFallback = (
    <div className={`space-y-4 ${className}`}>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )
}

