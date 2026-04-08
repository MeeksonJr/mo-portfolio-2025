'use client'

import { motion } from 'framer-motion'
import HeroLight from '@/components/hero-light'
import Contact from '@/components/contact-redesigned'
import NavigationBentoGrid from '@/components/general-dashboard/navigation-bento-grid'

export default function GeneralHomepage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-zinc-50 dark:bg-background text-zinc-900 dark:text-zinc-50"
    >
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-20 md:py-32">
        <div className="w-full max-w-7xl">
          <HeroLight />
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 p-6 md:p-8 bg-card border border-border shadow-sm rounded-3xl max-w-3xl mx-auto flex flex-col items-center gap-4 text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight">Step into my ecosystem.</h2>
            <p className="text-muted-foreground text-lg">You are exploring the General layout. Rather than overwhelming you with endless content, please choose a portal below to dive deep into my technical vault, listen to curated tracks, or read my latest thoughts.</p>
          </motion.div>
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-16 md:space-y-24 py-16 md:py-24 border-t border-border">
        
        <motion.section className="relative w-full">
          <NavigationBentoGrid />
        </motion.section>

        <motion.section className="max-w-3xl mx-auto">
          <div className="bg-card border border-border shadow-sm rounded-3xl p-6 md:p-12">
            <Contact />
          </div>
        </motion.section>

      </div>
    </motion.div>
  )
}
