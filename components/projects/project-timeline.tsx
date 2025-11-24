'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, Filter, Code2, Rocket, Database, 
  Globe, Zap, Search, ExternalLink, Github,
  ChevronRight, TrendingUp, Users, Award, X
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'

interface Project {
  id: string
  name: string
  description: string | null
  tech_stack: string[] | null
  github_url: string | null
  live_url: string | null
  featured_image: string | null
  status: string
  is_featured: boolean
  created_at: string
  updated_at: string
}

const TECH_ICONS: Record<string, typeof Code2> = {
  'React': Code2,
  'Next.js': Globe,
  'TypeScript': Code2,
  'Node.js': Database,
  'Supabase': Database,
  'PostgreSQL': Database,
  'MongoDB': Database,
  'Firebase': Database,
  'TailwindCSS': Zap,
  'Python': Code2,
  'JavaScript': Code2,
}

export default function InteractiveProjectTimeline() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTech, setSelectedTech] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get all unique technologies
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>()
    projects.forEach(project => {
      project.tech_stack?.forEach(tech => techSet.add(tech))
    })
    return Array.from(techSet).sort()
  }, [projects])

  // Filter projects
  const filteredProjects = useMemo(() => {
    let filtered = projects

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tech_stack?.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Technology filter
    if (selectedTech !== 'all') {
      filtered = filtered.filter(p => p.tech_stack?.includes(selectedTech))
    }

    // Status filter (already filtered by published, but can add more)
    if (selectedStatus === 'featured') {
      filtered = filtered.filter(p => p.is_featured)
    }

    // Sort chronologically (newest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })
  }, [projects, searchQuery, selectedTech, selectedStatus])

  // Group projects by year
  const projectsByYear = useMemo(() => {
    const grouped: Record<string, Project[]> = {}
    filteredProjects.forEach(project => {
      const year = new Date(project.created_at).getFullYear().toString()
      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(project)
    })
    return grouped
  }, [filteredProjects])

  const getProjectImpact = (project: Project) => {
    // Calculate impact score based on various factors
    let score = 0
    if (project.is_featured) score += 3
    if (project.live_url) score += 2
    if (project.github_url) score += 1
    if (project.tech_stack && project.tech_stack.length > 5) score += 1
    return score
  }

  if (loading) {
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
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Calendar className="h-10 w-10 text-primary" />
              Project Timeline
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore my projects in chronological order. Filter by technology, type, and see the evolution of my work.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedTech} onValueChange={setSelectedTech}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Technology" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technologies</SelectItem>
                  {allTechnologies.map(tech => (
                    <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="featured">Featured Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>
                Showing {filteredProjects.length} of {projects.length} projects
              </span>
            </div>
          </motion.div>

          {/* Timeline */}
          <div className="space-y-12">
            {Object.entries(projectsByYear)
              .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
              .map(([year, yearProjects], yearIdx) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + yearIdx * 0.1 }}
                  className="relative"
                >
                  {/* Year Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-12 bg-primary"></div>
                      <h2 className="text-3xl font-bold">{year}</h2>
                      <Badge variant="secondary" className="text-sm">
                        {yearProjects.length} {yearProjects.length === 1 ? 'project' : 'projects'}
                      </Badge>
                    </div>
                  </div>

                  {/* Projects Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {yearProjects.map((project, idx) => {
                      const impact = getProjectImpact(project)
                      const Icon = project.tech_stack?.[0] 
                        ? TECH_ICONS[project.tech_stack[0]] || Code2 
                        : Code2

                      return (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + idx * 0.05 }}
                        >
                          <Card
                            className={`h-full cursor-pointer transition-all hover:border-primary hover:shadow-lg ${
                              selectedProject?.id === project.id ? 'border-primary bg-primary/5' : ''
                            }`}
                            onClick={() => setSelectedProject(project)}
                          >
                            {project.featured_image && (
                              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                                <Image
                                  src={project.featured_image}
                                  alt={project.name}
                                  fill
                                  className="object-cover"
                                />
                                {project.is_featured && (
                                  <div className="absolute top-2 right-2">
                                    <Badge className="bg-primary">
                                      <Award className="h-3 w-3 mr-1" />
                                      Featured
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            )}
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="flex items-center gap-2 mb-2">
                                    <Icon className="h-5 w-5 text-primary" />
                                    {project.name}
                                  </CardTitle>
                                  <CardDescription className="line-clamp-2">
                                    {project.description || 'No description available'}
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {format(parseISO(project.created_at), 'MMM d, yyyy')}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {/* Tech Stack */}
                                {project.tech_stack && project.tech_stack.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {project.tech_stack.slice(0, 4).map((tech) => (
                                      <Badge key={tech} variant="outline" className="text-xs">
                                        {tech}
                                      </Badge>
                                    ))}
                                    {project.tech_stack.length > 4 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{project.tech_stack.length - 4}
                                      </Badge>
                                    )}
                                  </div>
                                )}

                                {/* Impact Score */}
                                <div className="flex items-center gap-2 text-xs">
                                  <TrendingUp className="h-3 w-3 text-primary" />
                                  <span className="text-muted-foreground">
                                    Impact: {impact}/7
                                  </span>
                                </div>

                                {/* Links */}
                                <div className="flex gap-2 pt-2">
                                  {project.github_url && (
                                    <Button
                                      asChild
                                      variant="outline"
                                      size="sm"
                                      className="flex-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                        <Github className="h-3 w-3 mr-1" />
                                        Code
                                      </a>
                                    </Button>
                                  )}
                                  {project.live_url && (
                                    <Button
                                      asChild
                                      variant="outline"
                                      size="sm"
                                      className="flex-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        Live
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              ))}
          </div>

          {filteredProjects.length === 0 && (
            <Card className="mt-8">
              <CardContent className="py-16 text-center">
                <Code2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No projects found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <Card>
                {selectedProject.featured_image && (
                  <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
                    <Image
                      src={selectedProject.featured_image}
                      alt={selectedProject.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{selectedProject.name}</CardTitle>
                      <CardDescription className="text-base">
                        {selectedProject.description || 'No description available'}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedProject(null)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(parseISO(selectedProject.created_at), 'MMMM d, yyyy')}
                    </div>
                    {selectedProject.is_featured && (
                      <Badge>
                        <Award className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  {selectedProject.tech_stack && selectedProject.tech_stack.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tech_stack.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    {selectedProject.github_url && (
                      <Button asChild variant="default" className="flex-1">
                        <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          View on GitHub
                        </a>
                      </Button>
                    )}
                    {selectedProject.live_url && (
                      <Button asChild variant="default" className="flex-1">
                        <a href={selectedProject.live_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Live
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FooterLight />
    </>
  )
}

