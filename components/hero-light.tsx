"use client"

import { motion } from "framer-motion"
import { ArrowRight, Download, Sparkles } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import AvailabilityBadge from "@/components/availability-badge"
import PageContainer from '@/components/layout/page-container'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

export default function HeroLight() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Predefined positions and animations to avoid hydration mismatches
  const particleData = [
    { left: 15, top: 20, duration: 3.2, delay: 0.5 },
    { left: 85, top: 15, duration: 4.1, delay: 1.2 },
    { left: 25, top: 75, duration: 2.8, delay: 0.8 },
    { left: 70, top: 60, duration: 3.7, delay: 1.5 },
    { left: 45, top: 30, duration: 4.3, delay: 0.3 },
    { left: 90, top: 80, duration: 2.9, delay: 1.8 },
    { left: 10, top: 50, duration: 3.5, delay: 0.7 },
    { left: 60, top: 10, duration: 4.0, delay: 1.1 },
    { left: 35, top: 90, duration: 3.1, delay: 0.9 },
    { left: 80, top: 40, duration: 2.7, delay: 1.6 },
    { left: 5, top: 25, duration: 3.8, delay: 0.4 },
    { left: 95, top: 65, duration: 4.2, delay: 1.3 },
    { left: 20, top: 85, duration: 2.6, delay: 1.7 },
    { left: 75, top: 25, duration: 3.4, delay: 0.6 },
    { left: 50, top: 70, duration: 3.9, delay: 1.0 },
    { left: 30, top: 45, duration: 2.5, delay: 1.4 },
    { left: 65, top: 95, duration: 4.4, delay: 0.2 },
    { left: 15, top: 60, duration: 3.3, delay: 1.9 },
    { left: 85, top: 35, duration: 2.8, delay: 0.8 },
    { left: 40, top: 15, duration: 3.6, delay: 1.2 },
  ]

  return (
    <section className="min-h-[80vh] md:min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12 md:py-20">
      {/* Subtle animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-purple-500/10"></div>
        {isClient && particleData.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <PageContainer width="standard" className="w-full relative z-10">
        <motion.div
          className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-xl border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Photo */}
            <motion.div
              className="flex justify-center lg:justify-start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                  <Image
                    src="/images/Photo.jpg"
                    alt="Mohamed Datt"
                    width={320}
                    height={320}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
                <motion.div
                  className="absolute -bottom-4 -right-4 glass rounded-xl px-4 py-2 shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Available</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right side - Content */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-primary" size={20} />
                    <span className="text-sm font-medium text-muted-foreground">Full-Stack Developer</span>
                  </div>
                  <AvailabilityBadge variant="compact" />
                </div>
                <h1 className={cn(TYPOGRAPHY.h1, "mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent")}>
                  Mohamed Datt
                </h1>
                <p className={cn(TYPOGRAPHY.lead, "text-muted-foreground mb-6")}>
                  AI-driven web products & SaaS solutions
                </p>
              </motion.div>

              <motion.p
                className="text-base md:text-lg text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Born in Guinea, raised in NYC, now building in Norfolk. I design and ship AI-powered SaaS and web apps —
                from prototypes to live products.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {[
                  { trait: "Resilient", tip: "Overcame early challenges" },
                  { trait: "Creative", tip: "Innovative problem solver" },
                  { trait: "Resourceful", tip: "Maximizes opportunities" },
                  { trait: "Self-taught", tip: "Continuous learner" },
                ].map((item) => (
                  <span
                    key={item.trait}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 cursor-help"
                    title={item.tip}
                  >
                    {item.trait}
                  </span>
                ))}
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-4 pt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
                >
                  View Work
                  <ArrowRight size={18} />
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 px-6 py-3 glass rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Get Quote
                </a>
                <a
                  href="/resume-Mohamed-Datt-Full Stack Developer-2025.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Mohamed-Datt-Resume-2025.pdf"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary/95 backdrop-blur-sm text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all hover:scale-105 shadow-lg border-2 border-primary/20"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).unlockAchievement) {
                      ;(window as any).unlockAchievement('download-resume')
                    }
                  }}
                >
                  <Download size={18} />
                  Download Resume
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  )
}
