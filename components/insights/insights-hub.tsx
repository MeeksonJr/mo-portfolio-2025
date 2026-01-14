'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
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
  Loader2,
} from 'lucide-react'

// Lazy load tab components for better performance
const PublicAnalyticsDashboard = lazy(() => import('@/components/analytics/public-analytics-dashboard'))
const LiveActivityFeed = lazy(() => import('@/components/activity/live-activity-feed'))
const ContentRecommendations = lazy(() => import('@/components/recommendations/content-recommendations'))
const InteractiveProjectTimeline = lazy(() => import('@/components/projects/project-timeline'))
const InteractiveSkillTree = lazy(() => import('@/components/skills/skill-tree'))
import { useScreenReaderAnnouncement } from '@/components/accessibility/live-region'
import { useFocusManagement } from '@/hooks/use-focus-management'

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
  const { announce } = useScreenReaderAnnouncement()

  // Sync tab with URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && TAB_OPTIONS.some((t) => t.value === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Focus management for tab changes
  useFocusManagement(activeTab, `insights-tabpanel-${activeTab}`)

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const tab = TAB_OPTIONS.find((t) => t.value === value)
    setActiveTab(value)
    router.push(`/insights?tab=${value}`, { scroll: false })
    
    // Announce tab change to screen readers
    if (tab) {
      announce(`Switched to ${tab.label} tab: ${tab.description}`, 'polite')
    }
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
          <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b mb-6">
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList 
                className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto p-1 bg-muted/60 backdrop-blur-sm min-w-max"
                aria-label="Insights Hub navigation tabs"
              >
                {TAB_OPTIONS.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.value
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background/95 data-[state=active]:backdrop-blur-sm data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border/50 min-w-[80px] sm:min-w-[100px] transition-all"
                      aria-label={`${tab.label} tab, ${tab.description}. ${isActive ? 'Currently active' : ''} Press Enter or Space to activate.`}
                      aria-selected={isActive}
                      aria-controls={`insights-tabpanel-${tab.value}`}
                      id={`insights-tab-${tab.value}`}
                      role="tab"
                      tabIndex={isActive ? 0 : -1}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                      <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-center leading-tight">{tab.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>
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
              <TabsContent 
                value="analytics" 
                className="mt-0"
                id="insights-tabpanel-analytics"
                role="tabpanel"
                aria-labelledby="insights-tab-analytics"
                tabIndex={0}
              >
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
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading analytics dashboard...</span>
                      </div>
                    }>
                      <PublicAnalyticsDashboard />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent 
                value="activity" 
                className="mt-0"
                id="insights-tabpanel-activity"
                role="tabpanel"
                aria-labelledby="insights-tab-activity"
                tabIndex={0}
              >
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
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading activity feed...</span>
                      </div>
                    }>
                      <LiveActivityFeed />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent 
                value="recommendations" 
                className="mt-0"
                id="insights-tabpanel-recommendations"
                role="tabpanel"
                aria-labelledby="insights-tab-recommendations"
                tabIndex={0}
              >
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
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading recommendations...</span>
                      </div>
                    }>
                      <ContentRecommendations />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Project Timeline Tab */}
              <TabsContent 
                value="timeline" 
                className="mt-0"
                id="insights-tabpanel-timeline"
                role="tabpanel"
                aria-labelledby="insights-tab-timeline"
                tabIndex={0}
              >
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
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading project timeline...</span>
                      </div>
                    }>
                      <InteractiveProjectTimeline />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Skill Tree Tab */}
              <TabsContent 
                value="skills" 
                className="mt-0"
                id="insights-tabpanel-skills"
                role="tabpanel"
                aria-labelledby="insights-tab-skills"
                tabIndex={0}
              >
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
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading skill tree...</span>
                      </div>
                    }>
                      <InteractiveSkillTree />
                    </Suspense>
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

