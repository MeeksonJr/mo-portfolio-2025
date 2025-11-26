'use client'

import { useEffect, useState } from 'react'
import { useUserPreferences } from '@/hooks/use-user-preferences'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'text' | 'link'>('default')
  const { preferences } = useUserPreferences()
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!isReducedMotion && preferences.animations !== 'disabled') {
      document.body.classList.add('custom-cursor-active')
      return () => {
        document.body.classList.remove('custom-cursor-active')
      }
    }
  }, [isReducedMotion, preferences.animations])

  useEffect(() => {
    // Don't show custom cursor if reduced motion is preferred or animations are disabled
    if (isReducedMotion || preferences.animations === 'disabled') {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })

      // Detect cursor type based on element
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
        setCursorType('pointer')
      } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        setCursorType('text')
      } else if (target.tagName === 'A') {
        setCursorType('link')
      } else {
        setCursorType('default')
      }
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
        setIsHovering(true)
      }
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    const handleMouseDown = () => {
      setIsClicking(true)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseenter', handleMouseEnter, true)
    window.addEventListener('mouseleave', handleMouseLeave, true)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseenter', handleMouseEnter, true)
      window.removeEventListener('mouseleave', handleMouseLeave, true)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isReducedMotion, preferences.animations])

  // Don't render if reduced motion or animations disabled
  if (isReducedMotion || preferences.animations === 'disabled') {
    return null
  }

  return (
    <div
      className="fixed pointer-events-none z-[9999] mix-blend-difference"
      // eslint-disable-next-line react/forbid-dom-props
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        transition: isReducedMotion ? 'none' : 'transform 0.1s ease-out',
      }}
    >
      {/* Terminal-style cursor (blinking underscore) */}
      <div
        className={`relative ${
          cursorType === 'pointer' ? 'scale-150' : cursorType === 'text' ? 'scale-125' : 'scale-100'
        } transition-transform duration-200`}
      >
        {cursorType === 'default' && (
          <div className="relative">
            <div
              className={`w-0.5 h-6 bg-primary ${
                isClicking ? 'scale-y-75' : ''
              } transition-transform duration-100`}
            >
              <div className="absolute inset-0 bg-primary animate-pulse" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        {cursorType === 'pointer' && (
          <div className="relative">
            <div
              className={`w-4 h-4 border-2 border-primary rounded-full ${
                isHovering ? 'scale-150 bg-primary/20' : ''
              } ${isClicking ? 'scale-75' : ''} transition-all duration-200`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            </div>
          </div>
        )}
        {cursorType === 'text' && (
          <div className="relative">
            <div
              className={`w-0.5 h-5 bg-primary ${
                isClicking ? 'scale-y-75' : ''
              } transition-transform duration-100`}
            >
              <div className="absolute inset-0 bg-primary animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
