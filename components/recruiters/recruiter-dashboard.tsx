'use client'

import { motion } from 'framer-motion'
import { 
  FileText, Download, Briefcase, Target, Calculator, 
  User, Mail, Calendar, ExternalLink, CheckCircle2,
  TrendingUp, Award, Code, Globe
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { resumeData } from '@/lib/resume-data'

export default function RecruiterDashboard() {
  const quickLinks = [
    {
      title: 'Download Resume',
      description: 'One-click download in multiple formats (ATS, Creative, Traditional)',
      icon: Download,
      href: '/resume',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Quick Assessment',
      description: '30-second overview of skills, experience, and projects',
      icon: Target,
      href: '/assessment',
      color: 'bg-green-500/10 text-green-600 dark:text-green-400',
    },
    {
      title: 'Skills Matching',
      description: 'Input job requirements and get instant match percentage',
      icon: TrendingUp,
      href: '/skills-match',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Candidate Summary',
      description: 'One-page quick reference for recruiters',
      icon: FileText,
      href: '/resume?tab=summary',
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    },
    {
      title: 'ROI Calculator',
      description: 'Calculate business impact and cost savings',
      icon: Calculator,
      href: '/roi-calculator',
      color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    },
    {
      title: 'Portfolio Comparison',
      description: 'Compare with other candidates',
      icon: Code,
      href: '/portfolio-comparison',
      color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    },
  ]

  const keyInfo = [
    { label: 'Location', value: resumeData.personal.location, icon: Globe },
    { label: 'Availability', value: 'Open to Work', icon: CheckCircle2 },
    { label: 'Experience', value: '4+ Years', icon: Briefcase },
    { label: 'Email', value: resumeData.personal.email, icon: Mail },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold">Recruiter Dashboard</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to evaluate Mohamed Datt as a candidate. Quick access to resume, skills, and contact information.
        </p>
      </motion.div>

      {/* Key Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Key Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {keyInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{info.label}</span>
                    </div>
                    <p className="font-semibold">{info.value}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-6">Quick Access Tools</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => {
            const Icon = link.icon
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Link href={link.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow bg-background/95 backdrop-blur-sm">
                    <CardHeader>
                      <div className={`p-3 rounded-lg w-fit mb-2 ${link.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{link.title}</CardTitle>
                      <CardDescription>{link.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full gap-2" asChild>
                        <span>
                          Access Tool
                          <ExternalLink className="h-4 w-4" />
                        </span>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Skills Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Top Skills
            </CardTitle>
            <CardDescription>Key technologies and expertise areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.values(resumeData.skills).flat().slice(0, 20).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
            <Link href="/about">
              <Button variant="link" className="mt-4">
                View Full Skills Matrix →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Ready to Connect?
            </CardTitle>
            <CardDescription>
              Let's discuss how I can contribute to your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="flex-1">
                <Link href="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link href="/contact?tab=calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Call
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

