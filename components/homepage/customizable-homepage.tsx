'use client'

import { useEffect, useState } from 'react'
import { getHomepageSections, type HomepageSection } from '@/lib/homepage-customization'
import BentoHomepageLayout from '@/components/homepage/bento-homepage-layout'

export default function CustomizableHomepage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use bento layout for enhanced design
  if (mounted) {
    return <BentoHomepageLayout />
  }

  // Show skeleton during mount
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-6 gap-4 md:gap-6">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="col-span-full h-64 glass rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

