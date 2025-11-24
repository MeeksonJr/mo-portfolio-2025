'use client'

import { useState, useEffect } from 'react'
import { detectLocale, getTranslation, type Locale } from '@/lib/i18n/config'

/**
 * Hook to get translations for the current locale
 */
export function useTranslations() {
  const [locale, setLocale] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const detected = detectLocale()
    setLocale(detected)
  }, [])

  const t = (key: string, fallback?: string) => {
    if (!mounted) return fallback || key
    return getTranslation(locale, key, fallback)
  }

  return { t, locale, setLocale }
}

