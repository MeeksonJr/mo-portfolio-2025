'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { CARD_VARIANTS } from '@/lib/design-tokens'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '@/components/ui/card'

export type CardVariant = keyof typeof CARD_VARIANTS

interface VariantCardProps extends React.ComponentProps<typeof Card> {
  variant?: CardVariant
  interactive?: boolean
  featured?: boolean
}

/**
 * Enhanced Card component with standardized variants
 * Extends the base Card component with design system variants
 */
export function VariantCard({ 
  variant = 'default', 
  interactive = false,
  featured = false,
  className,
  ...props 
}: VariantCardProps) {
  // If interactive or featured is true, use those variants instead
  const finalVariant = featured ? 'featured' : interactive ? 'interactive' : variant
  const variantClass = CARD_VARIANTS[finalVariant]
  
  return (
    <Card
      className={cn(variantClass, className)}
      {...props}
    />
  )
}

/**
 * Glass card variant - commonly used for elevated content
 */
export function GlassCard({ className, ...props }: React.ComponentProps<typeof Card>) {
  return <VariantCard variant="glass" className={className} {...props} />
}

/**
 * Interactive card variant - for clickable cards
 */
export function InteractiveCard({ className, ...props }: React.ComponentProps<typeof Card>) {
  return <VariantCard variant="default" interactive className={className} {...props} />
}

/**
 * Featured card variant - for highlighted content
 */
export function FeaturedCard({ className, ...props }: React.ComponentProps<typeof Card>) {
  return <VariantCard variant="default" featured className={className} {...props} />
}

// Re-export base card components for convenience
export {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
}

