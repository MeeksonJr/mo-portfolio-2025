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

