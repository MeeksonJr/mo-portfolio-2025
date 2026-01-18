'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TYPOGRAPHY, SECTION_SPACING } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
  align?: 'left' | 'center' | 'right'
  variant?: 'default' | 'large' | 'small'
  className?: string
  spacing?: keyof typeof SECTION_SPACING
}

/**
 * Standardized page header component
 * Provides consistent title and description styling across pages
 */
export default function PageHeader({
  title,
  description,
  children,
  align = 'center',
  variant = 'default',
  className,
  spacing = 'normal',
}: PageHeaderProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align]

  const titleClass = {
    default: TYPOGRAPHY.h1,
    large: TYPOGRAPHY.h1, // Could use custom larger variant if needed
    small: TYPOGRAPHY.h2,
  }[variant]

  const descriptionClass = {
    default: TYPOGRAPHY.lead,
    large: TYPOGRAPHY.lead,
    small: TYPOGRAPHY.body,
  }[variant]

  const spacingClass = SECTION_SPACING[spacing]

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(alignClass, spacingClass, className)}
    >
      <motion.h1
        className={cn(
          titleClass,
          'mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent',
          align === 'center' && 'mx-auto',
          align === 'right' && 'ml-auto'
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h1>

      {description && (
        <motion.p
          className={cn(
            descriptionClass,
            'text-muted-foreground max-w-3xl',
            align === 'center' && 'mx-auto',
            align === 'right' && 'ml-auto',
            align === 'left' && 'mr-auto'
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {description}
        </motion.p>
      )}

      {children && (
        <motion.div
          className={cn('mt-6', align === 'center' && 'flex justify-center', align === 'right' && 'flex justify-end')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </motion.header>
  )
}
