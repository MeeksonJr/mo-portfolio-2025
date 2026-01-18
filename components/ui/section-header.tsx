'use client'

import * as React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TYPOGRAPHY, SECTION_SPACING } from '@/lib/design-tokens'
import { AnimatedDiv } from './animated-section'

interface SectionHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  align?: 'left' | 'center' | 'right'
  variant?: 'default' | 'large' | 'small'
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  spacing?: keyof typeof SECTION_SPACING
  delay?: number
}

/**
 * Section Header Component
 * Standardized header for sections with title, optional description, and icon
 * 
 * Provides consistent styling and spacing for section headers across the application
 */
export function SectionHeader({
  title,
  description,
  icon: Icon,
  align = 'center',
  variant = 'default',
  className,
  titleClassName,
  descriptionClassName,
  spacing = 'normal',
  delay = 0,
}: SectionHeaderProps) {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align]

  const titleVariantClass = {
    default: TYPOGRAPHY.h2,
    large: TYPOGRAPHY.h1,
    small: TYPOGRAPHY.h3,
  }[variant]

  const descriptionVariantClass = {
    default: TYPOGRAPHY.lead,
    large: TYPOGRAPHY.lead,
    small: TYPOGRAPHY.body,
  }[variant]

  const spacingClass = SECTION_SPACING[spacing]

  return (
    <AnimatedDiv
      variant="fade-up"
      delay={delay}
      className={cn(
        "flex flex-col",
        alignClass,
        spacingClass,
        className
      )}
    >
      {(Icon || title) && (
        <div className={cn(
          "flex items-center gap-3 mb-4",
          align === 'center' && 'justify-center',
          align === 'right' && 'justify-end'
        )}>
          {Icon && <Icon className="h-8 w-8 text-primary" />}
          <h2 className={cn(
            titleVariantClass,
            titleClassName
          )}>
            {title}
          </h2>
        </div>
      )}
      {description && (
        <p className={cn(
          descriptionVariantClass,
          "text-muted-foreground",
          align === 'center' && 'mx-auto max-w-2xl',
          align === 'right' && 'ml-auto max-w-2xl',
          spacing !== 'normal' && 'mt-2',
          descriptionClassName
        )}>
          {description}
        </p>
      )}
    </AnimatedDiv>
  )
}

