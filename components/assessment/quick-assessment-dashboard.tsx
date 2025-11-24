'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, GraduationCap, Code, Rocket, Award, MapPin, 
  Mail, Phone, Globe, Github, Linkedin, Clock, CheckCircle2,
  TrendingUp, Star, Zap, Target, BarChart3, Download
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import { resumeData } from '@/lib/resume-data'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function QuickAssessmentDashboard() {
  const [data, setData] = useState(resumeData)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fetch latest data if needed
    fetch('/api/resume')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(() => {}) // Use fallback data
  }, [])

  const { personal, experience, education, skills, projects } = data

  // Calculate stats
  const totalProjects = projects.length
  const yearsOfExperience = new Date().getFullYear() - 2020 // Approximate
  const skillsCount = Object.values(skills).flat().length

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Quick Assessment</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              At-a-glance overview for recruiters and hiring managers
            </p>
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Projects</p>
                    <p className="text-2xl font-bold">{totalProjects}+</p>
                  </div>
                  <Rocket className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="text-2xl font-bold">{yearsOfExperience}+</p>
                    <p className="text-xs text-muted-foreground">years</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Skills</p>
                    <p className="text-2xl font-bold">{skillsCount}+</p>
                  </div>
                  <Code className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-2xl font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Available
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Skills Radar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Skills Overview
                  </CardTitle>
                  <CardDescription>Technical proficiency breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Frontend</span>
                      <span className="text-muted-foreground">Expert</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Backend</span>
                      <span className="text-muted-foreground">Advanced</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>AI Integration</span>
                      <span className="text-muted-foreground">Advanced</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Full Stack</span>
                      <span className="text-muted-foreground">Expert</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Experience Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Experience
                  </CardTitle>
                  <CardDescription>Professional journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="border-l-2 border-primary pl-4">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="font-semibold">{exp.role}</p>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {exp.startDate} - {exp.endDate}
                        </Badge>
                      </div>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                          <Award className="h-3 w-3" />
                          <span>{exp.achievements[0]}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Education & Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                  <CardDescription>Academic background</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{edu.degree}</p>
                          <p className="text-sm text-muted-foreground">{edu.school}</p>
                        </div>
                        <Badge variant={edu.endDate === 'Present' ? 'default' : 'secondary'} className="text-xs">
                          {edu.startDate} - {edu.endDate}
                        </Badge>
                      </div>
                      {edu.gpa && (
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>GPA: {edu.gpa}</span>
                        </div>
                      )}
                      {edu.achievements && edu.achievements.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {edu.achievements.map((ach, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {ach}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Top Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Top Projects
                </CardTitle>
                <CardDescription>Key projects showcasing capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.slice(0, 4).map((project, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{project.name}</h3>
                        {project.github && (
                          <Link href={project.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </Link>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 4).map((tech, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${personal.email}`} className="text-sm hover:text-primary">
                    {personal.email}
                  </a>
                </div>
                {personal.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${personal.phone}`} className="text-sm hover:text-primary">
                      {personal.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{personal.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Response time: 24 hours</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full" variant="default">
                  <Link href="/resume">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={personal.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={personal.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <FooterLight />
    </>
  )
}

