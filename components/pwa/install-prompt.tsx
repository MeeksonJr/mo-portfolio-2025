'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if app was installed before
    const installed = localStorage.getItem('pwa-installed')
    if (installed === 'true') {
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show prompt after a delay (don't be too pushy)
      const hasSeenPrompt = localStorage.getItem('pwa-prompt-seen')
      if (!hasSeenPrompt) {
        setTimeout(() => {
          setShowPrompt(true)
        }, 3000) // Show after 3 seconds
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if app was just installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowPrompt(false)
      localStorage.setItem('pwa-installed', 'true')
      localStorage.removeItem('pwa-prompt-seen')
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support beforeinstallprompt
      // Show instructions instead
      setShowPrompt(false)
      alert(
        'To install this app:\n\n' +
        'iOS: Tap the Share button and select "Add to Home Screen"\n\n' +
        'Android: Tap the menu (⋮) and select "Install app" or "Add to Home Screen"\n\n' +
        'Desktop: Look for the install icon in your browser\'s address bar'
      )
      return
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt()

      // Wait for the user to respond
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        setIsInstalled(true)
        localStorage.setItem('pwa-installed', 'true')
      }

      // Clear the deferred prompt
      setDeferredPrompt(null)
      setShowPrompt(false)
      localStorage.setItem('pwa-prompt-seen', 'true')
    } catch (error) {
      console.error('Error showing install prompt:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-seen', 'true')
    // Don't show again for 7 days
    const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000
    localStorage.setItem('pwa-prompt-dismissed', expiry.toString())
  }

  // Don't show if already installed or if user dismissed recently
  useEffect(() => {
    if (isInstalled) {
      setShowPrompt(false)
      return
    }

    const dismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissed) {
      const expiry = parseInt(dismissed)
      if (Date.now() < expiry) {
        setShowPrompt(false)
        return
      } else {
        localStorage.removeItem('pwa-prompt-dismissed')
      }
    }
  }, [isInstalled])

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          className="fixed bottom-20 left-4 right-4 z-50 lg:left-auto lg:right-4 lg:max-w-md"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Card className="shadow-2xl border-2">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Install App</CardTitle>
                    <CardDescription className="text-sm">
                      Install this app for a better experience
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleDismiss}
                  aria-label="Dismiss install prompt"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button
                  onClick={handleInstallClick}
                  className="flex-1 gap-2"
                  size="sm"
                >
                  <Download className="h-4 w-4" />
                  Install Now
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDismiss}
                  size="sm"
                >
                  Maybe Later
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Get faster access, offline support, and a native app experience
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

