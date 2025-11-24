'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { Variants } from 'framer-motion'

export interface ScrollAnimationOptions {
  threshold?: number // Maps to amount (0-1)
  once?: boolean
  amount?: number
  margin?: string
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const ref = useRef(null)
  const { threshold, once = true, amount, margin } = options
  // Use amount if provided, otherwise map threshold to amount (threshold is 0-1)
  const viewAmount = amount !== undefined ? amount : (threshold !== undefined ? threshold : 0.1)
  
  // Build options object conditionally
  const viewOptions: Parameters<typeof useInView>[1] = { once, amount: viewAmount }
  if (margin) {
    viewOptions.margin = margin as any // Framer Motion's MarginType is complex, using any for flexibility
  }
  
  const isInView = useInView(ref, viewOptions)

  return { ref, isInView }
}

// Predefined animation variants
export const scrollVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  },
  slideDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  },
  slideRight: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.6 } },
  },
}

