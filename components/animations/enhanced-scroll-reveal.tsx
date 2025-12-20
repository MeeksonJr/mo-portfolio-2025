'use client'

import { useRef, ReactNode } from 'react'
import { motion, useInView, Variants } from 'framer-motion'
import { ScrollReveal } from '@/components/animations/scroll-reveal'

interface EnhancedScrollRevealProps {
  children: ReactNode
  variant?: 'fade' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown' | 'scale' | 'blur'
  delay?: number
  duration?: number
  className?: string
  stagger?: number
  threshold?: number
}

export function EnhancedScrollReveal({
  children,
  variant = 'fade',
  delay = 0,
  duration = 0.6,
  className = '',
  stagger = 0,
  threshold = 0.1,
}: EnhancedScrollRevealProps) {
  // Enhanced variants with better easing
  const enhancedVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    slideUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    slideLeft: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    slideRight: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    slideDown: {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    blur: {
      initial: { opacity: 0, filter: 'blur(10px)' },
      animate: { opacity: 1, filter: 'blur(0px)' },
      transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }
    },
  }

  return (
    <ScrollReveal
      variant={variant}
      delay={delay}
      duration={duration}
      className={className}
      threshold={threshold}
    >
      {children}
    </ScrollReveal>
  )
}

// Staggered reveal for lists
interface StaggeredRevealProps {
  children: ReactNode[]
  variant?: 'fade' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown' | 'scale' | 'blur'
  staggerDelay?: number
  className?: string
}

export function StaggeredReveal({
  children,
  variant = 'fade',
  staggerDelay = 0.1,
  className = '',
}: StaggeredRevealProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <EnhancedScrollReveal
          key={index}
          variant={variant}
          delay={index * staggerDelay}
        >
          {child}
        </EnhancedScrollReveal>
      ))}
    </div>
  )
}

