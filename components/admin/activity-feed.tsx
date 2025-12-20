'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Briefcase,
  Package,
  FolderGit2,
  MessageSquare,
  Clock,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { supabase } from '@/lib/supabase/client'

interface ActivityItem {
  id: string
  type: 'blog' | 'case-study' | 'resource' | 'project' | 'testimonial'
  title: string
  action: 'created' | 'updated' | 'published' | 'deleted'
  timestamp: string
}

const activityIcons = {
  blog: FileText,
  'case-study': Briefcase,
  resource: Package,
  project: FolderGit2,
  testimonial: MessageSquare,
}

const activityColors = {
  created: 'bg-green-500/10 text-green-600',
  updated: 'bg-blue-500/10 text-blue-600',
  published: 'bg-purple-500/10 text-purple-600',
  deleted: 'bg-red-500/10 text-red-600',
}

export default function ActivityFeed({ limit = 10 }: { limit?: number }) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const allActivities: ActivityItem[] = []

        // Fetch blog posts
        const { data: blogPosts } = await supabase
          .from('blog_posts')
          .select('id, title, updated_at, status')
          .order('updated_at', { ascending: false })
          .limit(limit)

        if (blogPosts) {
          blogPosts.forEach((post) => {
            allActivities.push({
              id: post.id,
              type: 'blog',
              title: post.title,
              action: post.status === 'published' ? 'published' : 'updated',
              timestamp: post.updated_at,
            })
          })
        }

        // Fetch case studies
        const { data: caseStudies } = await supabase
          .from('case_studies')
          .select('id, title, updated_at, status')
          .order('updated_at', { ascending: false })
          .limit(limit)

        if (caseStudies) {
          caseStudies.forEach((study) => {
            allActivities.push({
              id: study.id,
              type: 'case-study',
              title: study.title,
              action: study.status === 'published' ? 'published' : 'updated',
              timestamp: study.updated_at,
            })
          })
        }

        // Fetch resources
        const { data: resources } = await supabase
          .from('resources')
          .select('id, title, updated_at, status')
          .order('updated_at', { ascending: false })
          .limit(limit)

        if (resources) {
          resources.forEach((resource) => {
            allActivities.push({
              id: resource.id,
              type: 'resource',
              title: resource.title,
              action: resource.status === 'published' ? 'published' : 'updated',
              timestamp: resource.updated_at,
            })
          })
        }

        // Fetch projects
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('id, name, updated_at, status')
          .order('updated_at', { ascending: false })
          .limit(limit)

        if (projectsError) {
          console.error('Error fetching projects:', projectsError)
        }

        if (projects) {
          projects.forEach((project) => {
            allActivities.push({
              id: project.id,
              type: 'project',
              title: project.name || 'Untitled Project',
              action: project.status === 'published' ? 'published' : 'updated',
              timestamp: project.updated_at,
            })
          })
        }

        // Sort by timestamp and limit
        allActivities.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )

        setActivities(allActivities.slice(0, limit))
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [limit])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg">
                <div className="p-2 rounded-lg bg-muted animate-pulse h-8 w-8" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No recent activity
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type]
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium truncate">
                      {activity.title}
                    </p>
                    <Badge
                      variant="outline"
                      className={activityColors[activity.action]}
                    >
                      {activity.action}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
