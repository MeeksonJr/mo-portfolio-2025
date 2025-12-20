'use client'

import { motion } from 'framer-motion'
import { HoverScale } from '@/components/animations/hover-effects'

const stats = [
  { label: "Years Coding", value: "5+", icon: "💻", color: "from-blue-500/20 to-cyan-500/20" },
  { label: "Projects Shipped", value: "15+", icon: "🚀", color: "from-purple-500/20 to-pink-500/20" },
  { label: "Sites Sold", value: "2", icon: "💰", color: "from-green-500/20 to-emerald-500/20" },
  { label: "Award Winner", value: "1st Place", icon: "🏆", color: "from-yellow-500/20 to-orange-500/20" },
]

export default function EnhancedQuickStats() {
  return (
    <div className="space-y-4">
      <motion.h3
        className="text-lg md:text-xl font-semibold text-foreground"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        Quick Stats
      </motion.h3>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {stats.map((stat, i) => (
          <HoverScale key={stat.label} scale={1.05}>
            <motion.div
              className={`relative overflow-hidden rounded-xl p-4 md:p-5 bg-gradient-to-br ${stat.color} border border-border/50 backdrop-blur-sm`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div className="text-2xl md:text-3xl mb-2">{stat.icon}</div>
              <div className="text-xl md:text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          </HoverScale>
        ))}
      </div>
    </div>
  )
}

