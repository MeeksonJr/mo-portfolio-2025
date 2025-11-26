'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  Activity,
  Sparkles,
  Calendar,
  Network,
  TrendingUp,
  Eye,
  Users,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import PublicAnalyticsDashboard from '@/components/analytics/public-analytics-dashboard'
import LiveActivityFeed from '@/components/activity/live-activity-feed'
import ContentRecommendations from '@/components/recommendations/content-recommendations'
import InteractiveProjectTimeline from '@/components/projects/project-timeline'
import InteractiveSkillTree from '@/components/skills/skill-tree'

const TAB_OPTIONS = [
  { value: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Portfolio statistics and metrics' },
  { value: 'activity', label: 'Activity', icon: Activity, description: 'Real-time activity feed' },
  { value: 'recommendations', label: 'Recommendations', icon: Sparkles, description: 'AI-powered content suggestions' },
  { value: 'timeline', label: 'Project Timeline', icon: Calendar, description: 'Interactive project timeline' },
  { value: 'skills', label: 'Skill Tree', icon: Network, description: 'Interactive skill visualization' },
] as const

function InsightsHubContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('analytics')

  // Sync tab with URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && TAB_OPTIONS.some((t) => t.value === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/insights?tab=${value}`, { scroll: false })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-gradient-to-b from-background to-muted/20"
      >
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <BarChart3 className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Insights Hub
              </h1>
            </motion.div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore portfolio analytics, activity feeds, personalized recommendations, project timelines, and skill visualizations.
            </p>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { label: 'Visualizations', value: '5', icon: BarChart3 },
              { label: 'AI-Powered', value: '1', icon: Sparkles },
              { label: 'Real-Time', value: '2', icon: Activity },
              { label: 'Interactive', value: '100%', icon: Zap },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="text-center border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Tab Navigation */}
          <div className="sticky top-20 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 bg-muted/50 overflow-x-auto">
              {TAB_OPTIONS.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex flex-col md:flex-row items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm min-w-[100px]"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs md:text-sm font-medium text-center">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Analytics Tab */}
              <TabsContent value="analytics" className="mt-0">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          Portfolio Analytics
                        </CardTitle>
                        <CardDescription>
                          View portfolio statistics, popular content, and engagement metrics
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Public</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <PublicAnalyticsDashboard />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="mt-0">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-primary" />
                          Live Activity Feed
                        </CardTitle>
                        <CardDescription>
                          Real-time feed of GitHub activity, blog posts, and project updates
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Real-Time</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <LiveActivityFeed />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations" className="mt-0">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          Content Recommendations
                        </CardTitle>
                        <CardDescription>
                          AI-powered content recommendations based on your interests
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">AI-Powered</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ContentRecommendations />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Project Timeline Tab */}
              <TabsContent value="timeline" className="mt-0">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          Interactive Project Timeline
                        </CardTitle>
                        <CardDescription>
                          Visual timeline of all projects in chronological order
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Interactive</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <InteractiveProjectTimeline />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Skill Tree Tab */}
              <TabsContent value="skills" className="mt-0">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Network className="h-5 w-5 text-primary" />
                          Interactive Skill Tree
                        </CardTitle>
                        <CardDescription>
                          Interactive skill tree visualization showing technical skills and dependencies
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Interactive</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <InteractiveSkillTree />
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}

export default function InsightsHub() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Insights Hub...</p>
        </div>
      </div>
    }>
      <InsightsHubContent />
    </Suspense>
  )
}

