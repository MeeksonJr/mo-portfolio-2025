'use client'

import { useState, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
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

function getCookie(name: string): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : ''
}

function setGoogleTranslateCookie(langCode: string) {
  if (langCode === 'en') {
    // Clear the cookie to revert to English
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
  } else {
    const value = `/en/${langCode}`
    document.cookie = `googtrans=${value}; path=/;`
    document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname};`
  }
  // Reload the page so Google Translate picks up the new cookie
  window.location.reload()
}

function getCurrentLanguageCode(): string {
  const cookie = getCookie('googtrans')
  if (!cookie || cookie === '') return 'en'
  const parts = cookie.split('/')
  return parts[parts.length - 1] || 'en'
}

export default function LanguageSwitcher() {
  const [mounted, setMounted] = useState(false)
  const [currentCode, setCurrentCode] = useState('en')

  useEffect(() => {
    setMounted(true)
    setCurrentCode(getCurrentLanguageCode())
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
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">
            {currentLang.flag} {currentLang.name}
          </span>
          <span className="sm:hidden">{currentLang.flag}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 max-h-80 overflow-y-auto">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Translate entire site
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setGoogleTranslateCookie(lang.code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-base leading-none">{lang.flag}</span>
            <span className="flex-1">{lang.nativeName}</span>
            <span className="text-xs text-muted-foreground">{lang.name}</span>
            {currentCode === lang.code && (
              <Check className="w-3.5 h-3.5 text-primary ml-1" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
