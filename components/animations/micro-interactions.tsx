'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface RippleButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode
  className?: string
}

export function RippleButton({ 
  children, 
  className = '',
  onClick,
  ...props 
}: RippleButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const ripple = document.createElement('span')
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    ripple.classList.add('ripple')

    button.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)

    onClick?.(e)
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

interface ShimmerTextProps {
  children: ReactNode
  className?: string
}

export function ShimmerText({ children, className = '' }: ShimmerTextProps) {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        background: 'linear-gradient(90deg, currentColor 0%, transparent 50%, currentColor 100%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </motion.span>
  )
}

interface PulseDotProps {
  className?: string
  color?: string
}

export function PulseDot({ className = '', color = 'currentColor' }: PulseDotProps) {
  return (
    <motion.span
      className={`inline-block rounded-full ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{ backgroundColor: color }}
    />
  )
}

interface LoadingDotsProps {
  className?: string
  count?: number
}

export function LoadingDots({ className = '', count = 3 }: LoadingDotsProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-current"
          animate={{
            y: [0, -8, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

