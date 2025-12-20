'use client'

import { motion } from 'framer-motion'
import { Sparkles, DollarSign, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function CaseStudyCard() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold">Case Study</h2>
        </div>
        <p className="text-xs text-muted-foreground">InterviewPrep AI</p>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="font-bold text-sm text-green-600 dark:text-green-400">Sold for $500</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Full mock-interview platform with voice feedback. Delivered in 6 weeks.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
        >
          Request Similar
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            className="glass-enhanced rounded-2xl p-6 max-w-md w-full shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Request a Quote</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Send me an email at{' '}
              <a href="mailto:d.mohamed1504@gmail.com" className="text-primary font-medium">
                d.mohamed1504@gmail.com
              </a>{' '}
              with your project details, and I'll get back to you within 24 hours!
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
            >
              Got it!
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

