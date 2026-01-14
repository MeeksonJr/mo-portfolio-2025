'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useUserPreferences } from '@/hooks/use-user-preferences'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { updatePreferences } = useUserPreferences()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = () => {
    const currentTheme = resolvedTheme || theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    // Sync with user preferences
    updatePreferences({ theme: newTheme === 'dark' ? 'dark' : 'light' })
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 relative bg-background/80 backdrop-blur-sm">
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeToggle}
      className="h-9 w-9 relative transition-all duration-300 hover:scale-110 bg-background/80 backdrop-blur-sm"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 absolute" />
      <Moon className="h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 absolute" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

