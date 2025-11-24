'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Wifi } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      // Show "back online" message briefly
      setWasOffline(true)
      setTimeout(() => {
        setWasOffline(false)
      }, 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950">
            <CardContent className="flex items-center gap-3 p-4">
              <WifiOff className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  You're offline
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  Some features may be limited. Content is cached for offline viewing.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {wasOffline && isOnline && (
        <motion.div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Card className="border-green-500 bg-green-50 dark:bg-green-950">
            <CardContent className="flex items-center gap-3 p-4">
              <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Back online
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Connection restored. All features are available.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

