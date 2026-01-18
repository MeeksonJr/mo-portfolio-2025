'use client'

import { motion } from 'framer-motion'
import { Heart, Sparkles, MapPin, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AboutLight() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Heart className="text-primary" size={20} />
          </div>
          <h2 className={TYPOGRAPHY.h3}>About Me</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        <div className="space-y-3 text-sm md:text-base text-foreground/80 leading-relaxed">
          <p>
            <strong className="text-primary">Born in Guinea</strong>, raised in NYC, now building in Norfolk, Virginia.
            I learned English in 3 months using cartoons like Dora after facing early bullying and setbacks — a
            testament to my resilience and creative problem-solving.
          </p>

          <p>
            Today, I'm a <strong className="text-primary">20-year-old Full Stack Developer</strong> at Old Dominion
            University, specializing in AI-powered web applications. I design and ship SaaS products from prototypes to
            live platforms with real users.
          </p>

          <p>
            Available for <strong className="text-primary">freelance, partnerships, and full-time roles</strong>. Let's
            build something amazing together!
          </p>
        </div>

        {/* Journey Timeline */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Journey
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium">Guinea</div>
                <div className="text-xs text-muted-foreground">Birthplace</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium">New York City</div>
                <div className="text-xs text-muted-foreground">Raised & Educated</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium">Norfolk, Virginia</div>
                <div className="text-xs text-muted-foreground">Currently Building</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <motion.div
          className="mt-6 pt-6 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground italic"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          <Sparkles className="text-primary" size={14} />
          <span>"From Guinea to Norfolk, from cartoons to code — the journey continues..."</span>
        </motion.div>

        {/* Learn More Button */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <Link href="/about">
            <Button variant="outline" className="w-full group">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

