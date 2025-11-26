'use client'

import { useState, useEffect, Suspense } from 'react'
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
} from 'lucide-react'
import AboutPageContent from '@/components/about-page-content'
import UsesPageContent from '@/components/uses/uses-page-content'
import VirtualOfficeTour from '@/components/office/virtual-office-tour'
import ActivityStatusIndicator from '@/components/activity/activity-status-indicator'
import ProgressIndicators from '@/components/progress/progress-indicators'
import LearningPathGenerator from '@/components/learning/learning-path-generator'
import PersonalDashboard from '@/components/dashboard/personal-dashboard'

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
    router.push(`/about?tab=${value}`, { scroll: false })
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
              <User className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                About Hub
              </h1>
            </motion.div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Tab Navigation */}
          <div className="sticky top-20 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-6">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 h-auto p-1 bg-muted/50 overflow-x-auto">
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
              {/* Bio Tab */}
              <TabsContent value="bio" className="mt-0">
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
                    <AboutPageContent />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Uses Tab */}
              <TabsContent value="uses" className="mt-0">
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
                    <UsesPageContent />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Office Tour Tab */}
              <TabsContent value="office" className="mt-0">
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
                    <VirtualOfficeTour />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Status Tab */}
              <TabsContent value="activity" className="mt-0">
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
                    <ActivityStatusIndicator />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Progress Tab */}
              <TabsContent value="progress" className="mt-0">
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
                    <ProgressIndicators />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Learning Paths Tab */}
              <TabsContent value="learning" className="mt-0">
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
                    <LearningPathGenerator />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="mt-0">
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
                    <PersonalDashboard />
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

