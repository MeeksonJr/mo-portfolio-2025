'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import {
  getVisitorProfile,
  trackContentView,
  updateTimeOnSite,
  type VisitorProfile,
  type VisitorType,
} from '@/lib/visitor-profiling'

interface PersonalizationContextType {
  profile: VisitorProfile
  updateProfile: () => void
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined)

export function usePersonalization() {
  const context = useContext(PersonalizationContext)
  if (!context) {
    throw new Error('usePersonalization must be used within VisitorProfileProvider')
  }
  return context
}

interface VisitorProfileProviderProps {
  children: ReactNode
}

export default function VisitorProfileProvider({ children }: VisitorProfileProviderProps) {
  const [profile, setProfile] = useState<VisitorProfile>(() => {
    if (typeof window !== 'undefined') {
      return getVisitorProfile()
    }
    return {
      type: 'general',
      confidence: 0,
      interests: [],
      viewedContent: [],
      timeOnSite: 0,
      lastVisit: new Date().toISOString(),
    }
  })
  const pathname = usePathname()

  useEffect(() => {
    // Track page view
    if (pathname && typeof window !== 'undefined') {
      trackContentView(pathname)
      setProfile(getVisitorProfile())
    }
  }, [pathname])

  useEffect(() => {
    // Track time on site
    if (typeof window === 'undefined') return

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      updateTimeOnSite(elapsed)
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const updateProfile = () => {
    if (typeof window !== 'undefined') {
      setProfile(getVisitorProfile())
    }
  }

  return (
    <PersonalizationContext.Provider value={{ profile, updateProfile }}>
      {children}
    </PersonalizationContext.Provider>
  )
}

