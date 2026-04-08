'use client'

import { motion } from 'framer-motion'
import ExecutiveHero from '@/components/recruiter-dashboard/executive-hero'
import SkillsMatrix from '@/components/recruiter-dashboard/skills-matrix'
import Experience from '@/components/experience-redesigned'
import Contact from '@/components/contact-redesigned'

export default function RecruiterHomepage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-zinc-50 dark:bg-background text-zinc-900 dark:text-zinc-50"
    >
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-12 md:pt-20 pb-16">
        <ExecutiveHero />
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-16 md:space-y-24 py-16 md:py-24 border-t border-border">
        
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-card border border-border shadow-sm rounded-3xl p-6 md:p-10"
        >
          <Experience />
        </motion.div>

        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-card border border-border shadow-sm rounded-3xl p-6 md:p-10"
        >
          <SkillsMatrix />
        </motion.div>

        <motion.section className="max-w-3xl mx-auto">
          <div className="bg-card border border-border shadow-sm rounded-3xl p-6">
            <Contact />
          </div>
        </motion.section>

      </div>
    </motion.div>
  )
}
