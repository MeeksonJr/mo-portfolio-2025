'use client'

import { usePersonalization } from './visitor-profile-provider'
import { getContentEmphasis } from '@/lib/visitor-profiling'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Sparkles, Target, TrendingUp } from 'lucide-react'

interface PersonalizedContentProps {
  className?: string
}

export default function PersonalizedContent({ className }: PersonalizedContentProps) {
  const { profile } = usePersonalization()
  const emphasis = getContentEmphasis(profile.type)

  if (profile.confidence < 0.2) {
    // Not enough data yet
    return null
  }

  const typeLabels: Record<string, string> = {
    recruiter: 'Recruiter',
    developer: 'Developer',
    client: 'Client',
    student: 'Student',
    general: 'Visitor',
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Personalized for You
          </CardTitle>
          <Badge variant="secondary">{typeLabels[profile.type]}</Badge>
        </div>
        <CardDescription>
          Based on your browsing, we've highlighted content that might interest you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Recommended Content
            </h4>
            <div className="space-y-2">
              {emphasis.recommendedContent.slice(0, 3).map((path) => {
                const labels: Record<string, string> = {
                  '/resume': 'View Resume',
                  '/skills-match': 'Skills Match Tool',
                  '/testimonials': 'Client Testimonials',
                  '/case-studies': 'Case Studies',
                  '/projects': 'Projects',
                  '/architecture': 'Technical Architecture',
                  '/collaboration': 'Team Collaboration',
                  '/demos': 'Live Demos',
                  '/blog': 'Blog Posts',
                  '/learning-paths': 'Learning Paths',
                  '/resources': 'Resources',
                  '/timeline': 'Timeline',
                  '/contact': 'Contact',
                  '/about': 'About',
                }
                return (
                  <Link key={path} href={path}>
                    <Button variant="ghost" className="w-full justify-between" size="sm">
                      <span>{labels[path] || path}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          {profile.interests.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Your Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <Badge key={interest} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

