'use client'

import { useEffect, useState } from 'react'
import { getHomepageSections, type HomepageSection } from '@/lib/homepage-customization'
import HeroLight from '@/components/hero-light'
import QuickStats from '@/components/quick-stats'
import TechSnapshot from '@/components/tech-snapshot'
import AboutLight from '@/components/about-light'
import ProjectsLight from '@/components/projects-light'
import Experience from '@/components/experience'
import ServicesPricing from '@/components/services-pricing'
import CoursesSection from '@/components/courses-section'
import Contact from '@/components/contact'

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  HeroLight,
  QuickStats,
  TechSnapshot,
  AboutLight,
  ProjectsLight,
  Experience,
  ServicesPricing,
  CoursesSection,
  Contact,
}

export default function CustomizableHomepage() {
  const [sections, setSections] = useState<HomepageSection[]>([])

  useEffect(() => {
    setSections(getHomepageSections())

    const handleUpdate = (event: CustomEvent<HomepageSection[]>) => {
      setSections(event.detail)
    }

    window.addEventListener('homepage-customization-updated', handleUpdate as EventListener)
    return () => {
      window.removeEventListener('homepage-customization-updated', handleUpdate as EventListener)
    }
  }, [])

  // Render sections based on customization
  const visibleSections = sections.filter((s) => s.visible).sort((a, b) => a.order - b.order)

  return (
    <>
      {visibleSections.map((section) => {
        const Component = SECTION_COMPONENTS[section.component]
        if (!Component) {
          console.warn(`Component ${section.component} not found`)
          return null
        }
        return <Component key={section.id} />
      })}
    </>
  )
}

