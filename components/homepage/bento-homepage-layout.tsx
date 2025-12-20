'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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
import { EnhancedScrollReveal } from '@/components/animations/enhanced-scroll-reveal'
import { HoverScale, HoverLift } from '@/components/animations/hover-effects'

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

// Bento grid configuration - responsive and centered
const BENTO_LAYOUT = {
  // Hero takes full width
  hero: { colSpan: 'col-span-full', rowSpan: 'row-span-1', order: 0 },
  // Quick stats - compact row
  quickStats: { colSpan: 'col-span-full md:col-span-4', rowSpan: 'row-span-1', order: 1 },
  // Tech snapshot - medium card
  techSnapshot: { colSpan: 'col-span-full md:col-span-4 lg:col-span-3', rowSpan: 'row-span-2', order: 2 },
  // About - medium card
  about: { colSpan: 'col-span-full md:col-span-4 lg:col-span-3', rowSpan: 'row-span-2', order: 3 },
  // Projects - large featured
  projects: { colSpan: 'col-span-full lg:col-span-6', rowSpan: 'row-span-3', order: 4 },
  // Experience - medium card
  experience: { colSpan: 'col-span-full md:col-span-6 lg:col-span-3', rowSpan: 'row-span-2', order: 5 },
  // Services - medium card
  services: { colSpan: 'col-span-full md:col-span-6 lg:col-span-3', rowSpan: 'row-span-2', order: 6 },
  // Courses - full width
  courses: { colSpan: 'col-span-full', rowSpan: 'row-span-2', order: 7 },
  // Contact - full width
  contact: { colSpan: 'col-span-full', rowSpan: 'row-span-1', order: 8 },
}

export default function BentoHomepageLayout() {
  const [sections, setSections] = useState<HomepageSection[]>([])
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])

  useEffect(() => {
    setMounted(true)
    setSections(getHomepageSections())

    const handleUpdate = (event: CustomEvent<HomepageSection[]>) => {
      setSections(event.detail)
    }

    window.addEventListener('homepage-customization-updated', handleUpdate as EventListener)
    return () => {
      window.removeEventListener('homepage-customization-updated', handleUpdate as EventListener)
    }
  }, [])

  const visibleSections = mounted
    ? sections.filter((s) => s.visible).sort((a, b) => a.order - b.order)
    : Object.keys(SECTION_COMPONENTS).map((key, index) => ({
        id: key.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase(),
        name: key,
        component: key,
        visible: true,
        order: index,
      }))

  return (
    <motion.div
      style={{ opacity }}
      className="min-h-screen"
    >
      {/* Bento Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-6 gap-4 md:gap-6 auto-rows-min">
          {visibleSections.map((section, index) => {
            const Component = SECTION_COMPONENTS[section.component]
            if (!Component) {
              console.warn(`Component ${section.component} not found`)
              return null
            }

            const layout = BENTO_LAYOUT[section.id as keyof typeof BENTO_LAYOUT] || {
              colSpan: 'col-span-full',
              rowSpan: 'row-span-1',
              order: index,
            }

            // Special handling for hero - full width outside grid, centered
            if (section.id === 'hero') {
              return (
                <div 
                  key={section.id} 
                  className="col-span-full mb-8 md:mb-12 flex justify-center items-center"
                  style={{ 
                    minHeight: 'calc(100vh - 120px)',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <div className="w-full max-w-6xl">
                    <EnhancedScrollReveal variant="fade" delay={0.1}>
                      <Component />
                    </EnhancedScrollReveal>
                  </div>
                </div>
              )
            }

            return (
              <motion.div
                key={section.id}
                className={`${layout.colSpan} ${layout.rowSpan} relative`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{ 
                  // Ensure tour guide elements stay centered
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <HoverLift lift={4}>
                  <div className="h-full glass rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden relative group will-change-transform">
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col">
                      <Component />
                    </div>

                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </HoverLift>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

