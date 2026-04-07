'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import AppLoadingScreen from '@/components/loading/app-loading-screen'
import PageTransition from '@/components/loading/page-transition'
import { usePersonalization } from '@/components/personalization/visitor-profile-provider'

interface ClientLayoutWrapperProps {
  children: React.ReactNode
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const pathname = usePathname()
  const { setShowPersonaModal } = usePersonalization()

  useEffect(() => {
    // Check if this is the first load
    const hasVisited = sessionStorage.getItem('hasVisited')
    
    if (!hasVisited) {
      // First visit - show loading screen
      sessionStorage.setItem('hasVisited', 'true')
    } else {
      // Subsequent visits - skip loading screen
      setIsInitialLoad(false)
      
      // If they skipped the loading screen on subsequent route, 
      // check if they've ever seen the persona modal at least once in their history
      if (typeof window !== 'undefined') {
        const hasVisitedBefore = localStorage.getItem('hasVisitedBefore')
        if (!hasVisitedBefore) {
          setShowPersonaModal(true)
        }
      }
    }
  }, [setShowPersonaModal])

  const handleLoadingComplete = () => {
    setIsInitialLoad(false)
    if (typeof window !== 'undefined') {
      const hasVisitedBefore = localStorage.getItem('hasVisitedBefore')
      if (!hasVisitedBefore) {
        setShowPersonaModal(true)
      }
    }
  }

  return (
    <>
      {isInitialLoad && (
        <AppLoadingScreen onComplete={handleLoadingComplete} duration={3.5} />
      )}
      {!isInitialLoad && (
        <PageTransition>
          {children}
        </PageTransition>
      )}
    </>
  )
}

