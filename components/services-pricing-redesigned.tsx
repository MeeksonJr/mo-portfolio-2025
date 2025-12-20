'use client'

import { motion } from 'framer-motion'
import { Check, Zap, Rocket, Sparkles, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const services = [
  {
    tier: 'Quick Fix',
    price: '$150 - $300',
    description: 'Bug fixes, small features, or quick consultations',
    features: ['1-2 hour response time', 'Code review & debugging', 'Small feature additions', 'Performance optimization'],
    deliveryTime: '1-3 days',
    icon: Zap,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  {
    tier: 'Starter Site',
    price: '$300 - $700',
    description: 'Professional landing pages and portfolio sites',
    features: [
      'Responsive design',
      'SEO optimization',
      'Contact form integration',
      'GitHub deployment',
      '1 month support',
    ],
    deliveryTime: '1-2 weeks',
    popular: true,
    icon: Rocket,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    tier: 'SaaS Setup',
    price: '$1,500+',
    description: 'Full-stack applications with AI integration',
    features: [
      'Complete app development',
      'Authentication & database',
      'AI/API integrations',
      'Payment processing',
      'Deployment & hosting',
      '3 months support & maintenance',
    ],
    deliveryTime: '4-8 weeks',
    icon: Sparkles,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
]

export default function ServicesPricing() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Services & Pricing</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          From quick fixes to full SaaS builds. Transparent pricing, quality delivery.
        </p>
      </div>

      {/* Services Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-4 mb-6">
          {services.map((service, idx) => {
            const ServiceIcon = service.icon
            return (
              <motion.div
                key={service.tier}
                className={`glass-enhanced rounded-xl p-5 relative flex flex-col ${
                  service.popular ? 'ring-2 ring-primary/50' : ''
                }`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                {service.popular && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-0.5 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 ${service.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <ServiceIcon className={service.color} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-1">{service.tier}</h3>
                    <div className={`text-xl font-bold ${service.color} mb-1`}>{service.price}</div>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="text-primary mt-0.5 flex-shrink-0" size={14} />
                      <span className="text-xs">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery time */}
                <div className="mb-4 pt-3 border-t border-border/50">
                  <div className="text-xs text-muted-foreground">Delivery time</div>
                  <div className="text-sm font-medium">{service.deliveryTime}</div>
                </div>

                {/* Button */}
                <button
                  onClick={() => setShowModal(true)}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
                    service.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  Request Quote
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Case Study */}
        <motion.div
          className="glass-enhanced rounded-xl p-5"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="text-primary" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold mb-2">Case Study: InterviewPrep AI</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Sold for <span className="font-bold text-primary">$500</span> — Full mock-interview platform with voice
                feedback. Delivered in 6 weeks with ongoing maintenance contracted.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 text-xs text-primary font-medium hover:gap-3 transition-all"
              >
                Request similar project
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
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

