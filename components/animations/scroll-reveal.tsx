'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { motion, useInView, Variants } from 'framer-motion'

interface ScrollRevealProps {
  children: ReactNode
  variant?: 'fade' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown' | 'scale' | 'blur'
  delay?: number
  duration?: number
  distance?: number
  className?: string
  once?: boolean
  threshold?: number
}

const defaultVariants: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
}

export function ScrollReveal({
  children,
  variant = 'fade',
  delay = 0,
  duration = 0.6,
  distance = 50,
  className = '',
  once = true,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })

  // Custom variants with distance
  const customVariants: Variants = {
    hidden: {
      ...defaultVariants[variant].hidden,
      ...(variant.includes('slide') && {
        x: variant === 'slideLeft' ? distance : variant === 'slideRight' ? -distance : 0,
        y: variant === 'slideUp' ? distance : variant === 'slideDown' ? -distance : 0,
      }),
    },
    visible: {
      ...defaultVariants[variant].visible,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={customVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger Container for lists
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  threshold?: number
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  threshold = 0.1,
}: StaggerContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  )
}

// Fade In on Scroll (most common)
export function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <ScrollReveal variant="fade" delay={delay} className={className}>
      {children}
    </ScrollReveal>
  )
}

// Slide In from Left
export function SlideInLeft({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <ScrollReveal variant="slideLeft" delay={delay} className={className}>
      {children}
    </ScrollReveal>
  )
}

// Slide In from Right
export function SlideInRight({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <ScrollReveal variant="slideRight" delay={delay} className={className}>
      {children}
    </ScrollReveal>
  )
}

// Slide In from Bottom
export function SlideInUp({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <ScrollReveal variant="slideUp" delay={delay} className={className}>
      {children}
    </ScrollReveal>
  )
}

// Scale In
export function ScaleIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <ScrollReveal variant="scale" delay={delay} className={className}>
      {children}
    </ScrollReveal>
  )
}

// Blur In
export function BlurIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <ScrollReveal variant="blur" delay={delay} className={className}>
      {children}
    </ScrollReveal>
  )
}

