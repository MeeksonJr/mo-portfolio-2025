"use client"

import { motion } from "framer-motion"
import TypingEffect from "./typing-effect"

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Terminal Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-1 h-full">
          {Array.from({ length: 192 }).map((_, i) => (
            <motion.div
              key={i}
              className="border border-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: 2,
                delay: i * 0.01,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3,
              }}
            />
          ))}
        </div>
      </div>

      <div className="text-center z-10 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 md:mb-8"
        >
          <div className="text-green-400 text-xs md:text-sm mb-2">$ whoami</div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">Mohamed Datt</h1>
          <div className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-4 md:mb-6 h-8 md:h-10">
            <TypingEffect
              texts={["Creative Full Stack Developer", "AI + Web Builder", "Builder of Ideas", "Problem Solver"]}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="space-y-4 md:space-y-6"
        >
          <div className="text-green-400 text-xs md:text-sm">$ cat bio.txt</div>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed text-sm md:text-base px-4">
            Born in Guinea, raised in NYC, now in Norfolk, Virginia. Learned English in 3 months using cartoons like
            Dora after facing early bullying and setbacks. Grew into a resilient, self-driven developer with a passion
            for creative, AI-powered web experiences.
          </p>
          <div className="text-gray-500 text-xs md:text-sm mt-4">
            Location: Norfolk, Virginia | Height: 6'2" | Status: Building the future
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-8 md:mt-12"
        >
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-sm">
            <motion.span
              className="text-green-400 px-2 py-1 border border-green-400/30 rounded"
              whileHover={{ scale: 1.05, borderColor: "rgb(74 222 128)" }}
            >
              [resilient]
            </motion.span>
            <motion.span
              className="text-blue-400 px-2 py-1 border border-blue-400/30 rounded"
              whileHover={{ scale: 1.05, borderColor: "rgb(96 165 250)" }}
            >
              [creative]
            </motion.span>
            <motion.span
              className="text-yellow-400 px-2 py-1 border border-yellow-400/30 rounded"
              whileHover={{ scale: 1.05, borderColor: "rgb(250 204 21)" }}
            >
              [resourceful]
            </motion.span>
            <motion.span
              className="text-purple-400 px-2 py-1 border border-purple-400/30 rounded"
              whileHover={{ scale: 1.05, borderColor: "rgb(196 181 253)" }}
            >
              [self-taught]
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="text-green-400 text-xs">$ scroll --down</div>
        <div className="w-px h-6 md:h-8 bg-green-400 mx-auto mt-2"></div>
      </motion.div>
    </section>
  )
}
