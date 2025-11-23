'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Mail, ArrowLeft, Home, Github, Linkedin, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ContactSuccessContent() {
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = '/'
    }
  }, [countdown])

  return (
    <div className="max-w-2xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass rounded-2xl p-8 md:p-12 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
          className="mb-6 flex justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="text-primary" size={48} />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Message Sent Successfully!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-muted-foreground mb-8"
        >
          Thank you for reaching out! I've received your message and will get back to you as soon as possible.
        </motion.p>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-muted/50 rounded-lg p-6 mb-8 text-left"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Mail className="text-primary" size={20} />
            What's Next?
          </h2>
          <ul className="space-y-2 text-foreground/70">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>I typically respond within 24-48 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Check your email (including spam folder) for my response</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>For urgent matters, feel free to reach out on social media</span>
            </li>
          </ul>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <p className="text-sm text-muted-foreground mb-4">Connect with me on:</p>
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/MeeksonJr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/mohameddatt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <Linkedin size={20} />
              <span>LinkedIn</span>
            </a>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <Link
            href="/#contact"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
          >
            <ArrowLeft size={20} />
            Send Another Message
          </Link>
        </motion.div>

        {/* Auto-redirect Notice */}
        {countdown > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            Redirecting to home in {countdown} seconds...
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}

