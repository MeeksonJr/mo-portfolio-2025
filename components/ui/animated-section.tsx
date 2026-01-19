'use client'

import * as React from 'react'
import { memo } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedSectionProps extends Omit<MotionProps, 'initial' | 'animate'> {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  variant?: 'fade-up' | 'fade-down' | 'fade-in' | 'scale'
  viewport?: {
    once?: boolean
    margin?: string
  }
}

/**
 * Animated Section Component
 * Wrapper component for sections with standardized animations
 * 
 * Provides consistent fade-in animations across the application
 * Memoized for better performance
 */
export const AnimatedSection = memo(function AnimatedSection({
  children,
  delay = 0,
  duration = 0.6,
  className,
  variant = 'fade-up',
  viewport = { once: true },
  ...props
}: AnimatedSectionProps) {
  const animations = {
    'fade-up': {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
    },
    'fade-down': {
      initial: { opacity: 0, y: -20 },
      whileInView: { opacity: 1, y: 0 },
    },
    'fade-in': {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
    },
    'scale': {
      initial: { opacity: 0, scale: 0.9 },
      whileInView: { opacity: 1, scale: 1 },
    },
  }

  const animation = animations[variant]

  return (
    <motion.section
      initial={animation.initial}
      whileInView={animation.whileInView}
      viewport={viewport}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  )
})

interface AnimatedDivProps extends Omit<MotionProps, 'initial' | 'animate'> {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  variant?: 'fade-up' | 'fade-down' | 'fade-in' | 'scale'
}

/**
 * Animated Div Component
 * Wrapper for divs with standardized animations
 * 
 * Use for inline animated content that doesn't need section semantics
 * Memoized for better performance
 */
export const AnimatedDiv = memo(function AnimatedDiv({
  children,
  delay = 0,
  duration = 0.6,
  className,
  variant = 'fade-up',
  ...props
}: AnimatedDivProps) {
  const animations = {
    'fade-up': {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    'fade-down': {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
    },
    'fade-in': {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    'scale': {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
    },
  }

  const animation = animations[variant]

  return (
    <motion.div
      initial={animation.initial}
      animate={animation.animate}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
})

