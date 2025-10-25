"use client"

import { motion } from "framer-motion"
import { Terminal, Coffee, Heart, Sparkles, Zap } from "lucide-react"
import { useState, useEffect } from "react"

export default function Footer() {
  const [currentTime, setCurrentTime] = useState("")
  const [uptime, setUptime] = useState(0)
  const [farewell, setFarewell] = useState(0)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "America/New_York",
        }),
      )
    }

    const updateUptime = () => {
      setUptime((prev) => prev + 1)
    }

    const updateFarewell = () => {
      setFarewell((prev) => (prev + 1) % 4)
    }

    updateTime()
    const timeInterval = setInterval(updateTime, 1000)
    const uptimeInterval = setInterval(updateUptime, 1000)
    const farewellInterval = setInterval(updateFarewell, 3000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(uptimeInterval)
      clearInterval(farewellInterval)
    }
  }, [])

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const farewellMessages = [
    "Thanks for visiting my digital home! 🏠",
    "Hope you enjoyed the journey! 🚀",
    "Let's build something amazing together! ⚡",
    "From Guinea to Norfolk - the adventure continues! 🌍",
  ]

  const systemStats = [
    { label: "TIME", value: currentTime, icon: "🕐" },
    { label: "UPTIME", value: formatUptime(uptime), icon: "⏱️" },
    { label: "LOCATION", value: "Norfolk, VA", icon: "📍" },
    { label: "STATUS", value: "Building", icon: "🚀" },
  ]

  return (
    <footer className="relative py-12 px-4 border-t border-gray-800 overflow-hidden">
      {/* Subtle Matrix Background */}
      <div className="absolute inset-0 opacity-3">
        <div className="grid grid-cols-20 gap-px h-full">
          {Array.from({ length: 200 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-green-400"
              animate={{
                opacity: [0, 0.3, 0],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 4.2,
                repeat: Number.POSITIVE_INFINITY,
                delay: 2.1,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Terminal Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Terminal className="text-green-400" size={20} />
              <span className="text-green-400 font-mono text-sm">system@mohameddatt.com</span>
            </div>
          </div>
        </motion.div>

        {/* System Status Card */}
        <motion.div
          className="bg-black/50 border border-green-400/30 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            {systemStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-green-400 font-mono text-xs mb-1">{stat.label}</div>
                <div className="text-white font-mono text-sm">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Farewell Terminal */}
          <div className="bg-gray-900/50 border border-green-400/20 rounded p-4 font-mono text-sm">
            <div className="space-y-2">
              <div className="text-green-400">$ echo "Session complete"</div>
              <div className="text-gray-300 pl-4">{">"} Session complete</div>
              <motion.div
                key={farewell}
                className="text-green-400"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                $ echo "{farewellMessages[farewell]}"
              </motion.div>
              <motion.div
                key={`msg-${farewell}`}
                className="text-gray-300 pl-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {">"} {farewellMessages[farewell]}
              </motion.div>
              <div className="flex items-center gap-1 text-green-400">
                <span>$ logout</span>
                <motion.span
                  className="bg-green-400 w-2 h-4 inline-block ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final Goodbye */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <span>Crafted with</span>
            <Heart className="text-red-400" size={16} />
            <span>and lots of</span>
            <Coffee className="text-yellow-600" size={16} />
            <span>by Mohamed Datt</span>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-mono text-gray-500">
            <span>© 2025</span>
            <span>•</span>
            <span>Next.js 15</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Vercel</span>
          </div>

          <motion.div
            className="flex items-center justify-center gap-2 text-gray-500 text-sm italic"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            <Sparkles className="text-green-400" size={16} />
            <span>"From Guinea to Norfolk, from cartoons to code - the journey continues..."</span>
            <Sparkles className="text-green-400" size={16} />
          </motion.div>

          {/* Easter Egg */}
          <motion.div
            className="mt-8 opacity-20 hover:opacity-100 transition-opacity cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-green-400">
              <Zap size={12} />
              <span>Back to top?</span>
              <Zap size={12} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}
