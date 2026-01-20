'use client'

import { useEffect, useState } from 'react'
import { Activity, MessageSquare, User, Calendar, BookOpen, FolderKanban, Wrench } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

const contentTypeIcons = {
  blog: BookOpen,
  'blog_post': BookOpen,
  'case_study': FolderKanban,
  'case-study': FolderKanban,
  project: Wrench,
  resource: Wrench,
}

const contentTypeLabels = {
  blog: 'Blog',
  'blog_post': 'Blog',
  'case_study': 'Case Study',
  'case-study': 'Case Study',
  project: 'Project',
  resource: 'Resource',
}

export default function ActivityWidget() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivity()
    const interval = setInterval(fetchActivity, 2 * 60 * 1000) // Refresh every 2 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchActivity = async () => {
    try {
      const response = await fetch('/api/widgets/data?type=recent-activity&limit=10')
      const data = await response.json()
      if (data.success && data.widgets?.recentActivity) {
        setActivities(data.widgets.recentActivity)
      }
    } catch (error) {
      console.error('Error fetching activity:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-pulse mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const getContentUrl = (contentType: string, contentId: string) => {
    const typeMap: Record<string, string> = {
      blog: '/blog',
      'blog_post': '/blog',
      'case_study': '/case-studies',
      'case-study': '/case-studies',
      project: '/projects',
      resource: '/resources',
    }
    return typeMap[contentType] || '/'
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Recent Activity</h1>
        </div>
        
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => {
              const ContentIcon = contentTypeIcons[activity.content_type as keyof typeof contentTypeIcons] || MessageSquare
              const contentTypeLabel = contentTypeLabels[activity.content_type as keyof typeof contentTypeLabels] || 'Content'
              
              return (
                <div
                  key={activity.id}
                  className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <ContentIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium text-sm">{activity.author_name || 'Anonymous'}</span>
                        <Badge variant="outline" className="text-xs">
                          {contentTypeLabel}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {activity.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(activity.created_at), 'MMM d, yyyy HH:mm')}</span>
                      </div>
                      <Link
                        href={getContentUrl(activity.content_type, activity.content_id)}
                        className="text-xs text-primary hover:underline mt-2 inline-block"
                      >
                        View Content →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

