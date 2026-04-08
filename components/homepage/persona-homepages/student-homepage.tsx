'use client'

import { motion } from 'framer-motion'
import CurrentSemester from '@/components/student-dashboard/current-semester'
import AcademicAudit from '@/components/student-dashboard/academic-audit'
import Contact from '@/components/contact-redesigned'
import { GraduationCap } from 'lucide-react'

export default function StudentHomepage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-zinc-50 dark:bg-background text-zinc-900 dark:text-zinc-50"
    >
      <section className="relative min-h-[40vh] flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-20 bg-blue-50/50 dark:bg-blue-950/20 border-b border-border">
        <div className="w-full max-w-7xl relative z-10 flex flex-col items-center mt-12 md:mt-0">
          <div className="mb-6 p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <GraduationCap className="w-10 h-10" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-center mb-4">
            Computer Science <span className="text-blue-600 dark:text-blue-400">Journey</span>
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl text-lg">
            A transparent look into my academic progress, current coursework, and continuous learning path at Old Dominion University.
          </p>
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-16 md:space-y-24 py-16 md:py-24">
        
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-card border border-border shadow-sm rounded-3xl p-6 md:p-10"
        >
          <CurrentSemester />
        </motion.div>

        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-card border border-border shadow-sm rounded-3xl p-6 md:p-10"
        >
          <AcademicAudit />
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
