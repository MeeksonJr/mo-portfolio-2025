'use client'

import { motion } from 'framer-motion'
import HeroLight from '@/components/hero-light'
import CaseStudies from '@/components/client-dashboard/case-studies'
import ServicesGrid from '@/components/client-dashboard/services-grid'
import Contact from '@/components/contact-redesigned'
import { ArrowRight } from 'lucide-react'

export default function ClientHomepage() {
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
            className="mt-8 p-8 bg-card border border-border shadow-sm rounded-3xl max-w-3xl mx-auto flex flex-col items-center gap-6 text-center"
          >
            <h3 className="text-2xl font-bold tracking-tight">Turning your vision into scalable software.</h3>
            <p className="text-muted-foreground text-lg">You are viewing the Corporate Client layout. Explore our previous case studies, service offerings, and request a technical consultation below.</p>
            <a href="#contact" className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg flex items-center gap-2">
              Request a Consultation <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-16 md:space-y-24 py-16 md:py-24 border-t border-border">
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-card border border-border shadow-sm rounded-3xl p-6 md:p-12"
        >
          <ServicesGrid />
        </motion.div>

        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="p-6 md:p-12"
        >
          <CaseStudies />
        </motion.div>

        <motion.section id="contact" className="max-w-3xl mx-auto">
          <div className="bg-card border border-border shadow-sm rounded-3xl p-6 md:p-12">
            <Contact />
          </div>
        </motion.section>
      </div>
    </motion.div>
  )
}
