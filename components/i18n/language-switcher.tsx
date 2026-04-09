'use client'

import { useState, useEffect, useCallback } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🌍' },
]

function triggerGoogleTranslate(langCode: string) {
  // Find the hidden Google Translate select element
  const selectEl = document.querySelector<HTMLSelectElement>(
    '.goog-te-combo, #\\:1\\.target select, [class^="goog-te"] select'
  )

  if (selectEl) {
    selectEl.value = langCode
    selectEl.dispatchEvent(new Event('change'))
    return true
  }

  // Fallback: use the iframe approach via googtrans cookie + reload
  const value = langCode === 'en' ? '' : `/en/${langCode}`
  document.cookie = `googtrans=${value}; path=/;`
  document.cookie = `googtrans=${value}; path=/; domain=.${window.location.hostname};`
  window.location.reload()
  return false
}

function getCurrentLangFromCookie(): string {
  if (typeof document === 'undefined') return 'en'
  const match = document.cookie.match(/googtrans=\/en\/([^;]+)/)
  return match ? match[1] : 'en'
}

export default function LanguageSwitcher() {
  const [mounted, setMounted] = useState(false)
  const [currentCode, setCurrentCode] = useState('en')
  const [gtReady, setGtReady] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCurrentCode(getCurrentLangFromCookie())

    // Poll until Google Translate widget is fully initialized
    let attempts = 0
    const maxAttempts = 30 // 15 seconds max
    const interval = setInterval(() => {
      attempts++
      const selectEl = document.querySelector<HTMLSelectElement>(
        '.goog-te-combo, [class^="goog-te"] select'
      )
      if (selectEl) {
        setGtReady(true)
        clearInterval(interval)
      } else if (attempts >= maxAttempts) {
        // Widget didn't load; fall back to cookie+reload silently
        setGtReady(false)
        clearInterval(interval)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const handleSelectLanguage = useCallback((code: string) => {
    setCurrentCode(code)

    if (code === 'en') {
      // Revert to English: clear cookie and reload
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`
      window.location.reload()
      return
    }

    triggerGoogleTranslate(code)
  }, [])

  if (!mounted) return null

  const currentLang = LANGUAGES.find((l) => l.code === currentCode) ?? LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium text-foreground/70 hover:text-foreground focus:outline-none"
          aria-label={`Current language: ${currentLang.name}. Click to change.`}
        >
          <Globe className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">
            {currentLang.flag} {currentLang.name}
          </span>
          <span className="sm:hidden">{currentLang.flag}</span>
          <ChevronDown className="w-3 h-3 opacity-50 hidden sm:inline" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 max-h-80 overflow-y-auto">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Translate site
          {!gtReady && (
            <span className="ml-1 opacity-60">(loading...)</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleSelectLanguage(lang.code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-base leading-none">{lang.flag}</span>
            <span className="flex-1">{lang.nativeName}</span>
            <span className="text-xs text-muted-foreground">{lang.name}</span>
            {currentCode === lang.code && (
              <Check className="w-3.5 h-3.5 text-primary ml-1 flex-shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
