'use client'

import { motion } from 'framer-motion'
import HeroLight from '@/components/hero-light'
import QuickStats from '@/components/quick-stats'
import Experience from '@/components/experience-redesigned'
import Contact from '@/components/contact-redesigned'

export default function RecruiterHomepage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20"
    >
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-20 md:py-32">
        <div className="w-full max-w-7xl">
          <HeroLight />
          <div className="mt-8 p-6 bg-card border shadow-lg rounded-xl max-w-2xl mx-auto flex flex-col items-center gap-4 text-center">
            <h3 className="text-xl font-bold tracking-tight">Looking for the bottom line?</h3>
            <p className="text-muted-foreground text-sm">You are viewing the Executive Dashboard layout. Below is a streamlined view of my professional experience, core competencies, and immediate contact details without the fluff.</p>
            <a href="/resume" target="_blank" className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors">
              Download Full Resume PDF
            </a>
          </div>
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-16 md:space-y-24 pb-20 md:pb-32">
        <motion.section className="relative">
          <div className="frame-container">
            <QuickStats />
          </div>
        </motion.section>

        <motion.section className="relative">
          <div className="frame-container">
            <Experience />
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
