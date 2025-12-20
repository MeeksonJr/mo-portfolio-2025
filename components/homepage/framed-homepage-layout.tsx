'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import HeroLight from '@/components/hero-light'
import QuickStats from '@/components/quick-stats'
import TechSnapshot from '@/components/tech-snapshot-redesigned'
import AboutLight from '@/components/about-light-redesigned'
import ProjectsLight from '@/components/projects-light-redesigned'
import Experience from '@/components/experience-redesigned'
import ServicesScattered from '@/components/services-scattered'
import PricingScattered from '@/components/pricing-scattered'
import CaseStudyCard from '@/components/case-study-card'
import CoursesSection from '@/components/courses-section-redesigned'
import Contact from '@/components/contact-redesigned'

export default function FramedHomepageLayout() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95])

  return (
    <motion.div
      style={{ opacity }}
      className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20"
    >
      {/* Hero Section - Full Width Frame */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-20 md:py-32">
        <div className="w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <HeroLight />
          </motion.div>
        </div>
      </section>

      {/* Main Content - Flowing Sections */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-16 md:space-y-24 pb-20 md:pb-32">
        
        {/* Quick Stats - Horizontal Frame Row */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="frame-container">
            <QuickStats />
          </div>
        </motion.section>

        {/* Services & Pricing - Side by Side Frames */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 md:gap-8"
        >
          <div className="frame-container">
            <ServicesScattered />
          </div>
          <div className="frame-container">
            <PricingScattered />
          </div>
        </motion.section>

        {/* Case Study - Centered Frame */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="frame-container">
            <CaseStudyCard />
          </div>
        </motion.section>

        {/* Tech Stack & About - Side by Side Frames */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6 md:gap-8"
        >
          <div className="frame-container">
            <TechSnapshot />
          </div>
          <div className="frame-container">
            <AboutLight />
          </div>
        </motion.section>

        {/* Experience - Full Width Frame */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          <div className="frame-container">
            <Experience />
          </div>
        </motion.section>

        {/* Projects - Full Width Frame */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative"
        >
          <div className="frame-container">
            <ProjectsLight />
          </div>
        </motion.section>

        {/* Education - Full Width Frame */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative"
        >
          <div className="frame-container">
            <CoursesSection />
          </div>
        </motion.section>

        {/* Contact - Centered Frame */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <div className="frame-container">
            <Contact />
          </div>
        </motion.section>

      </div>
    </motion.div>
  )
}

