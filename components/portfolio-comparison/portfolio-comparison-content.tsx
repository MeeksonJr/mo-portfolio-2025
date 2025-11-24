'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Scale, Download, Plus, X, TrendingUp, Code, Award, GraduationCap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface Candidate {
  id: string
  name: string
  title: string
  experience: number
  skills: { name: string; level: number }[]
  projects: number
  education: string
  certifications: string[]
  location: string
}

const defaultCandidate: Candidate = {
  id: 'mohamed-datt',
  name: 'Mohamed Datt',
  title: 'Full Stack Developer',
  experience: 3,
  skills: [
    { name: 'Next.js', level: 95 },
    { name: 'React', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'PostgreSQL', level: 85 },
    { name: 'AI Integration', level: 90 },
  ],
  projects: 6,
  education: 'Computer Science (ODU)',
  certifications: [],
  location: 'Norfolk, Virginia',
}

const sampleCandidates: Candidate[] = [
  {
    id: 'candidate-1',
    name: 'Candidate A',
    title: 'Full Stack Developer',
    experience: 5,
    skills: [
      { name: 'Next.js', level: 80 },
      { name: 'React', level: 85 },
      { name: 'TypeScript', level: 75 },
      { name: 'Node.js', level: 90 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'AI Integration', level: 60 },
    ],
    projects: 8,
    education: 'Computer Science (BS)',
    certifications: ['AWS Certified'],
    location: 'Remote',
  },
  {
    id: 'candidate-2',
    name: 'Candidate B',
    title: 'Frontend Developer',
    experience: 4,
    skills: [
      { name: 'Next.js', level: 70 },
      { name: 'React', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Node.js', level: 60 },
      { name: 'PostgreSQL', level: 50 },
      { name: 'AI Integration', level: 40 },
    ],
    projects: 5,
    education: 'Web Development (Bootcamp)',
    certifications: [],
    location: 'New York, NY',
  },
]

export default function PortfolioComparisonContent() {
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([defaultCandidate])
  const [availableCandidates, setAvailableCandidates] = useState<Candidate[]>(sampleCandidates)

  const addCandidate = (candidate: Candidate) => {
    if (selectedCandidates.length < 3 && !selectedCandidates.find((c) => c.id === candidate.id)) {
      setSelectedCandidates([...selectedCandidates, candidate])
      setAvailableCandidates(availableCandidates.filter((c) => c.id !== candidate.id))
    }
  }

  const removeCandidate = (id: string) => {
    const removed = selectedCandidates.find((c) => c.id === id)
    if (removed && removed.id !== defaultCandidate.id) {
      setSelectedCandidates(selectedCandidates.filter((c) => c.id !== id))
      setAvailableCandidates([...availableCandidates, removed])
    }
  }

  const getSkillComparison = (skillName: string) => {
    return selectedCandidates.map((candidate) => {
      const skill = candidate.skills.find((s) => s.name === skillName)
      return {
        candidate: candidate.name,
        level: skill?.level || 0,
      }
    })
  }

  const allSkills = Array.from(
    new Set(selectedCandidates.flatMap((c) => c.skills.map((s) => s.name)))
  )

  const handleExport = () => {
    const comparisonData = {
      candidates: selectedCandidates,
      comparisonDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(comparisonData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portfolio-comparison-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Scale className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Portfolio Comparison Tool</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Compare skills, experience, and qualifications side-by-side. Add up to 3 candidates for comparison.
        </p>
      </motion.div>

      {/* Add Candidates */}
      {availableCandidates.length > 0 && selectedCandidates.length < 3 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Candidate for Comparison</CardTitle>
            <CardDescription>Select a candidate to compare (anonymized)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {availableCandidates.map((candidate) => (
                <button
                  key={candidate.id}
                  onClick={() => addCandidate(candidate)}
                  className="p-4 border rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{candidate.name}</div>
                      <div className="text-sm text-muted-foreground">{candidate.title}</div>
                    </div>
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Grid */}
      {selectedCandidates.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {selectedCandidates.map((candidate) => (
            <Card key={candidate.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{candidate.name}</CardTitle>
                    <CardDescription>{candidate.title}</CardDescription>
                  </div>
                  {candidate.id !== defaultCandidate.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCandidate(candidate.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Code className="w-4 h-4 text-primary" />
                  <span>{candidate.experience} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-primary" />
                  <span>{candidate.projects} projects</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span>{candidate.education}</span>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Top Skills</div>
                  <div className="space-y-2">
                    {candidate.skills.slice(0, 4).map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{skill.name}</span>
                          <span>{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Skill Comparison */}
      {selectedCandidates.length > 1 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Skill Level Comparison
            </CardTitle>
            <CardDescription>Compare skill levels across candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {allSkills.map((skillName) => {
                const comparisons = getSkillComparison(skillName)
                const maxLevel = Math.max(...comparisons.map((c) => c.level))

                return (
                  <div key={skillName}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{skillName}</span>
                      <Badge variant="outline">{maxLevel}% max</Badge>
                    </div>
                    <div className="space-y-2">
                      {comparisons.map((comp) => (
                        <div key={comp.candidate}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{comp.candidate}</span>
                            <span>{comp.level}%</span>
                          </div>
                          <Progress value={comp.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export */}
      {selectedCandidates.length > 1 && (
        <div className="flex justify-center">
          <Button onClick={handleExport} size="lg">
            <Download className="w-4 h-4 mr-2" />
            Export Comparison Report
          </Button>
        </div>
      )}
    </div>
  )
}

