'use client'

import { usePersonalization } from '@/components/personalization/visitor-profile-provider'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Briefcase, Code, GraduationCap, Users, 
  FileText, Target, TrendingUp, Sparkles 
} from 'lucide-react'
import Link from 'next/link'

export default function PersonalizedHomepage() {
  const { profile } = usePersonalization()

  const personalizedSections = {
    recruiter: {
      title: 'For Recruiters',
      description: 'Quick access to everything you need',
      highlights: [
        { icon: FileText, label: 'Resume Hub', href: '/resume', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
        { icon: Target, label: 'Quick Assessment', href: '/assessment', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
        { icon: TrendingUp, label: 'Skills Match', href: '/skills-match', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
        { icon: Briefcase, label: 'ROI Calculator', href: '/roi-calculator', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
      ],
    },
    developer: {
      title: 'For Developers',
      description: 'Explore code, projects, and technical content',
      highlights: [
        { icon: Code, label: 'Code Hub', href: '/code', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
        { icon: FileText, label: 'Projects', href: '/projects', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
        { icon: Sparkles, label: 'Case Studies', href: '/case-studies', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
        { icon: Code, label: 'Architecture', href: '/architecture', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
      ],
    },
    client: {
      title: 'For Clients',
      description: 'See my work and client testimonials',
      highlights: [
        { icon: FileText, label: 'Case Studies', href: '/case-studies', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
        { icon: Users, label: 'Testimonials', href: '/testimonials', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
        { icon: Briefcase, label: 'Projects', href: '/projects', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
        { icon: Users, label: 'Client Showcase', href: '/#clients', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
      ],
    },
    student: {
      title: 'For Students',
      description: 'Learn from tutorials and resources',
      highlights: [
        { icon: FileText, label: 'Blog', href: '/blog', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
        { icon: GraduationCap, label: 'Resources', href: '/resources', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
        { icon: Code, label: 'Code Hub', href: '/code', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
        { icon: Sparkles, label: 'Learning Paths', href: '/learning-paths', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
      ],
    },
    general: {
      title: 'Welcome!',
      description: 'Explore my portfolio and work',
      highlights: [
        { icon: FileText, label: 'Projects', href: '/projects', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
        { icon: FileText, label: 'Blog', href: '/blog', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
        { icon: Users, label: 'About', href: '/about', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
        { icon: Briefcase, label: 'Resume', href: '/resume', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
      ],
    },
  }

  const section = personalizedSections[profile.type] || personalizedSections.general

  if (profile.confidence < 0.3) {
    return null // Don't show if confidence is too low
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {section.title}
              </CardTitle>
              <CardDescription className="mt-1">{section.description}</CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">
              {profile.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {section.highlights.map((highlight, index) => {
              const Icon = highlight.icon
              return (
                <Link key={index} href={highlight.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-lg border ${highlight.color} hover:shadow-md transition-all cursor-pointer`}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <p className="text-sm font-medium">{highlight.label}</p>
                  </motion.div>
                </Link>
              )
            })}
          </div>
          {profile.interests.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Based on your interests:</p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.slice(0, 5).map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

