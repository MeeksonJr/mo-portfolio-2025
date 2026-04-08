'use client'

import { motion } from 'framer-motion'
import GithubStats from '@/components/developer-dashboard/github-stats'
import ArchitectureTeardown from '@/components/developer-dashboard/architecture-teardown'
import Contact from '@/components/contact-redesigned'
import { Terminal, DatabaseZap, Cpu } from 'lucide-react'

export default function DeveloperHomepage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-zinc-950 text-zinc-50"
    >
      {/* Intense Dark Terminal Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 overflow-hidden">
        
        {/* Tech Grid Background Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="w-full max-w-7xl relative z-10 flex flex-col items-center mt-12 md:mt-0">
          <div className="mb-6 p-4 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
            <Terminal className="w-8 h-8" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500 mb-6 text-center">
            MOHAMED_DATT
          </h1>
          
          <div className="bg-black/50 backdrop-blur-md border border-zinc-800 rounded-xl max-w-3xl w-full p-6 text-left shadow-2xl">
            <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-zinc-500 text-xs font-mono ml-2">bash - /usr/bin/welcome --role=developer</span>
            </div>
            
            <div className="font-mono text-sm md:text-base space-y-3">
              <p className="text-green-400">System initialized. Authentication verified.</p>
              <p className="text-zinc-300">Welcome to the codebase. Below you'll find live telemetry from GitHub, architecture teardowns, and raw technical metrics.</p>
              <div className="flex gap-4 pt-4 text-zinc-500">
                <span className="flex items-center gap-1"><Cpu className="w-4 h-4" /> Usage: Optimized</span>
                <span className="flex items-center gap-1"><DatabaseZap className="w-4 h-4" /> Latency: &lt;12ms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Space */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-16 md:space-y-24 pb-20 md:pb-32 -mt-10 relative z-20">
        
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-primary/20 blur-[100px] pointer-events-none"></div>
          
          <GithubStats />
        </motion.div>

        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-2xl"
        >
          <ArchitectureTeardown />
        </motion.div>

        <motion.section className="max-w-3xl mx-auto">
          <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <Contact />
          </div>
        </motion.section>

      </div>
    </motion.div>
  )
}
