'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, ExternalLink, Award, DollarSign, Code, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface ExperienceItem {
  title: string
  company: string
  period: string
  type: 'internship' | 'freelance' | 'founder' | 'personal'
  achievements: string[]
  tech: string[]
  projectLink?: string
  salePrice?: string
  icon: React.ComponentType<any>
}

const experiences: ExperienceItem[] = [
  {
    title: 'Full Stack Developer',
    company: 'Internship Program',
    period: 'Sept 2024 – Dec 2024',
    type: 'internship',
    achievements: [
      'Won 1st place out of 13 teams for Best Application',
      'Built full-stack web app integrating APIs (Hugging Face, Gemini, Google Cloud Vision)',
      'Focused on connecting front-end and back-end, handling auth and data persistence',
    ],
    tech: ['Next.js', 'Social Media API', 'Gemini API', 'Google Cloud Vision', 'Authentication', 'Data Persistence'],
    icon: Award,
  },
  {
    title: 'Freelance Developer',
    company: 'InterviewPrep AI',
    period: '2025',
    type: 'freelance',
    achievements: [
      'Designed and built AI-powered interview preparation platform',
      'Integrated Gemini API for dynamic question generation and feedback',
      'Sold the site for $500 to a private buyer',
      'Continued maintenance and improvement support post-sale',
    ],
    tech: ['Next.js', 'Gemini API', 'AI Integration', 'Interview System', 'Supabase', 'PayPal', 'VAPI'],
    salePrice: '$500',
    icon: DollarSign,
  },
  {
    title: 'Founder / Developer',
    company: 'EduSphere AI',
    period: '2024',
    type: 'founder',
    achievements: [
      'Created AI-powered SaaS platform for students (K–University)',
      'Built subscription system with PayPal integration',
      'Developed dark dashboard UI with animations',
      'Implemented AI-powered assignment helper and calendar integration',
    ],
    tech: ['Next.js', 'TailwindCSS', 'Supabase', 'Gemini AI', 'Hugging Face', 'PayPal', 'Framer Motion'],
    projectLink: 'https://github.com/MeeksonJr/edusphere-ai',
    icon: Award,
  },
  {
    title: 'Founder / Developer',
    company: 'SnapFind App',
    period: '2024',
    type: 'founder',
    achievements: [
      'Developed visual content recognition and analysis app',
      'Integrated Google Cloud Vision, Gemini API, and Hugging Face',
      'Used Neon PostgreSQL for database management',
      'Deployed on Vercel with fully configured environment variables',
    ],
    tech: ['Next.js', 'Google Cloud Vision', 'Gemini API', 'Hugging Face', 'Neon PostgreSQL', 'Vercel'],
    projectLink: 'https://github.com/MeeksonJr/snapfind-app',
    icon: Award,
  },
  {
    title: 'Personal Project',
    company: 'myLife SaaS App',
    period: '2025',
    type: 'personal',
    achievements: [
      'Built AI-driven health management app',
      'Users can upload/scan medical reports for AI-powered health analyses',
      'Implemented ingredient breakdowns, health scores, and warnings',
      'Developed medical data management system',
    ],
    tech: ['Next.js', 'Supabase', 'PayPal Sandbox', 'Framer Motion', 'Groq/Gemini APIs', 'Health Analytics'],
    projectLink: 'https://github.com/MeeksonJr/mylife-saas',
    icon: Award,
  },
]

const typeConfig = {
  internship: { color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', label: 'Internship' },
  freelance: { color: 'bg-green-500/10 text-green-600 dark:text-green-400', label: 'Freelance' },
  founder: { color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', label: 'Founder' },
  personal: { color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400', label: 'Personal' },
}

export default function Experience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Professional Experience</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          From internships to freelance projects, here's my journey in building innovative solutions.
        </p>
      </div>

      {/* Experience List - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {experiences.map((exp, index) => {
          const IconComponent = exp.icon
          const isExpanded = expandedIndex === index

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <div
                className="glass-enhanced rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                {/* Header Row */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1 line-clamp-1">{exp.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {exp.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.period}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${typeConfig[exp.type].color}`}>
                      {typeConfig[exp.type].label}
                    </span>
                    {exp.salePrice && (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <DollarSign className="w-3 h-3" />
                        <span className="text-xs font-semibold">{exp.salePrice}</span>
                      </div>
                    )}
                    <ChevronRight
                      className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-border/50 space-y-4"
                  >
                    {/* Achievements */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        Key Achievements
                      </h4>
                      <ul className="space-y-1.5">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Code className="w-4 h-4 text-primary" />
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.tech.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-muted/50 text-xs rounded-md font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Project Link */}
                    {exp.projectLink && (
                      <a
                        href={exp.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-primary hover:gap-3 transition-all font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Project
                      </a>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

