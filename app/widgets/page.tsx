'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, BookOpen, FolderKanban, Wrench, BarChart3, Activity, TrendingUp, Music, Search, Eye, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import WidgetInstaller from '@/components/widgets/widget-installer'

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWidgetData()
  }, [])

  const fetchWidgetData = async () => {
    try {
      const response = await fetch('/api/widgets/data?type=all&limit=5')
      const data = await response.json()
      if (data.success) {
        setWidgets(data.widgets)
      }
    } catch (error) {
      console.error('Error fetching widgets:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Widgets</h1>
            <p className="text-muted-foreground">
              Add these widgets to your iOS home screen for quick access to portfolio content
            </p>
          </div>

          <WidgetInstaller />

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Live Preview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Latest Blog Posts Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Latest Blog Posts
              </CardTitle>
              <CardDescription>View the latest blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {widgets?.latestBlog?.slice(0, 3).map((post: any) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="block p-2 rounded hover:bg-muted transition-colors"
                  >
                    <p className="font-medium line-clamp-2">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.views || 0} views
                    </p>
                  </Link>
                ))}
              </div>
              <Button className="w-full mt-4" asChild>
                <Link href="/blog">View All Posts</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Latest Case Studies Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                Latest Case Studies
              </CardTitle>
              <CardDescription>View recent case studies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {widgets?.latestCaseStudies?.slice(0, 3).map((study: any) => (
                  <Link
                    key={study.id}
                    href={`/case-studies/${study.slug}`}
                    className="block p-2 rounded hover:bg-muted transition-colors"
                  >
                    <p className="font-medium line-clamp-2">{study.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {study.views || 0} views
                    </p>
                  </Link>
                ))}
              </div>
              <Button className="w-full mt-4" asChild>
                <Link href="/case-studies">View All Case Studies</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Featured Projects Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Featured Projects
              </CardTitle>
              <CardDescription>Browse featured projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {widgets?.featuredProjects?.slice(0, 3).map((project: any) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="block p-2 rounded hover:bg-muted transition-colors"
                  >
                    <p className="font-medium line-clamp-2">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.views || 0} views
                    </p>
                  </Link>
                ))}
              </div>
              <Button className="w-full mt-4" asChild>
                <Link href="/projects">View All Projects</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Popular Resources Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Popular Resources
              </CardTitle>
              <CardDescription>Most viewed resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {widgets?.popularResources?.slice(0, 3).map((resource: any) => (
                  <Link
                    key={resource.id}
                    href={`/resources/${resource.slug}`}
                    className="block p-2 rounded hover:bg-muted transition-colors"
                  >
                    <p className="font-medium line-clamp-2">{resource.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {resource.views || 0} views
                    </p>
                  </Link>
                ))}
              </div>
              <Button className="w-full mt-4" asChild>
                <Link href="/resources">View All Resources</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Site Stats Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Site Statistics
              </CardTitle>
              <CardDescription>Portfolio statistics</CardDescription>
            </CardHeader>
            <CardContent>
              {widgets?.siteStats && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blog Posts</span>
                    <span className="font-medium">{widgets.siteStats.blogPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Case Studies</span>
                    <span className="font-medium">{widgets.siteStats.caseStudies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projects</span>
                    <span className="font-medium">{widgets.siteStats.projects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resources</span>
                    <span className="font-medium">{widgets.siteStats.resources}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Total Views</span>
                    <span className="font-bold">{widgets.siteStats.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Comments</span>
                    <span className="font-bold">{widgets.siteStats.totalComments}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest comments and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {widgets?.recentActivity?.slice(0, 3).map((activity: any) => (
                  <div key={activity.id} className="p-2 rounded border">
                    <p className="text-sm font-medium">{activity.author_name || 'Anonymous'}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {activity.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Content Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Popular Content
              </CardTitle>
              <CardDescription>Most viewed content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium mb-2">Top Blogs</p>
                  {widgets?.popularContent?.blogs?.slice(0, 2).map((blog: any) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="block p-2 rounded hover:bg-muted transition-colors text-sm"
                    >
                      <p className="line-clamp-1">{blog.title}</p>
                      <p className="text-xs text-muted-foreground">{blog.views || 0} views</p>
                    </Link>
                  ))}
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Top Case Studies</p>
                  {widgets?.popularContent?.caseStudies?.slice(0, 2).map((study: any) => (
                    <Link
                      key={study.id}
                      href={`/case-studies/${study.slug}`}
                      className="block p-2 rounded hover:bg-muted transition-colors text-sm"
                    >
                      <p className="line-clamp-1">{study.title}</p>
                      <p className="text-xs text-muted-foreground">{study.views || 0} views</p>
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Music Player Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Music Player
              </CardTitle>
              <CardDescription>Latest songs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {widgets?.musicPlayer?.slice(0, 3).map((song: any) => (
                  <div key={song.id} className="p-2 rounded border">
                    <p className="text-sm font-medium">{song.title}</p>
                    {song.artist && (
                      <p className="text-xs text-muted-foreground">{song.artist}</p>
                    )}
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" asChild>
                <Link href="/music">Open Music Player</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

          </div>
        </div>
      </main>
      <FooterLight />
    </div>
  )
}

