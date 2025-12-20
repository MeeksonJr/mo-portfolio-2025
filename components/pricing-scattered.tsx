'use client'

import { motion } from 'framer-motion'
import { DollarSign, Clock, Check } from 'lucide-react'

const pricingTiers = [
  {
    tier: 'Quick Fix',
    price: '$150 - $300',
    deliveryTime: '1-3 days',
    features: ['Bug fixes', 'Small features', 'Quick consultations'],
  },
  {
    tier: 'Starter Site',
    price: '$300 - $700',
    deliveryTime: '1-2 weeks',
    features: ['Responsive design', 'SEO optimization', 'Contact forms'],
  },
  {
    tier: 'SaaS Setup',
    price: '$1,500+',
    deliveryTime: '4-8 weeks',
    features: ['Full-stack app', 'AI integration', 'Payment processing'],
  },
]

export default function PricingScattered() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-bold mb-1 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Pricing
        </h2>
        <p className="text-xs text-muted-foreground">Transparent rates</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {pricingTiers.map((tier, idx) => (
          <motion.div
            key={tier.tier}
            className="glass-enhanced rounded-lg p-4 border border-border/50 hover:border-primary/30"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="font-bold text-lg mb-1">{tier.price}</div>
            <div className="text-xs text-muted-foreground mb-2">{tier.tier}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <Clock className="w-3 h-3" />
              {tier.deliveryTime}
            </div>
            <div className="space-y-1">
              {tier.features.slice(0, 2).map((feature, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs">
                  <Check className="w-3 h-3 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

