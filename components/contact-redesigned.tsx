'use client'

import { motion } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, Terminal, Mail, MessageSquare } from 'lucide-react'
import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { submitContactForm } from '@/app/actions/contact'
import { useAchievementTracking } from '@/hooks/use-achievement-tracking'

export default function Contact() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(submitContactForm, null)
  const [showCursor, setShowCursor] = useState(true)
  const { trackAchievement } = useAchievementTracking()

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (state?.success) {
      trackAchievement('contact-form')
      const timer = setTimeout(() => {
        router.push('/contact/success')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [state?.success, router, trackAchievement])

  const terminalCommands = [
    '$ whoami',
    '> Mohamed Datt - Full Stack Developer',
    '$ location',
    '> Norfolk, Virginia, USA',
    '$ status',
    '> Available for opportunities & collaborations',
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <MessageSquare className="text-primary" size={20} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Get In Touch</h2>
        </div>
        <p className="text-sm md:text-base text-muted-foreground">Let's build something amazing together</p>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pr-2">
        {/* Terminal Preview */}
        <div className="glass-enhanced rounded-xl p-4 mb-6 border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground ml-2">Terminal</span>
          </div>
          <div className="space-y-1 font-mono text-xs">
            {terminalCommands.map((cmd, i) => (
              <div
                key={i}
                className={cmd.startsWith('$') ? 'text-primary' : cmd.startsWith('>') ? 'text-foreground/70' : ''}
              >
                {cmd}
              </div>
            ))}
            <div className="flex items-center gap-1 text-primary">
              <span>$</span>
              <span className={showCursor ? 'opacity-100' : 'opacity-0'}>_</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form action={formAction} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1.5">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              placeholder="Tell me about your project..."
            />
          </div>

          {/* Success/Error Messages */}
          {state?.success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-600 dark:text-green-400">Message sent successfully!</span>
            </motion.div>
          )}

          {state?.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-600 dark:text-red-400">{state.error}</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Message
              </>
            )}
          </button>

          {/* Quick Contact */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2 text-center">Or reach out directly:</p>
            <a
              href="mailto:d.mohamed1504@gmail.com"
              className="flex items-center justify-center gap-2 text-sm text-primary hover:gap-3 transition-all font-medium"
            >
              <Mail className="w-4 h-4" />
              d.mohamed1504@gmail.com
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

