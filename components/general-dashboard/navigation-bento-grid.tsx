'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FolderGit2, User, Disc3, Newspaper } from 'lucide-react'

export default function NavigationBentoGrid() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6"
    >
      {/* The Vault / Projects - Large Item spanning 2 cols on lg */}
      <motion.div variants={item} className="lg:col-span-2 group relative h-full">
        <Link href="/projects" className="block w-full h-full overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Abstract Code Grid bg */}
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
             <pre className="text-[10px] text-emerald-400 font-mono tracking-widest leading-loose">
               {"function launch() {\n  const system = init();\n  system.scale();\n}"}
             </pre>
          </div>

          <div className="absolute bottom-0 left-0 p-8 z-10 flex flex-col justify-end h-full w-full">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 text-emerald-400">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-extrabold text-white tracking-tight mb-2">The Vault</h3>
            <p className="text-zinc-400 font-medium">Explore the architecture, case studies, and live deployments.</p>
          </div>
        </Link>
      </motion.div>

      {/* The Vibe / Music */}
      <motion.div variants={item} className="group relative h-full">
        <Link href="/music" className="block w-full h-full overflow-hidden rounded-3xl bg-gradient-to-bl from-rose-900/40 to-black border border-rose-900/40 shadow-2xl relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
          
          <div className="absolute top-8 right-8 text-rose-400 group-hover:rotate-[360deg] transition-transform duration-[3s] ease-linear">
            <Disc3 className="w-32 h-32 opacity-20" />
          </div>

          <div className="absolute bottom-0 left-0 p-8 z-10 flex flex-col justify-end h-full w-full">
            <div className="w-12 h-12 bg-rose-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 text-rose-400">
              <Disc3 className="w-6 h-6 animate-[spin_4s_linear_infinite]" />
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">The Vibe</h3>
            <p className="text-rose-200/60 font-medium text-sm">Curated tracks & currently playing.</p>
          </div>
        </Link>
      </motion.div>

      {/* The Journey / About */}
      <motion.div variants={item} className="group relative h-full">
        <Link href="/about" className="block w-full h-full overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="absolute bottom-0 left-0 p-8 z-10 flex flex-col justify-end h-full w-full">
            <div className="w-12 h-12 bg-blue-500/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 text-blue-400">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">The Journey</h3>
            <p className="text-zinc-400 font-medium text-sm">My story, skills, and background.</p>
          </div>
        </Link>
      </motion.div>

      {/* Thoughts / Blog - Spanning 2 cols on lg */}
      <motion.div variants={item} className="lg:col-span-2 group relative h-full">
        <Link href="/blog" className="block w-full h-full overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="absolute right-0 bottom-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Newspaper className="w-48 h-48" />
          </div>

          <div className="absolute bottom-0 left-0 p-8 z-10 flex flex-col justify-end h-full w-full">
            <div className="w-12 h-12 bg-amber-500/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 text-amber-500">
              <Newspaper className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-extrabold text-white tracking-tight mb-2">Perspectives</h3>
            <p className="text-zinc-400 font-medium">Technical writings, guides, and thoughts on AI.</p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}
