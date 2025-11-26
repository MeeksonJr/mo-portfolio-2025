'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getTranslation, type Locale, detectLocale } from '@/lib/i18n/config'

interface TranslationContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, fallback?: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const detected = detectLocale()
    setLocaleState(detected)
    
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = detected
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale)
      document.documentElement.lang = newLocale
      // Trigger a re-render by updating state
      window.dispatchEvent(new CustomEvent('locale-changed', { detail: newLocale }))
    }
  }

  const t = (key: string, fallback?: string) => {
    if (!mounted) return fallback || key
    return getTranslation(locale, key, fallback)
  }

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider')
  }
  return context
}

