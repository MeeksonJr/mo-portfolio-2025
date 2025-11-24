'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Code,
  Award,
  Globe,
  Linkedin,
  Github,
  FileText,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const candidateData = {
  name: 'Mohamed Datt',
  title: 'Full Stack Developer',
  location: 'Norfolk, Virginia, USA',
  timezone: 'EST (UTC-5)',
  availability: 'Available for opportunities',
  workType: ['Remote', 'Hybrid', 'On-site'],
  preferredWorkType: 'Remote',
  email: 'd.mohamed1504@gmail.com',
  linkedin: 'https://linkedin.com/in/mohamed-datt',
  github: 'https://github.com/MeeksonJr',
  portfolio: 'https://mohameddatt.com',
  keySkills: [
    { name: 'Next.js', level: 'Expert' },
    { name: 'React', level: 'Expert' },
    { name: 'TypeScript', level: 'Expert' },
    { name: 'Node.js', level: 'Advanced' },
    { name: 'PostgreSQL', level: 'Advanced' },
    { name: 'AI Integration', level: 'Advanced' },
    { name: 'Supabase', level: 'Advanced' },
    { name: 'TailwindCSS', level: 'Expert' },
  ],
  experience: '3+ years',
  education: 'Computer Science (ODU)',
  languages: ['English (Native)', 'French (Conversational)'],
  certifications: [],
  notableProjects: [
    'EduSphere AI - AI-powered learning platform',
    'InterviewPrep AI - Interview preparation tool',
    'Portfolio 2025 - This portfolio site',
  ],
  achievements: [
    '1st Place Winner - Fall 2024 Internship Competition',
    'Built 6+ production SaaS applications',
    'Open source contributor',
  ],
}

export default function CandidateSummaryContent() {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDownloadPDF = () => {
    // In a real implementation, this would generate a PDF
    window.print()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Candidate Summary</h1>
        <p className="text-lg text-muted-foreground">
          Quick reference for recruiters and hiring managers
        </p>
        <Button onClick={handleDownloadPDF} className="mt-4" variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-2xl font-bold mb-2">{candidateData.name}</div>
                <div className="text-lg text-muted-foreground">{candidateData.title}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="text-sm font-medium">{candidateData.location}</div>
                    <div className="text-xs text-muted-foreground">{candidateData.timezone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="text-sm font-medium">{candidateData.availability}</div>
                    <div className="text-xs text-muted-foreground">
                      {candidateData.experience} experience
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Key Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {candidateData.keySkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {skill.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notable Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Notable Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {candidateData.notableProjects.map((project, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{project}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Key Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {candidateData.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{achievement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => handleCopy(candidateData.email, 'email')}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <Mail className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="text-sm font-medium">{candidateData.email}</div>
                </div>
                {copied === 'email' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <FileText className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <a
                href={candidateData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Linkedin className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">LinkedIn</div>
                  <div className="text-sm font-medium">View Profile</div>
                </div>
              </a>

              <a
                href={candidateData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Github className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">GitHub</div>
                  <div className="text-sm font-medium">View Repositories</div>
                </div>
              </a>

              <a
                href={candidateData.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Globe className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Portfolio</div>
                  <div className="text-sm font-medium">Visit Website</div>
                </div>
              </a>
            </CardContent>
          </Card>

          {/* Work Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Work Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-2">Preferred</div>
                <Badge variant="default">{candidateData.preferredWorkType}</Badge>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-2">Open To</div>
                <div className="flex flex-wrap gap-2">
                  {candidateData.workType.map((type) => (
                    <Badge key={type} variant="outline">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education & Languages */}
          <Card>
            <CardHeader>
              <CardTitle>Education & Languages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Education</div>
                <div className="text-sm font-medium">{candidateData.education}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Languages</div>
                <div className="space-y-1">
                  {candidateData.languages.map((lang, index) => (
                    <div key={index} className="text-sm">{lang}</div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

