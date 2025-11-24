"use client"

import { motion } from "framer-motion"
import { Heart, Coffee, Github, Linkedin, Mail, ArrowUp, Trophy } from "lucide-react"
import Link from "next/link"
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup"

export default function FooterLight() {
  return (
    <footer className="py-12 px-4 border-t border-border bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-6">
              <motion.a
                href="https://github.com/MeeksonJr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <Github size={20} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/mohamed-datt-b60907296"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                href="mailto:d.mohamed1504@gmail.com"
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <Mail size={20} />
              </motion.a>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-2 text-foreground/70">
                <span>Crafted with</span>
                <Heart className="text-red-500" size={16} fill="currentColor" />
                <span>and lots of</span>
                <Coffee className="text-yellow-700" size={16} />
                <span>by Mohamed Datt</span>
              </div>
              <Link
                href="/achievements"
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                <Trophy className="h-4 w-4" />
                <span>View Achievements</span>
              </Link>
            </div>

            <div className="max-w-md mx-auto">
              <NewsletterSignup variant="compact" source="footer" />
            </div>

            <div className="text-sm text-muted-foreground">
              © 2025 Mohamed Datt • Next.js • TypeScript • Deployed on Vercel
            </div>

            <motion.div
              className="text-sm italic text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              "From Guinea to Norfolk, from cartoons to code — the journey continues..."
            </motion.div>

            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm font-medium hover:shadow-lg transition-all"
              whileHover={{ y: -2 }}
            >
              <ArrowUp size={16} />
              Back to Top
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
