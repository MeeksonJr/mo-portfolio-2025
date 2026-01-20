'use client'

import { useEffect, useState } from 'react'
import { BarChart3, BookOpen, FolderKanban, Wrench, TrendingUp, MessageSquare, Eye } from 'lucide-react'
import Link from 'next/link'

export default function StatsWidget() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10 * 60 * 1000) // Refresh every 10 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/widgets/data?type=site-stats')
      const data = await response.json()
      if (data.success && data.widgets?.siteStats) {
        setStats(data.widgets.siteStats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <BarChart3 className="h-8 w-8 animate-pulse mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Site Statistics</h1>
        </div>
        
        <div className="space-y-4">
          {/* Content Counts */}
          <div className="p-4 rounded-lg border bg-card">
            <h2 className="font-semibold mb-4">Content Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.blogPosts}</p>
                  <p className="text-xs text-muted-foreground">Blog Posts</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.caseStudies}</p>
                  <p className="text-xs text-muted-foreground">Case Studies</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.projects}</p>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.resources}</p>
                  <p className="text-xs text-muted-foreground">Resources</p>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="p-4 rounded-lg border bg-card">
            <h2 className="font-semibold mb-4">Engagement</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Total Views</span>
                </div>
                <span className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Total Comments</span>
                </div>
                <span className="text-2xl font-bold">{stats.totalComments}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Link
              href="/blog"
              className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-center"
            >
              <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium">Blog</p>
            </Link>
            <Link
              href="/case-studies"
              className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-center"
            >
              <FolderKanban className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium">Case Studies</p>
            </Link>
            <Link
              href="/projects"
              className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-center"
            >
              <Wrench className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium">Projects</p>
            </Link>
            <Link
              href="/resources"
              className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-center"
            >
              <Wrench className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium">Resources</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

