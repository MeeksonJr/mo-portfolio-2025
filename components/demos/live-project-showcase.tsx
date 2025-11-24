'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ExternalLink, Github, Monitor, Maximize2, Minimize2, X, 
  Play, Code, Zap, TrendingUp, Users, Award, ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import Link from 'next/link'
import Image from 'next/image'

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

export default function LiveProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      // Try to fetch from projects API
      const response = await fetch('/api/admin/content/projects')
      if (response.ok) {
        const data = await response.json()
        // Filter to only published projects with live demos
        const projectsWithDemos = data.filter((p: any) => 
          p.status === 'published' &&
          p.homepage_url && 
          p.homepage_url !== '#' && 
          !p.homepage_url.includes('github.com') &&
          p.homepage_url.startsWith('http')
        )
        
        if (projectsWithDemos.length > 0) {
          setProjects(projectsWithDemos)
          setIsLoading(false)
          return
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
    
    // Fallback to known projects
    setIsLoading(false)
  }

  // Known projects with live demos
  const knownProjects = [
    {
      id: 'edusphere-ai',
      name: 'EduSphere AI',
      description: 'AI-powered student productivity suite with assignment assistant and blog generator',
      tech_stack: ['Next.js', 'Supabase', 'Gemini', 'TailwindCSS', 'PayPal'],
      featured_image: '/placeholder.svg?height=300&width=500&text=EduSphere+AI',
      homepage_url: 'https://edusphere-ai.vercel.app',
      github_url: 'https://github.com/MeeksonJr/edusphere-ai',
      is_featured: true,
      views: 0,
      slug: 'edusphere-ai',
    },
    {
      id: 'interview-prep-ai',
      name: 'InterviewPrep AI',
      description: 'AI-powered interview preparation platform with voice and text mock interviews',
      tech_stack: ['Next.js', 'PostgreSQL', 'Gemini', 'Firebase', 'PayPal', 'Vapi Voice'],
      featured_image: '/placeholder.svg?height=300&width=500&text=InterviewPrep+AI',
      homepage_url: 'https://www.humanoraconsulting.com/',
      github_url: 'https://github.com/MeeksonJr/interview-prep',
      is_featured: true,
      views: 0,
      slug: 'interview-prep-ai',
    },
    {
      id: 'ai-content-generator',
      name: 'AI Content Generator',
      description: 'Full SaaS platform for blog, email, and social content with analytics dashboard',
      tech_stack: ['Next.js 14', 'Supabase', 'Gemini', 'Hugging Face', 'Recharts'],
      featured_image: '/placeholder.svg?height=300&width=500&text=Content+Generator',
      homepage_url: 'https://ai-content-generator-mu-seven.vercel.app/',
      github_url: 'https://github.com/MeeksonJr/content-generator',
      is_featured: true,
      views: 0,
      slug: 'ai-content-generator',
    },
  ]

  const displayProjects = projects.length > 0 ? projects : knownProjects

  const handleOpenDemo = (project: Project) => {
    setSelectedProject(project)
    setIsFullscreen(true)
  }

  const handleCloseDemo = () => {
    setIsFullscreen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Play className="h-10 w-10 text-primary" />
              Live Project Demos
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See my projects in action. Interactive live demos of real working applications.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {displayProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  {project.featured_image && (
                    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={project.featured_image}
                        alt={project.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          onClick={() => handleOpenDemo(project)}
                          variant="secondary"
                          className="gap-2"
                        >
                          <Play className="h-4 w-4" />
                          View Live Demo
                        </Button>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      {project.is_featured && (
                        <Badge variant="default" className="ml-2">
                          <Award className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tech_stack?.slice(0, 4).map((tech, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.tech_stack && project.tech_stack.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.tech_stack.length - 4}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      {project.homepage_url && (
                        <Button
                          onClick={() => handleOpenDemo(project)}
                          variant="default"
                          className="flex-1 gap-2"
                        >
                          <Monitor className="h-4 w-4" />
                          Live Demo
                        </Button>
                      )}
                      {project.github_url && (
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1 gap-2"
                        >
                          <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                            Code
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Why Live Demos Matter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Real Performance</p>
                      <p className="text-xs text-muted-foreground">
                        See actual speed and responsiveness, not just screenshots
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">User Experience</p>
                      <p className="text-xs text-muted-foreground">
                        Experience the interface and interactions firsthand
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Code className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Production Quality</p>
                      <p className="text-xs text-muted-foreground">
                        These are real, deployed applications with real users
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Fullscreen Demo Modal */}
      <AnimatePresence>
        {isFullscreen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
            onClick={handleCloseDemo}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="absolute inset-4 md:inset-8 bg-background rounded-lg shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="ml-4">
                    <h2 className="font-semibold">{selectedProject.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {selectedProject.homepage_url}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(selectedProject.homepage_url || '', '_blank')}
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseDemo}
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Iframe */}
              <div className="flex-1 relative overflow-hidden">
                {selectedProject.homepage_url ? (
                  <iframe
                    src={selectedProject.homepage_url}
                    className="w-full h-full border-0"
                    title={`${selectedProject.name} Live Demo`}
                    allow="camera; microphone; geolocation; encrypted-media"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Demo URL not available</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t flex items-center justify-between bg-muted/50">
                <div className="flex items-center gap-4">
                  {selectedProject.tech_stack && (
                    <div className="flex flex-wrap gap-1">
                      {selectedProject.tech_stack.slice(0, 5).map((tech, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {selectedProject.github_url && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                    >
                      <Link href={selectedProject.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        View Code
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                  >
                    <Link href={`/projects/${selectedProject.slug || selectedProject.id}`}>
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FooterLight />
    </>
  )
}

