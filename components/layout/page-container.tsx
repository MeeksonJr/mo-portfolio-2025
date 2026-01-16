'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { CONTAINER_WIDTHS, SPACING, type ContainerWidth } from '@/lib/design-tokens'

interface PageContainerProps {
  children: ReactNode
  width?: ContainerWidth
  padding?: 'default' | 'tight' | 'wide'
  className?: string
}

/**
 * Standardized page container component
 * Ensures consistent widths and padding across all pages
 */
export default function PageContainer({
  children,
  width = 'standard',
  padding = 'default',
  className,
}: PageContainerProps) {
  const widthClass = CONTAINER_WIDTHS[width]
  
  const paddingClass = {
    default: SPACING.container,
    tight: SPACING.containerTight,
    wide: SPACING.containerWide,
  }[padding]

  return (
    <div className={cn('mx-auto', widthClass, paddingClass, className)}>
      {children}
    </div>
  )
}

/**
 * Helper function to get container classes (for use in className)
 */
export function getContainerClasses(
  width: ContainerWidth = 'standard',
  padding: 'default' | 'tight' | 'wide' = 'default'
): string {
  const widthClass = CONTAINER_WIDTHS[width]
  const paddingClass = {
    default: SPACING.container,
    tight: SPACING.containerTight,
    wide: SPACING.containerWide,
  }[padding]
  
  return `mx-auto ${widthClass} ${paddingClass}`
}

