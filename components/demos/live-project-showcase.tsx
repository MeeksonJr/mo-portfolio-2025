'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  Github,
  Monitor,
  Play,
  Code,
  Zap,
  TrendingUp,
  Users,
  Award,
  ArrowUpRight,
  Globe,
  Star,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import Link from 'next/link'
import Image from 'next/image'
import PageContainer from '@/components/layout/page-container'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  name: string
  description: string | null
  tech_stack: string[] | null
  featured_image: string | null
  homepage_url: string | null
  github_url: string
  is_featured: boolean
  views: number
  slug: string
}

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'edusphere-ai',
    name: 'EduSphere AI',
    description:
      'AI-powered student productivity suite with assignment assistant, blog generator, and smart scheduling.',
    tech_stack: ['Next.js', 'Supabase', 'Gemini AI', 'TailwindCSS', 'PayPal'],
    featured_image: null,
    homepage_url: 'https://edusphere-ai.vercel.app',
    github_url: 'https://github.com/MeeksonJr/edusphere-ai',
    is_featured: true,
    views: 0,
    slug: 'edusphere-ai',
  },
  {
    id: 'interview-prep-ai',
    name: 'InterviewPrep AI',
    description:
      'AI-powered mock interview platform with voice and text interviews, real-time feedback, and progress tracking.',
    tech_stack: ['Next.js', 'PostgreSQL', 'Gemini AI', 'Firebase', 'Vapi Voice'],
    featured_image: null,
    homepage_url: 'https://www.humanoraconsulting.com/',
    github_url: 'https://github.com/MeeksonJr/interview-prep',
    is_featured: true,
    views: 0,
    slug: 'interview-prep-ai',
  },
  {
    id: 'ai-content-generator',
    name: 'AI Content Generator',
    description:
      'Full SaaS platform for generating blog posts, emails, and social content with analytics dashboard.',
    tech_stack: ['Next.js 14', 'Supabase', 'Gemini AI', 'Hugging Face', 'Recharts'],
    featured_image: null,
    homepage_url: 'https://ai-content-generator-mu-seven.vercel.app/',
    github_url: 'https://github.com/MeeksonJr/content-generator',
    is_featured: true,
    views: 0,
    slug: 'ai-content-generator',
  },
]

const TECH_COLORS: Record<string, string> = {
  'Next.js': 'bg-gray-900 text-white',
  'React': 'bg-blue-600 text-white',
  'TypeScript': 'bg-blue-500 text-white',
  'Supabase': 'bg-green-600 text-white',
  'TailwindCSS': 'bg-teal-500 text-white',
  'Firebase': 'bg-orange-500 text-white',
  'PostgreSQL': 'bg-blue-700 text-white',
}

export default function LiveProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/content/projects')
      if (response.ok) {
        const result = await response.json()
        const data = result.data || result
        const arr = Array.isArray(data) ? data : []
        const withDemos = arr.filter(
          (p: any) =>
            p.status === 'published' &&
            p.homepage_url &&
            p.homepage_url !== '#' &&
            !p.homepage_url.includes('github.com') &&
            p.homepage_url.startsWith('http')
        )
        if (withDemos.length > 0) {
          setProjects(withDemos)
          setIsLoading(false)
          return
        }
      }
    } catch {
      // silently fall through to fallback
    }
    setIsLoading(false)
  }

  const displayProjects = projects.length > 0 ? projects : FALLBACK_PROJECTS

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
        <FooterLight />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 pb-16">
        <PageContainer width="wide" padding="default">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Globe className="h-4 w-4" />
              Live Deployed Applications
            </div>
            <h1 className={cn(TYPOGRAPHY.h1, 'mb-4')}>
              Project{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Demos
              </span>
            </h1>
            <p className={cn(TYPOGRAPHY.lead, 'text-muted-foreground max-w-2xl mx-auto')}>
              Real applications, live in production. Explore what I've built — click any card to visit
              the site directly.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {displayProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="group"
              >
                <Card className="h-full flex flex-col overflow-hidden border hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Thumbnail / Gradient Banner */}
                  <div className="relative w-full h-44 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background">
                    {project.featured_image ? (
                      <Image
                        src={project.featured_image}
                        alt={project.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Monitor className="h-20 w-20 text-primary/20" />
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      {project.homepage_url && (
                        <Button
                          asChild
                          size="sm"
                          className="gap-2 shadow-lg"
                        >
                          <a href={project.homepage_url} target="_blank" rel="noopener noreferrer">
                            <Play className="h-4 w-4" />
                            Visit Site
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button
                          asChild
                          variant="secondary"
                          size="sm"
                          className="gap-2 shadow-lg"
                        >
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                    {project.is_featured && (
                      <div className="absolute top-3 right-3">
                        <Badge className="gap-1 shadow-md">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-start justify-between gap-2">
                      <span>{project.name}</span>
                      {project.homepage_url && (
                        <a
                          href={project.homepage_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 mt-0.5"
                          title={`Open ${project.name}`}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col gap-4">
                    {/* Tech Stack */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech_stack.slice(0, 5).map((tech, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {project.tech_stack.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tech_stack.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto">
                      {project.homepage_url && (
                        <Button asChild className="flex-1 gap-2">
                          <a href={project.homepage_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button asChild variant="outline" size="icon" className="flex-shrink-0">
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer" title="View source code">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Stats / Info Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                icon: TrendingUp,
                title: 'Real Performance',
                desc: 'See actual speed and responsiveness, not just screenshots',
              },
              {
                icon: Users,
                title: 'Live & Active',
                desc: 'These are deployed apps with real users and real uptime',
              },
              {
                icon: Code,
                title: 'Production Quality',
                desc: 'Every project follows industry standards and best practices',
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <Card key={i} className="border-primary/10 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">{title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </PageContainer>
      </div>
      <FooterLight />
    </>
  )
}
