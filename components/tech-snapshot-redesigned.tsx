'use client'

import { motion } from 'framer-motion'
import { Code, Server, Brain, Wrench, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const techStack = {
  frontend: [
    { name: 'React', level: 'Expert', icon: '⚛️' },
    { name: 'Next.js', level: 'Expert', icon: '▲' },
    { name: 'TypeScript', level: 'Advanced', icon: '📘' },
    { name: 'TailwindCSS', level: 'Expert', icon: '🎨' },
  ],
  backend: [
    { name: 'Node.js', level: 'Advanced', icon: '🟢' },
    { name: 'Supabase', level: 'Advanced', icon: '⚡' },
    { name: 'PostgreSQL', level: 'Intermediate', icon: '🐘' },
    { name: 'Firebase', level: 'Advanced', icon: '🔥' },
  ],
  ai: [
    { name: 'Gemini 2.0', level: 'Advanced', icon: '🤖' },
    { name: 'Groq', level: 'Intermediate', icon: '🧠' },
    { name: 'Hugging Face', level: 'Intermediate', icon: '🤗' },
  ],
  tools: [
    { name: 'Git/GitHub', level: 'Expert', icon: '🔧' },
    { name: 'Vercel', level: 'Advanced', icon: '▲' },
    { name: 'VS Code', level: 'Expert', icon: '💙' },
  ],
}

const categories = [
  { key: 'frontend', title: 'Frontend', icon: Code, color: 'text-blue-600 dark:text-blue-400' },
  { key: 'backend', title: 'Backend', icon: Server, color: 'text-green-600 dark:text-green-400' },
  { key: 'ai', title: 'AI Tools', icon: Brain, color: 'text-purple-600 dark:text-purple-400' },
  { key: 'tools', title: 'Tools', icon: Wrench, color: 'text-orange-600 dark:text-orange-400' },
]

export default function TechSnapshot() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('frontend')

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Tech Stack</h2>
        <p className="text-sm md:text-base text-muted-foreground">Tools and technologies I work with daily</p>
      </div>

      {/* Categories - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {categories.map((category, idx) => {
          const CategoryIcon = category.icon
          const isExpanded = expandedCategory === category.key
          const techs = techStack[category.key as keyof typeof techStack]

          return (
            <motion.div
              key={category.key}
              className="glass-enhanced rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -2 }}
              onClick={() => setExpandedCategory(isExpanded ? null : category.key)}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <CategoryIcon className={category.color} size={20} />
                  <h3 className="font-semibold text-base">{category.title}</h3>
                  <span className="text-xs text-muted-foreground">({techs.length})</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Expanded Tech List */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2.5 pt-3 border-t border-border/50"
                >
                  {techs.map((tech, i) => (
                    <motion.div
                      key={tech.name}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{tech.icon}</span>
                        <span className="text-sm font-medium">{tech.name}</span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                          tech.level === 'Expert'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                            : tech.level === 'Advanced'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                        }`}
                      >
                        {tech.level}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Collapsed Preview */}
              {!isExpanded && (
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  {techs.slice(0, 3).map((tech) => (
                    <span key={tech.name} className="text-base">
                      {tech.icon}
                    </span>
                  ))}
                  {techs.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{techs.length - 3} more</span>
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

