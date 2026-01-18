'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Wrench,
  Building2,
  Activity,
  TrendingUp,
  BookOpen,
  LayoutDashboard,
  Heart,
  MapPin,
  Code,
  Rocket,
  Loader2,
} from 'lucide-react'

// Lazy load tab components for better performance
const AboutPageContent = lazy(() => import('@/components/about-page-content'))
const UsesPageContent = lazy(() => import('@/components/uses/uses-page-content'))
const VirtualOfficeTour = lazy(() => import('@/components/office/virtual-office-tour'))
const ActivityStatusIndicator = lazy(() => import('@/components/activity/activity-status-indicator'))
const ProgressIndicators = lazy(() => import('@/components/progress/progress-indicators'))
const LearningPathGenerator = lazy(() => import('@/components/learning/learning-path-generator'))
const PersonalDashboard = lazy(() => import('@/components/dashboard/personal-dashboard'))
import { useScreenReaderAnnouncement } from '@/components/accessibility/live-region'
import { useFocusManagement } from '@/hooks/use-focus-management'
import PageContainer from '@/components/layout/page-container'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

const TAB_OPTIONS = [
  { value: 'bio', label: 'Bio', icon: User, description: 'About me and my journey' },
  { value: 'uses', label: 'Uses', icon: Wrench, description: 'Hardware, software, and tools' },
  { value: 'office', label: 'Office Tour', icon: Building2, description: 'Virtual workspace tour' },
  { value: 'activity', label: 'Activity Status', icon: Activity, description: 'Current activity and availability' },
  { value: 'progress', label: 'Progress', icon: TrendingUp, description: 'Progress indicators and tracking' },
  { value: 'learning', label: 'Learning Paths', icon: BookOpen, description: 'Personalized learning roadmaps' },
  { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Personal exploration dashboard' },
] as const

function AboutHubContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('bio')
  const { announce } = useScreenReaderAnnouncement()

  // Sync tab with URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && TAB_OPTIONS.some((t) => t.value === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Focus management for tab changes
  useFocusManagement(activeTab, `about-tabpanel-${activeTab}`)

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const tab = TAB_OPTIONS.find((t) => t.value === value)
    setActiveTab(value)
    router.push(`/about?tab=${value}`, { scroll: false })
    
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
        <PageContainer width="wide" padding="default">
          <div className="py-12">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <User className="h-8 w-8 text-primary" />
              <h1 className={cn(TYPOGRAPHY.h1, "bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent")}>
                About Hub
              </h1>
            </motion.div>
            <p className={cn(TYPOGRAPHY.lead, "text-muted-foreground max-w-2xl mx-auto")}>
              Learn about my journey, setup, workspace, activity, progress, learning paths, and personal dashboard.
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
              { label: 'Sections', value: '7', icon: User },
              { label: 'Years Experience', value: '3+', icon: Code },
              { label: 'Projects Built', value: '20+', icon: Rocket },
              { label: 'Always Learning', value: '∞', icon: BookOpen },
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
        </PageContainer>
      </motion.div>

      {/* Main Content */}
      <PageContainer width="wide" padding="default">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Tab Navigation */}
          <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b mb-6">
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList 
                className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 h-auto p-1 bg-muted/60 backdrop-blur-sm min-w-max"
                aria-label="About Hub navigation tabs"
              >
                {TAB_OPTIONS.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.value
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 px-2 sm:px-3 data-[state=active]:bg-background/95 data-[state=active]:backdrop-blur-sm data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border/50 min-w-[80px] sm:min-w-[90px] md:min-w-[100px] transition-all"
                      aria-label={`${tab.label} tab, ${tab.description}. ${isActive ? 'Currently active' : ''} Press Enter or Space to activate.`}
                      aria-selected={isActive}
                      aria-controls={`about-tabpanel-${tab.value}`}
                      id={`about-tab-${tab.value}`}
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
              {/* Bio Tab */}
              <TabsContent 
                value="bio" 
                className="mt-0"
                id="about-tabpanel-bio"
                role="tabpanel"
                aria-labelledby="about-tab-bio"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          About Me
                        </CardTitle>
                        <CardDescription>
                          My journey from Guinea to NYC to Norfolk, Virginia
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Story</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading about content...</span>
                      </div>
                    }>
                      <AboutPageContent />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Uses Tab */}
              <TabsContent 
                value="uses" 
                className="mt-0"
                id="about-tabpanel-uses"
                role="tabpanel"
                aria-labelledby="about-tab-uses"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Wrench className="h-5 w-5 text-primary" />
                          What I Use
                        </CardTitle>
                        <CardDescription>
                          Hardware, software, and development tools I use daily
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Setup</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading uses page...</span>
                      </div>
                    }>
                      <UsesPageContent />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Office Tour Tab */}
              <TabsContent 
                value="office" 
                className="mt-0"
                id="about-tabpanel-office"
                role="tabpanel"
                aria-labelledby="about-tab-office"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-primary" />
                          Virtual Office Tour
                        </CardTitle>
                        <CardDescription>
                          Interactive 360° tour of my workspace
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Interactive</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading office tour...</span>
                      </div>
                    }>
                      <VirtualOfficeTour />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Status Tab */}
              <TabsContent 
                value="activity" 
                className="mt-0"
                id="about-tabpanel-activity"
                role="tabpanel"
                aria-labelledby="about-tab-activity"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-primary" />
                          Activity Status
                        </CardTitle>
                        <CardDescription>
                          Current activity and availability status
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Live</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading activity status...</span>
                      </div>
                    }>
                      <ActivityStatusIndicator />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Progress Tab */}
              <TabsContent 
                value="progress" 
                className="mt-0"
                id="about-tabpanel-progress"
                role="tabpanel"
                aria-labelledby="about-tab-progress"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Progress Indicators
                        </CardTitle>
                        <CardDescription>
                          Visual progress tracking components
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">UI Components</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading progress indicators...</span>
                      </div>
                    }>
                      <ProgressIndicators />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Learning Paths Tab */}
              <TabsContent 
                value="learning" 
                className="mt-0"
                id="about-tabpanel-learning"
                role="tabpanel"
                aria-labelledby="about-tab-learning"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          Learning Paths
                        </CardTitle>
                        <CardDescription>
                          Generate personalized learning roadmaps
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Interactive</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading learning paths...</span>
                      </div>
                    }>
                      <LearningPathGenerator />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Dashboard Tab */}
              <TabsContent 
                value="dashboard" 
                className="mt-0"
                id="about-tabpanel-dashboard"
                role="tabpanel"
                aria-labelledby="about-tab-dashboard"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <LayoutDashboard className="h-5 w-5 text-primary" />
                          Personal Dashboard
                        </CardTitle>
                        <CardDescription>
                          Your personal exploration stats, bookmarks, and achievements
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Personal</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
                      </div>
                    }>
                      <PersonalDashboard />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </PageContainer>
    </div>
  )
}

export default function AboutHub() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading About Hub...</p>
        </div>
      </div>
    }>
      <AboutHubContent />
    </Suspense>
  )
}

