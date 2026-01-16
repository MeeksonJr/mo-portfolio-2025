'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, DollarSign, CheckCircle, ChevronRight, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const projects = [
  {
    name: 'InterviewPrep AI',
    description: 'Mock interview platform with AI voice feedback and resume analysis',
    tech: ['Next.js', 'Gemini AI', 'Firebase', 'PayPal'],
    status: 'sold',
    saleInfo: {
      price: 500,
      buyer: 'Private Client',
      notes: 'Ongoing maintenance & feature updates contracted',
    },
    github: 'https://github.com/MeeksonJr/interviewprep-ai',
    live: 'https://interviewprep-ai.vercel.app',
  },
  {
    name: 'EduSphere AI',
    description: 'AI-powered student productivity suite with assignment assistant and blog generator',
    tech: ['Next.js', 'Supabase', 'Gemini', 'TailwindCSS'],
    status: 'live',
    github: 'https://github.com/MeeksonJr/edusphere-ai',
    live: 'https://edusphere-ai.vercel.app',
  },
  {
    name: 'AI Content Generator',
    description: 'Full SaaS platform for blog, email, and social content with analytics dashboard',
    tech: ['Next.js', 'Supabase', 'Gemini', 'Hugging Face', 'Recharts'],
    status: 'live',
    github: 'https://github.com/MeeksonJr/ai-content-generator',
    live: 'https://ai-content-gen.vercel.app',
  },
  {
    name: 'SnapFind',
    description: 'Advanced image analysis tool using Gemini Vision and Hugging Face APIs',
    tech: ['Next.js', 'Gemini Vision', 'Hugging Face'],
    status: 'beta',
    github: 'https://github.com/MeeksonJr/snapfind',
  },
]

export default function ProjectsLight() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Work</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Live projects, sold products, and ongoing development
        </p>
      </div>

      {/* Projects Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-4">
          {projects.map((project, idx) => {
            const isExpanded = expandedIndex === idx

            return (
              <motion.div
                key={project.name}
                className="glass-enhanced rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold flex-1">{project.name}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        project.status === 'sold'
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : project.status === 'live'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                      }`}
                    >
                      {project.status === 'sold' ? 'Sold ✓' : project.status === 'live' ? 'Live' : 'Beta'}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>

                {/* Sold Info */}
                {project.status === 'sold' && project.saleInfo && (
                  <div className="mb-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="text-green-600 dark:text-green-400" size={14} />
                      <span className="font-bold text-sm text-green-600 dark:text-green-400">
                        Sold for ${project.saleInfo.price}
                      </span>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-1">
                      <CheckCircle className="inline" size={12} />
                      {project.saleInfo.notes}
                    </p>
                  </div>
                )}

                {/* Expanded Content */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-border/50 space-y-3"
                  >
                    {/* Tech Stack */}
                    <div>
                      <div className="text-xs font-semibold mb-2">Technologies</div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-md font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="flex gap-3 pt-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={14} />
                          Code
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={14} />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Collapsed Tech Preview */}
                {!isExpanded && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-md font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-md">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* View All Projects Button */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <Link href="/projects">
            <Button variant="outline" className="w-full group">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

