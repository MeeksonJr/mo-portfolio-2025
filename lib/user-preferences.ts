export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  fontSize: 'small' | 'medium' | 'large' | 'xlarge'
  animations: 'enabled' | 'reduced' | 'disabled'
  highContrast: boolean
  contentFilters: {
    showProjects: boolean
    showBlog: boolean
    showCaseStudies: boolean
    showResources: boolean
  }
  readingMode: {
    defaultFontSize: number
    defaultMaxWidth: number
    defaultTheme: 'light' | 'dark' | 'auto'
  }
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  fontSize: 'medium',
  animations: 'enabled',
  highContrast: false,
  contentFilters: {
    showProjects: true,
    showBlog: true,
    showCaseStudies: true,
    showResources: true,
  },
  readingMode: {
    defaultFontSize: 18,
    defaultMaxWidth: 65,
    defaultTheme: 'auto',
  },
}

const STORAGE_KEY = 'user-preferences'

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge with defaults to handle missing properties
      return {
        ...DEFAULT_PREFERENCES,
        ...parsed,
        contentFilters: {
          ...DEFAULT_PREFERENCES.contentFilters,
          ...(parsed.contentFilters || {}),
        },
        readingMode: {
          ...DEFAULT_PREFERENCES.readingMode,
          ...(parsed.readingMode || {}),
        },
      }
    }
  } catch (error) {
    console.error('Error loading user preferences:', error)
  }

  return DEFAULT_PREFERENCES
}

export function saveUserPreferences(preferences: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const current = getUserPreferences()
    const updated = {
      ...current,
      ...preferences,
      contentFilters: {
        ...current.contentFilters,
        ...(preferences.contentFilters || {}),
      },
      readingMode: {
        ...current.readingMode,
        ...(preferences.readingMode || {}),
      },
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('preferences-updated', { detail: updated }))
  } catch (error) {
    console.error('Error saving user preferences:', error)
  }
}

export function resetUserPreferences(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('preferences-updated', { detail: DEFAULT_PREFERENCES }))
  } catch (error) {
    console.error('Error resetting user preferences:', error)
  }
}

// Helper functions for specific preferences
export function getFontSizeClass(fontSize: UserPreferences['fontSize']): string {
  const classes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  }
  return classes[fontSize]
}

export function getFontSizeValue(fontSize: UserPreferences['fontSize']): number {
  const values = {
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 20,
  }
  return values[fontSize]
}

export function shouldReduceMotion(animations: UserPreferences['animations']): boolean {
  return animations === 'reduced' || animations === 'disabled'
}

export function shouldDisableAnimations(animations: UserPreferences['animations']): boolean {
  return animations === 'disabled'
}

