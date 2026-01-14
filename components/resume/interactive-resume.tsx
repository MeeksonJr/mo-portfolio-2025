'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Briefcase, GraduationCap, Code, Award, MapPin, Calendar, 
  ChevronDown, ChevronUp, ExternalLink, Download, Share2 
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { resumeData } from '@/lib/resume-data'
import { format } from 'date-fns'

export default function InteractiveResume() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    experience: true,
    education: false,
    projects: false,
    skills: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="space-y-8">
      {/* Personal Info Header */}
      <Card className="bg-background/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-3xl mb-2">{resumeData.personal.name}</CardTitle>
              <CardDescription className="text-lg">{resumeData.personal.title}</CardDescription>
              <p className="text-muted-foreground mt-4 max-w-2xl">
                {resumeData.personal.summary}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="/resume-Mohamed-Datt-Full Stack Developer-2025.pdf"
                  download
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{resumeData.personal.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <a href={`mailto:${resumeData.personal.email}`} className="text-muted-foreground hover:text-primary">
                {resumeData.personal.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <a href={resumeData.personal.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary flex items-center gap-1">
                GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary flex items-center gap-1">
                LinkedIn
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Interactive Timeline */}
      <div className="space-y-6">
        {/* Experience Section */}
        <Card className="bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
              onClick={() => toggleSection('experience')}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-primary" />
                <CardTitle>Experience</CardTitle>
                <Badge variant="secondary">{resumeData.experience.length}</Badge>
              </div>
              {expandedSections.experience ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </CardHeader>
          <AnimatePresence>
            {expandedSections.experience && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="pt-0">
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    
                    <div className="space-y-8">
                      {resumeData.experience.map((exp, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative pl-12"
                        >
                          {/* Timeline Dot */}
                          <div className="absolute left-0 top-1.5">
                            <div className="h-8 w-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                              <Briefcase className="h-4 w-4 text-primary" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-start justify-between flex-wrap gap-2">
                              <div>
                                <h3 className="text-xl font-semibold">{exp.role}</h3>
                                <p className="text-muted-foreground">{exp.company}</p>
                                {exp.location && (
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3" />
                                    {exp.location}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{exp.startDate} - {exp.endDate}</span>
                              </div>
                            </div>

                            <div className="space-y-2 mt-4">
                              {exp.description.map((desc, i) => (
                                <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-primary mt-1.5">•</span>
                                  <span>{desc}</span>
                                </p>
                              ))}
                            </div>

                            {exp.achievements && exp.achievements.length > 0 && (
                              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                                  <Award className="h-4 w-4 text-primary" />
                                  Key Achievements
                                </p>
                                <ul className="space-y-1">
                                  {exp.achievements.map((achievement, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <span className="text-primary mt-1">✓</span>
                                      <span>{achievement}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {exp.technologies && exp.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {exp.technologies.map((tech) => (
                                  <Badge key={tech} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Education Section */}
        <Card className="bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
              onClick={() => toggleSection('education')}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-primary" />
                <CardTitle>Education</CardTitle>
                <Badge variant="secondary">{resumeData.education.length}</Badge>
              </div>
              {expandedSections.education ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </CardHeader>
          <AnimatePresence>
            {expandedSections.education && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {resumeData.education.map((edu, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div>
                            <h3 className="text-lg font-semibold">{edu.degree}</h3>
                            <p className="text-muted-foreground">{edu.school}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {edu.location}
                            </p>
                            {edu.gpa && (
                              <Badge variant="outline" className="mt-2">
                                GPA: {edu.gpa}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{edu.startDate} - {edu.endDate}</span>
                          </div>
                        </div>

                        {edu.achievements && edu.achievements.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold mb-2">Achievements</p>
                            <ul className="space-y-1">
                              {edu.achievements.map((achievement, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-primary mt-1">✓</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold mb-2">Relevant Courses</p>
                            <div className="flex flex-wrap gap-2">
                              {edu.relevantCourses.map((course) => (
                                <Badge key={course} variant="secondary" className="text-xs">
                                  {course}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Projects Section */}
        <Card className="bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
              onClick={() => toggleSection('projects')}
            >
              <div className="flex items-center gap-3">
                <Code className="h-5 w-5 text-primary" />
                <CardTitle>Projects</CardTitle>
                <Badge variant="secondary">{resumeData.projects.length}</Badge>
              </div>
              {expandedSections.projects ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </CardHeader>
          <AnimatePresence>
            {expandedSections.projects && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="pt-0">
                  <div className="grid md:grid-cols-2 gap-6">
                    {resumeData.projects.map((project, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold">{project.name}</h3>
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        {project.highlights && project.highlights.length > 0 && (
                          <ul className="space-y-1">
                            {project.highlights.map((highlight, i) => (
                              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Skills Section */}
        <Card className="bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
              onClick={() => toggleSection('skills')}
            >
              <div className="flex items-center gap-3">
                <Code className="h-5 w-5 text-primary" />
                <CardTitle>Skills</CardTitle>
              </div>
              {expandedSections.skills ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </CardHeader>
          <AnimatePresence>
            {expandedSections.skills && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="pt-0">
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(resumeData.skills).map(([category, skills]) => (
                      <div key={category}>
                        <h4 className="font-semibold mb-3 capitalize">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  )
}

