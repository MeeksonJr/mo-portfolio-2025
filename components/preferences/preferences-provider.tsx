'use client'

import { useEffect } from 'react'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { useTheme } from 'next-themes'
import { shouldReduceMotion, shouldDisableAnimations, getFontSizeValue } from '@/lib/user-preferences'

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { preferences } = useUserPreferences()
  const { setTheme } = useTheme()

  // Apply theme preference
  useEffect(() => {
    if (preferences.theme === 'auto') {
      setTheme('system')
    } else {
      setTheme(preferences.theme)
    }
  }, [preferences.theme, setTheme])

  // Apply font size preference
  useEffect(() => {
    const root = document.documentElement
    const fontSize = getFontSizeValue(preferences.fontSize)
    root.style.fontSize = `${fontSize}px`
    
    return () => {
      root.style.fontSize = ''
    }
  }, [preferences.fontSize])

  // Apply animation preferences
  useEffect(() => {
    const root = document.documentElement
    
    if (shouldDisableAnimations(preferences.animations)) {
      root.style.setProperty('--animation-duration', '0ms')
      root.classList.add('no-animations')
    } else if (shouldReduceMotion(preferences.animations)) {
      root.style.setProperty('--animation-duration', '0.1s')
      root.classList.add('reduce-motion')
    } else {
      root.style.removeProperty('--animation-duration')
      root.classList.remove('no-animations', 'reduce-motion')
    }

    return () => {
      root.style.removeProperty('--animation-duration')
      root.classList.remove('no-animations', 'reduce-motion')
    }
  }, [preferences.animations])

  // Apply high contrast mode
  useEffect(() => {
    const root = document.documentElement
    
    if (preferences.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    return () => {
      root.classList.remove('high-contrast')
    }
  }, [preferences.highContrast])

  return <>{children}</>
}

