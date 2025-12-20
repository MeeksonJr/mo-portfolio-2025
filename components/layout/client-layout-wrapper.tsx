'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import AppLoadingScreen from '@/components/loading/app-loading-screen'
import PageTransition from '@/components/loading/page-transition'
import BreadcrumbNavigation from '@/components/navigation/breadcrumb-navigation'

interface ClientLayoutWrapperProps {
  children: React.ReactNode
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Check if this is the first load
    const hasVisited = sessionStorage.getItem('hasVisited')
    
    if (!hasVisited) {
      // First visit - show loading screen
      sessionStorage.setItem('hasVisited', 'true')
    } else {
      // Subsequent visits - skip loading screen
      setIsInitialLoad(false)
    }
  }, [])

  const handleLoadingComplete = () => {
    setIsInitialLoad(false)
  }

  return (
    <>
      {isInitialLoad && (
        <AppLoadingScreen onComplete={handleLoadingComplete} duration={3.5} />
      )}
      {!isInitialLoad && (
        <PageTransition>
          <BreadcrumbNavigation />
          {children}
        </PageTransition>
      )}
    </>
  )
}

