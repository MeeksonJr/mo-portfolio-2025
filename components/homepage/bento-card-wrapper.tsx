'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { HoverScale } from '@/components/animations/hover-effects'

interface BentoCardWrapperProps {
  children: ReactNode
  className?: string
  delay?: number
  variant?: 'default' | 'featured' | 'compact'
}

export default function BentoCardWrapper({
  children,
  className = '',
  delay = 0,
  variant = 'default',
}: BentoCardWrapperProps) {
  const paddingClasses = {
    default: 'p-5 md:p-8 lg:p-10 xl:p-12',
    featured: 'p-8 md:p-12 lg:p-16 xl:p-20',
    compact: 'p-4 md:p-6 lg:p-8',
  }

  return (
    <motion.div
      className={`glass rounded-2xl md:rounded-3xl border border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden relative group ${paddingClasses[variant]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6, scale: 1.01 }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  )
}

