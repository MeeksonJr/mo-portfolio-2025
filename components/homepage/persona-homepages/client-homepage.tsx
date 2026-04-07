'use client'

import { motion } from 'framer-motion'
import HeroLight from '@/components/hero-light'
import ServicesScattered from '@/components/services-scattered'
import PricingScattered from '@/components/pricing-scattered'
import CaseStudyCard from '@/components/case-study-card'
import ClientShowcase from '@/components/clients/client-showcase'
import TestimonialsSection from '@/components/testimonials/testimonials-section'
import Contact from '@/components/contact-redesigned'

export default function ClientHomepage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20"
    >
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-20 md:py-32">
        <div className="w-full max-w-7xl">
          <HeroLight />
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl max-w-2xl mx-auto flex flex-col items-center gap-4 text-center">
            <h3 className="text-xl font-bold tracking-tight">Turning your vision into scalable software.</h3>
            <p className="text-muted-foreground text-sm">Welcome. You are viewing the Client layout. Explore case studies of business outcomes, read client testimonials, and view my service pipeline and availability.</p>
            <a href="#contact" className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors">
              Request a Consultation
            </a>
          </div>
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-16 md:space-y-24 pb-20 md:pb-32">
        <motion.section className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="frame-container">
            <ServicesScattered />
          </div>
          <div className="frame-container">
            <PricingScattered />
          </div>
        </motion.section>

        <motion.section className="max-w-2xl mx-auto">
          <div className="frame-container">
            <CaseStudyCard />
          </div>
        </motion.section>

        <motion.section className="relative">
          <ClientShowcase />
        </motion.section>

        <motion.section className="relative">
          <TestimonialsSection />
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
