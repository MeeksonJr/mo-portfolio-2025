"use client"

import { motion } from "framer-motion"
import { Heart, Sparkles } from "lucide-react"

export default function AboutLight() {
  return (
    <section id="about" className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="glass rounded-2xl p-8 md:p-12 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Heart className="text-primary" size={24} />
            <h2 className="text-3xl md:text-4xl font-bold">About Me</h2>
          </div>

          <div className="space-y-4 text-lg text-foreground/80 leading-relaxed">
            <p>
              <strong className="text-primary">Born in Guinea</strong>, raised in NYC, now building in Norfolk,
              Virginia. I learned English in 3 months using cartoons like Dora after facing early bullying and setbacks
              — a testament to my resilience and creative problem-solving.
            </p>

            <p>
              Today, I'm a <strong className="text-primary">20-year-old Full Stack Developer</strong> at Old Dominion
              University, specializing in AI-powered web applications. I design and ship SaaS products from prototypes
              to live platforms with real users.
            </p>

            <p>
              Available for <strong className="text-primary">freelance, partnerships, and full-time roles</strong>.
              Let's build something amazing together!
            </p>
          </div>

          <motion.div
            className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            <Sparkles className="text-primary" size={16} />
            <span className="italic">"From Guinea to Norfolk, from cartoons to code — the journey continues..."</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
