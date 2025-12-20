'use client'

import { ReactNode } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'

interface ResponsiveContainerProps {
  children: ReactNode
  mobile?: ReactNode
  tablet?: ReactNode
  desktop?: ReactNode
  className?: string
}

export default function ResponsiveContainer({
  children,
  mobile,
  tablet,
  desktop,
  className = '',
}: ResponsiveContainerProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')

  if (mobile && isMobile) {
    return <div className={className}>{mobile}</div>
  }

  if (tablet && isTablet && !isMobile) {
    return <div className={className}>{tablet}</div>
  }

  if (desktop && !isTablet) {
    return <div className={className}>{desktop}</div>
  }

  return <div className={className}>{children}</div>
}

