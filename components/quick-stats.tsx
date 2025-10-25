"use client"

import { motion } from "framer-motion"

const stats = [
  { label: "Years Coding", value: "5+", icon: "💻" },
  { label: "Projects Shipped", value: "15+", icon: "🚀" },
  { label: "Sites Sold", value: "2", icon: "💰" },
  { label: "Award Winner", value: "1st Place", icon: "🏆" },
]

export default function QuickStats() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="glass rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
