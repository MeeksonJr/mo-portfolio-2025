'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Code,
  Award,
  Briefcase,
  Download,
  Star,
  FileText,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

const candidateData = {
  name: 'Mohamed Datt',
  title: 'Full Stack Developer',
  location: 'Norfolk, Virginia, USA',
  timezone: 'EST (UTC-5)',
  availability: 'Available for opportunities',
  email: 'd.mohamed1504@gmail.com',
  linkedin: 'https://linkedin.com/in/mohamed-datt',
  github: 'https://github.com/MeeksonJr',
  portfolio: 'https://mohameddatt.com',
  skills: [
    { name: 'Next.js', level: 95, category: 'Frontend' },
    { name: 'React', level: 95, category: 'Frontend' },
    { name: 'TypeScript', level: 90, category: 'Language' },
    { name: 'Node.js', level: 85, category: 'Backend' },
    { name: 'PostgreSQL', level: 85, category: 'Database' },
    { name: 'AI Integration', level: 90, category: 'Specialty' },
    { name: 'Supabase', level: 85, category: 'Backend' },
    { name: 'TailwindCSS', level: 95, category: 'Frontend' },
  ],
  experience: 3,
  projects: 6,
  education: 'Computer Science (ODU)',
  achievements: [
    '1st Place Winner - Fall 2024 Internship Competition',
    'Built 6+ production SaaS applications',
    'Open source contributor',
  ],
  contactHistory: [
    { date: '2024-11-20', type: 'Email', note: 'Initial contact' },
    { date: '2024-11-18', type: 'LinkedIn', note: 'Connection request' },
  ],
  notes: '',
}

export default function AgentDashboardContent() {
  const [notes, setNotes] = useState(candidateData.notes)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleSaveNotes = () => {
    localStorage.setItem('candidate-notes', notes)
    // In a real implementation, this would save to a backend
  }

  const handleExportPackage = () => {
    const packageData = {
      candidate: candidateData,
      notes,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `candidate-package-${candidateData.name.replace(' ', '-')}-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const skillsByCategory = candidateData.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof candidateData.skills>)

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Agent Dashboard</h1>
            <p className="text-muted-foreground">Candidate management and insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsFavorite(!isFavorite)}>
              <Star className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
              Favorite
            </Button>
            <Button onClick={handleExportPackage}>
              <Download className="w-4 h-4 mr-2" />
              Export Package
            </Button>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Matrix</TabsTrigger>
          <TabsTrigger value="calendar">Availability</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Candidate Info */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Candidate Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">{candidateData.name}</div>
                  <div className="text-muted-foreground">{candidateData.title}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{candidateData.location}</div>
                      <div className="text-xs text-muted-foreground">{candidateData.timezone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{candidateData.availability}</div>
                      <div className="text-xs text-muted-foreground">{candidateData.experience} years exp</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${candidateData.email}`} target="_blank" rel="noopener noreferrer">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={candidateData.linkedin} target="_blank" rel="noopener noreferrer">
                      <User className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={candidateData.portfolio} target="_blank" rel="noopener noreferrer">
                      <FileText className="w-4 h-4 mr-2" />
                      Portfolio
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">{candidateData.projects}</div>
                  <div className="text-sm text-muted-foreground">Production Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{candidateData.experience}+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{candidateData.skills.length}</div>
                  <div className="text-sm text-muted-foreground">Key Skills</div>
                </div>
              </CardContent>
            </Card>
          </div>

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
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Contact History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {candidateData.contactHistory.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div>
                      <div className="font-medium">{contact.type}</div>
                      <div className="text-sm text-muted-foreground">{contact.note}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{contact.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Matrix Tab */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Skills Matrix
              </CardTitle>
              <CardDescription>Organized by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="font-semibold mb-3">{category}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {skills.map((skill) => (
                        <div key={skill.name} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{skill.name}</span>
                            <Badge variant="secondary">{skill.level}%</Badge>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            {/* eslint-disable-next-line react/forbid-dom-props */}
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Calendar Tab */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Availability Calendar
              </CardTitle>
              <CardDescription>View candidate availability and schedule meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Calendar integration coming soon</p>
                <p className="text-sm mt-2">
                  <a href="/calendar" className="text-primary hover:underline">
                    View availability calendar
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Notes
              </CardTitle>
              <CardDescription>Private notes about this candidate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                className="min-h-64"
              />
              <Button onClick={handleSaveNotes}>Save Notes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

