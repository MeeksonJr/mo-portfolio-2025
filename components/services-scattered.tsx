'use client'

import { motion } from 'framer-motion'
import { Zap, Rocket, Sparkles, Check } from 'lucide-react'

const services = [
  {
    tier: 'Quick Fix',
    icon: Zap,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  {
    tier: 'Starter Site',
    icon: Rocket,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
    popular: true,
  },
  {
    tier: 'SaaS Setup',
    icon: Sparkles,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
]

export default function ServicesScattered() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-bold mb-1">Services</h2>
        <p className="text-xs text-muted-foreground">What I offer</p>
      </div>
      <div className="flex-1 space-y-3">
        {services.map((service, idx) => {
          const ServiceIcon = service.icon
          return (
            <motion.div
              key={service.tier}
              className={`glass-enhanced rounded-lg p-4 border ${service.borderColor} ${
                service.popular ? 'ring-2 ring-primary/30' : ''
              }`}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${service.bgColor} rounded-lg flex items-center justify-center`}>
                  <ServiceIcon className={service.color} size={16} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{service.tier}</div>
                  {service.popular && (
                    <div className="text-xs text-primary mt-0.5">Most Popular</div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

