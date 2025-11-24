'use client'

import { useEffect, useState } from 'react'

export default function TerminalBackground() {
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Animated grid pattern - lightweight CSS */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          ...(isReducedMotion ? {} : {
            animation: 'gridMove 20s linear infinite',
          }),
        }}
      />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      {/* Floating particles - CSS only, very lightweight */}
      {!isReducedMotion && (
        <>
          {Array.from({ length: 30 }).map((_, i) => {
            const floatType = i % 3
            const duration = 15 + Math.random() * 10
            return (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float${floatType} ${duration}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            )
          })}
        </>
      )}

      {/* Subtle scanline effect */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(34, 197, 94, 0.1) 2px,
            rgba(34, 197, 94, 0.1) 4px
          )`,
          ...(isReducedMotion ? {} : {
            animation: 'scanline 8s linear infinite',
          }),
        }}
      />
    </div>
  )
}
