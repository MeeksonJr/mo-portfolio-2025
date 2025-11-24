'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, Search, CheckCircle2, XCircle, TrendingUp, 
  AlertCircle, Sparkles, Zap, BarChart3, Download, Share2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import { resumeData, type ResumeData } from '@/lib/resume-data'
import { toast } from 'sonner'

interface MatchResult {
  overallMatch: number
  skillsMatched: string[]
  skillsMissing: string[]
  skillsPartial: string[]
  recommendations: string[]
}

export default function SkillsMatchingTool() {
  const [jobDescription, setJobDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [data, setData] = useState(resumeData)

  useEffect(() => {
    // Fetch latest data
    fetch('/api/resume')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(() => {})
  }, [])

  // Extract all skills from resume data
  const allSkills = useMemo(() => {
    const skills: string[] = []
    Object.values(data.skills).forEach(category => {
      if (Array.isArray(category)) {
        skills.push(...category.map(s => s.toLowerCase()))
      }
    })
    // Also add from experience and projects
    data.experience.forEach(exp => {
      exp.technologies?.forEach(tech => skills.push(tech.toLowerCase()))
    })
    data.projects.forEach(project => {
      project.technologies.forEach(tech => skills.push(tech.toLowerCase()))
    })
    return [...new Set(skills)]
  }, [data])

  const analyzeMatch = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description or requirements')
      return
    }

    setIsAnalyzing(true)
    
    // Simulate analysis (in production, this could use AI for better matching)
    setTimeout(() => {
      const result = calculateMatch(jobDescription, allSkills, data)
      setMatchResult(result)
      setIsAnalyzing(false)
      toast.success('Match analysis complete!')
    }, 1000)
  }

  const calculateMatch = (jobDesc: string, skills: string[], resumeData: ResumeData): MatchResult => {
    const jobLower = jobDesc.toLowerCase()
    const matched: string[] = []
    const missing: string[] = []
    const partial: string[] = []

    // Common job requirement keywords
    const requirementKeywords = [
      'react', 'next.js', 'nextjs', 'typescript', 'javascript', 'node.js', 'nodejs',
      'python', 'java', 'c++', 'sql', 'postgresql', 'mongodb', 'firebase',
      'supabase', 'aws', 'docker', 'git', 'github', 'tailwind', 'tailwindcss',
      'ai', 'machine learning', 'ml', 'gemini', 'openai', 'hugging face',
      'full stack', 'frontend', 'backend', 'full-stack', 'web development',
      'api', 'rest', 'graphql', 'agile', 'scrum', 'ci/cd', 'devops'
    ]

    // Check for matched skills
    skills.forEach(skill => {
      if (jobLower.includes(skill) || requirementKeywords.some(kw => jobLower.includes(kw) && skill.includes(kw.split(' ')[0]))) {
        matched.push(skill)
      }
    })

    // Check for missing requirements
    requirementKeywords.forEach(keyword => {
      if (jobLower.includes(keyword) && !matched.some(m => m.includes(keyword.split(' ')[0]))) {
        missing.push(keyword)
      }
    })

    // Calculate overall match percentage
    const totalRequirements = requirementKeywords.filter(kw => jobLower.includes(kw)).length
    const matchPercentage = totalRequirements > 0 
      ? Math.round((matched.length / totalRequirements) * 100)
      : Math.round((matched.length / Math.max(1, skills.length)) * 100)

    // Generate recommendations
    const recommendations: string[] = []
    if (matchPercentage < 50) {
      recommendations.push('Consider highlighting transferable skills and learning ability')
    }
    if (missing.length > 0) {
      recommendations.push(`Missing ${missing.length} required skills - but has strong foundation to learn quickly`)
    }
    if (matchPercentage >= 80) {
      recommendations.push('Excellent match! Strong candidate for this role')
    }
    if (matchPercentage >= 60 && matchPercentage < 80) {
      recommendations.push('Good match with some learning opportunities')
    }

    return {
      overallMatch: Math.min(100, Math.max(0, matchPercentage)),
      skillsMatched: [...new Set(matched)],
      skillsMissing: [...new Set(missing)].slice(0, 10), // Limit to 10
      skillsPartial: partial,
      recommendations,
    }
  }

  const handleShare = async () => {
    if (!matchResult) return

    const shareText = `Skills Match: ${matchResult.overallMatch}% - ${data.personal.name}`
    const shareUrl = `${window.location.origin}/skills-match?match=${matchResult.overallMatch}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Skills Match Result',
          text: shareText,
          url: shareUrl,
        })
        toast.success('Match result shared!')
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        toast.success('Match result copied to clipboard!')
      }
    } catch (error) {
      // User cancelled
    }
  }

  const handleExport = () => {
    if (!matchResult) return

    const report = {
      candidate: data.personal.name,
      matchPercentage: matchResult.overallMatch,
      matchedSkills: matchResult.skillsMatched,
      missingSkills: matchResult.skillsMissing,
      recommendations: matchResult.recommendations,
      jobDescription: jobDescription,
      date: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `skills-match-report-${new Date().getTime()}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    toast.success('Match report exported!')
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Target className="h-10 w-10 text-primary" />
              Skills Matching Tool
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Input job requirements and see how {data.personal.name}'s skills match. Get instant match percentage and detailed analysis.
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Job Requirements
                </CardTitle>
                <CardDescription>
                  Paste the job description or list required skills and technologies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Example: Looking for a Full Stack Developer with React, Next.js, TypeScript, Node.js, PostgreSQL, and AI integration experience. Must have 3+ years of experience building SaaS applications..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px]"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={analyzeMatch} 
                    disabled={isAnalyzing || !jobDescription.trim()}
                    className="flex-1"
                  >
                    {isAnalyzing ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Analyze Match
                      </>
                    )}
                  </Button>
                  {jobDescription && (
                    <Button 
                      variant="outline" 
                      onClick={() => setJobDescription('')}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence>
            {matchResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Match Score */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Match Score
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleShare}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExport}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div 
                      className={`text-6xl font-bold mb-2 ${
                        matchResult.overallMatch >= 80 ? 'text-green-500' :
                        matchResult.overallMatch >= 60 ? 'text-yellow-500' : 'text-red-500'
                      }`}
                    >
                        {matchResult.overallMatch}%
                      </div>
                      <p className="text-muted-foreground">
                        {matchResult.overallMatch >= 80 ? 'Excellent Match!' :
                         matchResult.overallMatch >= 60 ? 'Good Match' :
                         matchResult.overallMatch >= 40 ? 'Moderate Match' : 'Low Match'}
                      </p>
                    </div>
                    <Progress 
                      value={matchResult.overallMatch} 
                      className="h-3 mb-4"
                    />
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {matchResult.skillsMatched.length} Skills Matched
                      </div>
                      {matchResult.skillsMissing.length > 0 && (
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          {matchResult.skillsMissing.length} Missing
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Matched Skills */}
                {matchResult.skillsMatched.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        Matched Skills ({matchResult.skillsMatched.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.skillsMatched.map((skill, idx) => (
                          <Badge key={idx} variant="default" className="text-sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Missing Skills */}
                {matchResult.skillsMissing.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        Missing Skills ({matchResult.skillsMissing.length})
                      </CardTitle>
                      <CardDescription>
                        Skills mentioned in job requirements but not in current skill set
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.skillsMissing.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                {matchResult.recommendations.length > 0 && (
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-semibold mb-2">Recommendations:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {matchResult.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Learning Path Suggestion */}
                {matchResult.skillsMissing.length > 0 && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Learning Path
                      </CardTitle>
                      <CardDescription>
                        {data.personal.name} has a strong foundation and can quickly learn missing skills
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        With {data.personal.name}'s track record of building multiple SaaS products and 
                        demonstrating rapid learning (learned English in 3 months, self-taught developer), 
                        the missing skills can be acquired quickly through hands-on projects and focused learning.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Example Section */}
          {!matchResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    How to Use
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Paste the job description or list required skills in the text area above</li>
                    <li>Click "Analyze Match" to see the match percentage</li>
                    <li>Review matched skills, missing skills, and recommendations</li>
                    <li>Export or share the match report for your records</li>
                  </ol>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
      <FooterLight />
    </>
  )
}

