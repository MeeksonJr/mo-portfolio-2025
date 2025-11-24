'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, Github, FileText, Rocket, RefreshCw,
  Calendar, ExternalLink, Filter, Clock, TrendingUp,
  Code2, BookOpen, FolderGit2, Zap, ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { format, formatDistanceToNow } from 'date-fns'

interface ActivityItem {
  id: string
  type: 'github' | 'blog' | 'project' | 'update'
  title: string
  description: string
  url?: string
  timestamp: Date
  icon: typeof Github
  color: string
  metadata?: Record<string, any>
}

const ACTIVITY_TYPES: Record<string, { label: string; icon: typeof Activity; color?: string }> = {
  all: { label: 'All Activity', icon: Activity },
  github: { label: 'GitHub', icon: Github, color: 'text-gray-500' },
  blog: { label: 'Blog Posts', icon: FileText, color: 'text-blue-500' },
  project: { label: 'Projects', icon: Rocket, color: 'text-green-500' },
  update: { label: 'Updates', icon: Zap, color: 'text-purple-500' },
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    fetchActivities()
    
    // Auto-refresh every 5 minutes if enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchActivities()
      }, 5 * 60 * 1000) // 5 minutes

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const allActivities: ActivityItem[] = []

      // Fetch blog posts
      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('id, title, slug, published_at, updated_at, status')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(10)

      if (blogPosts) {
        blogPosts.forEach(post => {
          allActivities.push({
            id: `blog-${post.id}`,
            type: 'blog',
            title: post.title,
            description: `New blog post published`,
            url: `/blog/${post.slug}`,
            timestamp: new Date(post.published_at || post.updated_at),
            icon: FileText,
            color: 'text-blue-500',
            metadata: { slug: post.slug },
          })
        })
      }

      // Fetch projects
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name, github_url, created_at, updated_at, status')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10)

      if (projects) {
        projects.forEach(project => {
          allActivities.push({
            id: `project-${project.id}`,
            type: 'project',
            title: project.name,
            description: `New project added to portfolio`,
            url: project.github_url || undefined,
            timestamp: new Date(project.created_at),
            icon: Rocket,
            color: 'text-green-500',
            metadata: { github_url: project.github_url },
          })
        })
      }

      // Fetch GitHub activity (simulated - in production, use GitHub API)
      // For now, we'll create some sample GitHub activities
      const githubActivities: ActivityItem[] = [
        {
          id: 'github-1',
          type: 'github',
          title: 'Repository Update',
          description: 'Updated portfolio-2025 repository',
          url: 'https://github.com/MeeksonJr/mo-portfolio-2025',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          icon: Github,
          color: 'text-gray-500',
          metadata: { repo: 'mo-portfolio-2025', action: 'push' },
        },
        {
          id: 'github-2',
          type: 'github',
          title: 'New Commit',
          description: 'Added new features to ai-content-generator',
          url: 'https://github.com/MeeksonJr/ai-content-generator',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          icon: Code2,
          color: 'text-gray-500',
          metadata: { repo: 'ai-content-generator', action: 'commit' },
        },
      ]

      allActivities.push(...githubActivities)

      // Sort by timestamp (newest first)
      allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      setActivities(allActivities)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredActivities = useMemo(() => {
    if (selectedType === 'all') return activities
    return activities.filter(activity => activity.type === selectedType)
  }, [activities, selectedType])

  const handleRefresh = () => {
    fetchActivities()
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'github':
        return Github
      case 'blog':
        return FileText
      case 'project':
        return Rocket
      default:
        return Activity
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'github':
        return 'text-gray-500'
      case 'blog':
        return 'text-blue-500'
      case 'project':
        return 'text-green-500'
      default:
        return 'text-primary'
    }
  }

  if (loading && activities.length === 0) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading activity feed...</p>
          </div>
        </div>
        <FooterLight />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Activity className="h-10 w-10 text-primary" />
              Live Activity Feed
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time updates on GitHub activity, blog posts, and project developments
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACTIVITY_TYPES).map(([key, value]) => {
                    const Icon = value.icon
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${value.color || ''}`} />
                          {value.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="text-sm">
                {filteredActivities.length} {filteredActivities.length === 1 ? 'item' : 'items'}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {lastRefresh && formatDistanceToNow(lastRefresh, { addSuffix: true })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity, idx) => {
                  const Icon = activity.icon
                  const timeAgo = formatDistanceToNow(activity.timestamp, { addSuffix: true })
                  const formattedDate = format(activity.timestamp, 'MMM d, yyyy')

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="hover:border-primary/50 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg bg-muted ${activity.color.replace('text-', 'bg-').replace('-500', '-500/10')}`}>
                              <Icon className={`h-5 w-5 ${activity.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg">{activity.title}</h3>
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {activity.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {activity.description}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formattedDate}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {timeAgo}
                                    </div>
                                  </div>
                                </div>
                                {activity.url && (
                                  <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <a 
                                      href={activity.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      aria-label={`Open ${activity.title} in new tab`}
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                              {activity.url && activity.type !== 'github' && (
                                <Link
                                  href={activity.url}
                                  className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-2"
                                >
                                  View {activity.type === 'blog' ? 'post' : 'project'}
                                  <ChevronRight className="h-3 w-3" />
                                </Link>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No activity found</p>
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Activity Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(ACTIVITY_TYPES)
                    .filter(([key]) => key !== 'all')
                    .map(([key, value]) => {
                      const count = activities.filter(a => a.type === key).length
                      const Icon = value.icon
                      return (
                        <div key={key} className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Icon className={`h-5 w-5 ${value.color || ''}`} />
                            <span className="text-sm font-medium capitalize">{key}</span>
                          </div>
                          <div className="text-2xl font-bold">{count}</div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <FooterLight />
    </>
  )
}

