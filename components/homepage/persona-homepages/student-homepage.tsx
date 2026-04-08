'use client'

import { motion } from 'framer-motion'
import HeroLight from '@/components/hero-light'
import ProjectsLight from '@/components/projects-light-redesigned'
import CoursesSection from '@/components/courses-section-redesigned'
import Contact from '@/components/contact-redesigned'

export default function StudentHomepage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20"
    >
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-20 md:py-32">
        <div className="w-full max-w-7xl">
          <HeroLight />
          <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl max-w-2xl mx-auto flex flex-col items-center gap-4 text-center">
            <h3 className="text-xl font-bold tracking-tight">Always learning, always building.</h3>
            <p className="text-muted-foreground text-sm">Welcome to the Student view. Explore the courses I've taken, my academic journey, and the projects I've built along the way.</p>
          </div>
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-16 md:space-y-24 pb-20 md:pb-32">
        <motion.section className="relative">
          <div className="frame-container">
            <CoursesSection />
          </div>
        </motion.section>

        <motion.section className="relative">
          <div className="frame-container">
            <ProjectsLight />
          </div>
        </motion.section>

        <motion.section className="max-w-3xl mx-auto">
          <div className="frame-container">
            <Contact />
          </div>
        </motion.section>
      </div>
    </motion.div>
  )
}
