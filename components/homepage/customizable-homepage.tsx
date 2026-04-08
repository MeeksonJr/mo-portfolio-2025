'use client'

import { useEffect, useState } from 'react'
import { usePersonalization } from '@/components/personalization/visitor-profile-provider'
import DeveloperHomepage from '@/components/homepage/persona-homepages/developer-homepage'
import RecruiterHomepage from '@/components/homepage/persona-homepages/recruiter-homepage'
import ClientHomepage from '@/components/homepage/persona-homepages/client-homepage'
import GeneralHomepage from '@/components/homepage/persona-homepages/general-homepage'
import StudentHomepage from '@/components/homepage/persona-homepages/student-homepage'

export default function CustomizableHomepage() {
  const [mounted, setMounted] = useState(false)
  const { profile } = usePersonalization()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (mounted) {
    switch (profile.type) {
      case 'developer':
        return <DeveloperHomepage />
      case 'recruiter':
        return <RecruiterHomepage />
      case 'client':
        return <ClientHomepage />
      case 'student':
        return <StudentHomepage />
      case 'general':
      default:
        return <GeneralHomepage />
    }
  }

  // Show skeleton during mount
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12 space-y-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 frame-container animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}

