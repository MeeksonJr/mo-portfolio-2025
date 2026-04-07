'use client'

import { motion } from 'framer-motion'
import HeroLight from '@/components/hero-light'
import AboutLight from '@/components/about-light-redesigned'
import ProjectsLight from '@/components/projects-light-redesigned'
import Contact from '@/components/contact-redesigned'
import MusicHub from '@/components/music/music-hub'

export default function GeneralHomepage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20"
    >
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-20 md:py-32">
        <div className="w-full max-w-7xl">
          <HeroLight />
          <div className="mt-8 p-6 bg-secondary/20 border rounded-xl max-w-2xl mx-auto flex flex-col items-center gap-4 text-center">
            <h3 className="text-xl font-bold tracking-tight">Welcome into my world.</h3>
            <p className="text-muted-foreground text-sm">You are viewing the General visitor layout. Learn more about my journey, explore some highlighted projects, and listen to the music I've curated.</p>
          </div>
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-16 md:space-y-24 pb-20 md:pb-32">
        <motion.section className="relative">
          <div className="frame-container">
            <AboutLight />
          </div>
        </motion.section>

        <motion.section className="relative">
          <div className="frame-container">
            <ProjectsLight />
          </div>
        </motion.section>

        <motion.section className="relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Vibe Check</h2>
            <p className="text-muted-foreground mt-2">Listen to what's on my playlist right now.</p>
          </div>
          <div className="frame-container">
            <MusicHub />
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
