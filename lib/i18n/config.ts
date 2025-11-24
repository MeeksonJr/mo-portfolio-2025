/**
 * Internationalization (i18n) Configuration
 */

export const locales = ['en', 'fr'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
}

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  fr: '🇫🇷',
}

// Translation keys structure
export interface Translations {
  common: {
    home: string
    about: string
    projects: string
    blog: string
    contact: string
    readMore: string
    learnMore: string
    viewAll: string
    download: string
    share: string
  }
  hero: {
    title: string
    subtitle: string
    cta: string
  }
  about: {
    title: string
    description: string
  }
  // Add more translation keys as needed
}

// English translations (default)
export const translations: Record<Locale, Translations> = {
  en: {
    common: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      blog: 'Blog',
      contact: 'Contact',
      readMore: 'Read More',
      learnMore: 'Learn More',
      viewAll: 'View All',
      download: 'Download',
      share: 'Share',
    },
    hero: {
      title: 'Mohamed Datt',
      subtitle: 'Full Stack Developer',
      cta: 'Get Started',
    },
    about: {
      title: 'About Me',
      description: 'Creative Full Stack Developer specializing in AI-powered web applications',
    },
  },
  fr: {
    common: {
      home: 'Accueil',
      about: 'À propos',
      projects: 'Projets',
      blog: 'Blog',
      contact: 'Contact',
      readMore: 'Lire la suite',
      learnMore: 'En savoir plus',
      viewAll: 'Voir tout',
      download: 'Télécharger',
      share: 'Partager',
    },
    hero: {
      title: 'Mohamed Datt',
      subtitle: 'Développeur Full Stack',
      cta: 'Commencer',
    },
    about: {
      title: 'À propos de moi',
      description: 'Développeur Full Stack créatif spécialisé dans les applications web alimentées par l\'IA',
    },
  },
}

/**
 * Get translation for a given locale and key path
 */
export function getTranslation(
  locale: Locale,
  key: string,
  fallback?: string
): string {
  const keys = key.split('.')
  let value: any = translations[locale]

  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) {
      // Fallback to English if translation missing
      if (locale !== 'en') {
        let enValue: any = translations.en
        for (const enK of keys) {
          enValue = enValue?.[enK]
        }
        return enValue || fallback || key
      }
      return fallback || key
    }
  }

  return value || fallback || key
}

/**
 * Detect user's preferred language
 */
export function detectLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale

  const stored = localStorage.getItem('locale') as Locale | null
  if (stored && locales.includes(stored)) {
    return stored
  }

  const browserLang = navigator.language.split('-')[0]
  if (locales.includes(browserLang as Locale)) {
    return browserLang as Locale
  }

  return defaultLocale
}

