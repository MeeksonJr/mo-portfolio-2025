'use client'

import { motion } from 'framer-motion'
import HeroLight from '@/components/hero-light'
import TechSnapshot from '@/components/tech-snapshot-redesigned'
import ProjectsLight from '@/components/projects-light-redesigned'
import Contact from '@/components/contact-redesigned'

export default function DeveloperHomepage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20"
    >
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-20 md:py-32">
        <div className="w-full max-w-7xl">
          <HeroLight />
          <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-mono font-bold text-primary mb-2">/usr/bin/welcome --role=developer</h3>
            <p className="text-muted-foreground font-mono text-sm">System initialized. Welcome to the codebase. Below you'll find architecture teardowns, live code playgrounds, and raw technical metrics.</p>
          </div>
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-16 md:space-y-24 pb-20 md:pb-32">
        <motion.section className="relative">
          <div className="frame-container">
            <TechSnapshot />
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
