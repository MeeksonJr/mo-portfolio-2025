"use client"

import { motion } from "framer-motion"
import { Code, Server, Brain, Wrench } from "lucide-react"

const techStack = {
  frontend: [
    { name: "React", level: "Expert", icon: "⚛️" },
    { name: "Next.js", level: "Expert", icon: "▲" },
    { name: "TypeScript", level: "Advanced", icon: "📘" },
    { name: "TailwindCSS", level: "Expert", icon: "🎨" },
  ],
  backend: [
    { name: "Node.js", level: "Advanced", icon: "🟢" },
    { name: "Supabase", level: "Advanced", icon: "⚡" },
    { name: "PostgreSQL", level: "Intermediate", icon: "🐘" },
    { name: "Firebase", level: "Advanced", icon: "🔥" },
  ],
  ai: [
    { name: "Gemini 2.0", level: "Advanced", icon: "🤖" },
    { name: "Groq", level: "Intermediate", icon: "🧠" },
    { name: "Hugging Face", level: "Intermediate", icon: "🤗" },
  ],
  tools: [
    { name: "Git/GitHub", level: "Expert", icon: "🔧" },
    { name: "Vercel", level: "Advanced", icon: "▲" },
    { name: "VS Code", level: "Expert", icon: "💙" },
  ],
}

const categories = [
  { key: "frontend", title: "Frontend", icon: Code, color: "text-blue-600" },
  { key: "backend", title: "Backend", icon: Server, color: "text-green-600" },
  { key: "ai", title: "AI Tools", icon: Brain, color: "text-purple-600" },
  { key: "tools", title: "Tools", icon: Wrench, color: "text-orange-600" },
]

export default function TechSnapshot() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tech Stack</h2>
            <p className="text-muted-foreground text-lg">Tools and technologies I work with daily</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => {
              const CategoryIcon = category.icon
              return (
                <motion.div
                  key={category.key}
                  className="glass rounded-2xl p-6 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <CategoryIcon className={category.color} size={24} />
                    <h3 className="font-semibold text-lg">{category.title}</h3>
                  </div>

                  <div className="space-y-4">
                    {techStack[category.key as keyof typeof techStack].map((tech, i) => (
                      <motion.div
                        key={tech.name}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 + i * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tech.icon}</span>
                          <span className="text-sm font-medium">{tech.name}</span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            tech.level === "Expert"
                              ? "bg-green-100 text-green-700"
                              : tech.level === "Advanced"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {tech.level}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
