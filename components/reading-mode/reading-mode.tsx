'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  BookOpen, X, Minus, Plus, Sun, Moon, 
  Maximize2, Minimize2, Settings2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { useTheme } from 'next-themes'

interface ReadingModeProps {
  children: React.ReactNode
  title: string
  estimatedReadingTime?: number | null
}

export default function ReadingMode({ children, title, estimatedReadingTime }: ReadingModeProps) {
  const [isReadingMode, setIsReadingMode] = useState(false)
  const [fontSize, setFontSize] = useState(18)
  const [maxWidth, setMaxWidth] = useState(65) // rem
  const [showSettings, setShowSettings] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const [localTheme, setLocalTheme] = useState<'light' | 'dark' | 'auto'>('auto')

  // Calculate reading progress
  useEffect(() => {
    if (!isReadingMode || !contentRef.current) return

    const handleScroll = () => {
      const element = contentRef.current
      if (!element) return

      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const elementTop = element.offsetTop
      const elementHeight = element.offsetHeight
      const windowHeight = window.innerHeight

      const scrolled = scrollTop + windowHeight - elementTop
      const progress = Math.min(Math.max((scrolled / elementHeight) * 100, 0), 100)
      setReadingProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isReadingMode])

  // Apply reading mode styles
  useEffect(() => {
    if (isReadingMode) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isReadingMode])

  // Apply local theme
  useEffect(() => {
    if (isReadingMode && localTheme !== 'auto') {
      const root = document.documentElement
      if (localTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      return () => {
        // Restore original theme
        if (theme === 'dark') {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
    }
  }, [isReadingMode, localTheme, theme])

  const toggleReadingMode = () => {
    setIsReadingMode(!isReadingMode)
    if (!isReadingMode) {
      // Scroll to top when entering reading mode
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Reading Mode Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={toggleReadingMode}
          size="lg"
          className="rounded-full shadow-lg h-14 w-14 p-0"
          aria-label="Toggle reading mode"
        >
          {isReadingMode ? (
            <X className="h-5 w-5" />
          ) : (
            <BookOpen className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Reading Progress Bar */}
      {isReadingMode && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
          {/* eslint-disable-next-line react/forbid-dom-props */}
          <div
            className="h-full bg-primary transition-all duration-150"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}

      {/* Reading Mode Overlay */}
      {isReadingMode && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold truncate">{title}</h1>
                  {estimatedReadingTime && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {estimatedReadingTime} min read
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {/* Settings Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    aria-label="Reading settings"
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                  {/* Exit Reading Mode */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleReadingMode}
                    aria-label="Exit reading mode"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Settings Panel */}
              {showSettings && (
                <div className="mt-4 pt-4 border-t border-border space-y-4">
                  {/* Font Size */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Font Size</span>
                      <span className="font-medium">{fontSize}px</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                        aria-label="Decrease font size"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Slider
                        value={[fontSize]}
                        onValueChange={([value]) => setFontSize(value)}
                        min={14}
                        max={24}
                        step={1}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                        aria-label="Increase font size"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Max Width */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Content Width</span>
                      <span className="font-medium">{maxWidth}rem</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMaxWidth(Math.max(50, maxWidth - 5))}
                        aria-label="Decrease width"
                      >
                        <Minimize2 className="h-4 w-4" />
                      </Button>
                      <Slider
                        value={[maxWidth]}
                        onValueChange={([value]) => setMaxWidth(value)}
                        min={50}
                        max={80}
                        step={5}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMaxWidth(Math.min(80, maxWidth + 5))}
                        aria-label="Increase width"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Theme Toggle */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Theme</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={localTheme === 'light' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLocalTheme('light')}
                        className="flex-1"
                      >
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </Button>
                      <Button
                        variant={localTheme === 'dark' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLocalTheme('dark')}
                        className="flex-1"
                      >
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </Button>
                      <Button
                        variant={localTheme === 'auto' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLocalTheme('auto')}
                        className="flex-1"
                      >
                        Auto
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div
            ref={contentRef}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            // eslint-disable-next-line react/forbid-dom-props
            style={{
              fontSize: `${fontSize}px`,
              maxWidth: `${maxWidth}rem`,
            }}
          >
            <div className="prose prose-lg prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:border prose-pre:border-border prose-img:rounded-lg prose-img:shadow-lg">
              {children}
            </div>
          </div>
        </div>
      )}

      {/* Regular Content (when not in reading mode) */}
      {!isReadingMode && children}
    </>
  )
}

