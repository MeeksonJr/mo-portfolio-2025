'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { EnhancedScrollReveal } from '@/components/animations/enhanced-scroll-reveal'

interface PageHeaderProps {
  title: string
  description?: string
  badge?: string
  actions?: ReactNode
  className?: string
}

export default function PageHeader({
  title,
  description,
  badge,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <EnhancedScrollReveal variant="fade" delay={0.1}>
      <div className={`space-y-6 ${className}`}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-4 flex-1">
            {badge && (
              <motion.span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {badge}
              </motion.span>
            )}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {title}
            </motion.h1>
            {description && (
              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {description}
              </motion.p>
            )}
          </div>
          {actions && (
            <motion.div
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {actions}
            </motion.div>
          )}
        </div>
      </div>
    </EnhancedScrollReveal>
  )
}

