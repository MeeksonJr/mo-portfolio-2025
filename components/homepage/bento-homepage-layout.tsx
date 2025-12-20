'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { getHomepageSections, type HomepageSection } from '@/lib/homepage-customization'
import HeroLight from '@/components/hero-light'
import QuickStats from '@/components/quick-stats'
import TechSnapshot from '@/components/tech-snapshot-redesigned'
import AboutLight from '@/components/about-light-redesigned'
import ProjectsLight from '@/components/projects-light-redesigned'
import Experience from '@/components/experience-redesigned'
import ServicesPricing from '@/components/services-pricing-redesigned'
import CoursesSection from '@/components/courses-section-redesigned'
import Contact from '@/components/contact-redesigned'
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

// Bento grid configuration - responsive and spacious
const BENTO_LAYOUT = {
  // Hero takes full width with generous spacing
  hero: { 
    colSpan: 'col-span-full', 
    rowSpan: 'row-span-1', 
    order: 0,
    minHeight: 'min-h-[calc(100vh-120px)]',
  },
  // Quick stats - compact row, spans 4 columns on desktop
  quickStats: { 
    colSpan: 'col-span-full md:col-span-8 lg:col-span-4', 
    rowSpan: 'row-span-1', 
    order: 1,
    minHeight: 'min-h-[200px]',
  },
  // Tech snapshot - medium card, 4 columns on desktop
  techSnapshot: { 
    colSpan: 'col-span-full md:col-span-4 lg:col-span-4', 
    rowSpan: 'row-span-2', 
    order: 2,
    minHeight: 'min-h-[400px]',
  },
  // About - medium card, 4 columns on desktop
  about: { 
    colSpan: 'col-span-full md:col-span-4 lg:col-span-4', 
    rowSpan: 'row-span-2', 
    order: 3,
    minHeight: 'min-h-[400px]',
  },
  // Projects - large featured, 8 columns on desktop
  projects: { 
    colSpan: 'col-span-full lg:col-span-8', 
    rowSpan: 'row-span-3', 
    order: 4,
    minHeight: 'min-h-[600px]',
  },
  // Experience - medium card, 4 columns on desktop
  experience: { 
    colSpan: 'col-span-full md:col-span-6 lg:col-span-4', 
    rowSpan: 'row-span-2', 
    order: 5,
    minHeight: 'min-h-[400px]',
  },
  // Services - medium card, 4 columns on desktop
  services: { 
    colSpan: 'col-span-full md:col-span-6 lg:col-span-4', 
    rowSpan: 'row-span-2', 
    order: 6,
    minHeight: 'min-h-[400px]',
  },
  // Courses - full width with internal grid
  courses: { 
    colSpan: 'col-span-full', 
    rowSpan: 'row-span-2', 
    order: 7,
    minHeight: 'min-h-[400px]',
  },
  // Contact - full width, centered
  contact: { 
    colSpan: 'col-span-full', 
    rowSpan: 'row-span-1', 
    order: 8,
    minHeight: 'min-h-[300px]',
  },
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
      {/* Bento Grid Container - Spacious and Responsive */}
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 md:py-12 lg:py-16 xl:py-20">
        <div className="max-w-[1280px] lg:max-w-[1440px] xl:max-w-[1600px] mx-auto">
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 xl:gap-10 auto-rows-min">
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

            // Special handling for hero - full width with generous spacing and enhanced animations
            if (section.id === 'hero') {
              return (
                <motion.div 
                  key={section.id} 
                  className="col-span-full mb-12 md:mb-16 lg:mb-20 xl:mb-24 flex justify-center items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ 
                    minHeight: 'calc(100vh - 120px)',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <div className="w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
                    <EnhancedScrollReveal variant="fade" delay={0.2} duration={0.8}>
                      <Component />
                    </EnhancedScrollReveal>
                  </div>
                </motion.div>
              )
            }

            return (
              <motion.div
                key={section.id}
                className={`${layout.colSpan} ${layout.rowSpan} ${layout.minHeight || ''} relative`}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{ 
                  // Ensure tour guide elements stay centered
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <HoverLift lift={6}>
                  <div className="h-full glass-enhanced rounded-2xl md:rounded-3xl p-5 md:p-8 lg:p-10 xl:p-12 border border-border/50 hover:border-primary/40 transition-all duration-300 overflow-hidden relative group will-change-transform">
                    {/* Enhanced gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/8 group-hover:via-primary/3 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
                    
                    {/* Animated border glow on hover */}
                    <div className="absolute inset-0 rounded-2xl md:rounded-3xl border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-500 pointer-events-none" />
                    
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col">
                      <Component />
                    </div>

                    {/* Enhanced decorative corner accents */}
                    <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-primary/15 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                </HoverLift>
              </motion.div>
            )
          })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

