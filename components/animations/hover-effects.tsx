'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface HoverScaleProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  scale?: number
  className?: string
}

export function HoverScale({ 
  children, 
  scale = 1.05, 
  className = '',
  ...props 
}: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: scale * 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface HoverLiftProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  lift?: number
  className?: string
}

export function HoverLift({ 
  children, 
  lift = 8, 
  className = '',
  ...props 
}: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{ y: -lift }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface HoverGlowProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  glowColor?: string
  className?: string
}

export function HoverGlow({ 
  children, 
  glowColor = 'rgba(34, 197, 94, 0.3)',
  className = '',
  ...props 
}: HoverGlowProps) {
  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 20px ${glowColor}`,
      }}
      transition={{ duration: 0.3 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface HoverRotateProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  rotate?: number
  className?: string
}

export function HoverRotate({ 
  children, 
  rotate = 5, 
  className = '',
  ...props 
}: HoverRotateProps) {
  return (
    <motion.div
      whileHover={{ rotate }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

