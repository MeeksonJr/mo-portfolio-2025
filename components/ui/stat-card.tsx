'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TYPOGRAPHY } from '@/lib/design-tokens'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  index?: number
  className?: string
  delay?: number
}

/**
 * Stat Card Component
 * Displays a statistic with icon, value, and label in a standardized card format
 * 
 * Used across hub pages for displaying quick statistics and metrics
 */
export function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  index = 0,
  className,
  delay = 0.4
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + index * 0.1 }}
    >
      <Card className={cn(
        "text-center border-2 hover:border-primary/50 transition-colors",
        className
      )}>
        <CardContent className="pt-6">
          <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
          <div className={cn(TYPOGRAPHY.h3, "font-bold")}>{value}</div>
          <div className={cn(TYPOGRAPHY.bodySmall, "text-muted-foreground mt-1")}>{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface StatCardsGridProps {
  stats: Array<{
    label: string
    value: string | number
    icon: LucideIcon
  }>
  columns?: 2 | 3 | 4
  className?: string
  delay?: number
}

/**
 * Stat Cards Grid Component
 * Displays multiple stat cards in a responsive grid layout
 */
export function StatCardsGrid({ 
  stats, 
  columns = 4,
  className,
  delay = 0.3
}: StatCardsGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }[columns]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        "grid gap-4 max-w-3xl mx-auto",
        gridCols,
        className
      )}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={stat.label}
          {...stat}
          index={index}
          delay={delay}
        />
      ))}
    </motion.div>
  )
}

