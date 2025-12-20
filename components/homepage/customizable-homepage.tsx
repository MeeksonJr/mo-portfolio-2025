'use client'

import { useEffect, useState } from 'react'
import FramedHomepageLayout from '@/components/homepage/framed-homepage-layout'

export default function CustomizableHomepage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use new framed layout for clean, flowing design
  if (mounted) {
    return <FramedHomepageLayout />
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

