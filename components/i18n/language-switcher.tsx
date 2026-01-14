'use client'

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { locales, localeNames, localeFlags, type Locale, detectLocale } from '@/lib/i18n/config'
import { useTranslation } from './translation-provider'

export default function LanguageSwitcher() {
  const { locale: currentLocale, setLocale } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLocaleChange = (locale: Locale) => {
    setLocale(locale)
    // Force page refresh to update all content
    // Using a small delay to ensure state updates first
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Change language"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">
            {localeFlags[currentLocale]} {localeNames[currentLocale]}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={currentLocale === locale ? 'bg-gray-100 dark:bg-gray-800' : ''}
          >
            <span className="mr-2">{localeFlags[locale]}</span>
            <span>{localeNames[locale]}</span>
            {currentLocale === locale && (
              <span className="ml-auto text-xs text-gray-500">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

