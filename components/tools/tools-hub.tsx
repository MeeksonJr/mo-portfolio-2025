'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCardsGrid } from '@/components/ui/stat-card'
import { Badge } from '@/components/ui/badge'
import {
  Wrench,
  Sparkles,
  Target,
  Calculator,
  FileCheck,
  MessageCircle,
  CreditCard,
  Zap,
  TrendingUp,
  Users,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { useScreenReaderAnnouncement } from '@/components/accessibility/live-region'
import { useFocusManagement } from '@/hooks/use-focus-management'
import PageContainer from '@/components/layout/page-container'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

// Lazy load tab components for better performance
const ProjectAnalyzer = lazy(() => import('@/components/project-analyzer/project-analyzer'))
const SkillsMatchingTool = lazy(() => import('@/components/skills-match/skills-matching-tool'))
const ROICalculator = lazy(() => import('@/components/roi/roi-calculator'))
const QuickAssessmentDashboard = lazy(() => import('@/components/assessment/quick-assessment-dashboard'))
const UniversalContactHub = lazy(() => import('@/components/contact-hub/universal-contact-hub'))
const VirtualBusinessCard = lazy(() => import('@/components/business-card/virtual-business-card'))

const TAB_OPTIONS = [
  { value: 'analyzer', label: 'Project Analyzer', icon: Sparkles, description: 'AI-powered GitHub repository analysis' },
  { value: 'skills', label: 'Skills Match', icon: Target, description: 'Match skills to job requirements' },
  { value: 'roi', label: 'ROI Calculator', icon: Calculator, description: 'Calculate business impact and ROI' },
  { value: 'assessment', label: 'Assessment', icon: FileCheck, description: 'Quick candidate assessment' },
  { value: 'contact', label: 'Contact Hub', icon: MessageCircle, description: 'Universal contact options' },
  { value: 'card', label: 'Business Card', icon: CreditCard, description: 'Digital business card with QR code' },
] as const

function ToolsHubContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('analyzer')
  const { announce } = useScreenReaderAnnouncement()

  // Sync tab with URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && TAB_OPTIONS.some((t) => t.value === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Focus management for tab changes
  useFocusManagement(activeTab, `tools-tabpanel-${activeTab}`)

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const tab = TAB_OPTIONS.find((t) => t.value === value)
    setActiveTab(value)
    router.push(`/tools?tab=${value}`, { scroll: false })
    
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
          <div className="py-8 sm:py-12">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <Wrench className="h-8 w-8 text-primary" />
              <h1 className={cn(TYPOGRAPHY.h1, "bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent")}>
                Tools Hub
              </h1>
            </motion.div>
            <p className={cn(TYPOGRAPHY.lead, "text-muted-foreground max-w-2xl mx-auto")}>
              Interactive tools and utilities to analyze projects, match skills, calculate ROI, and connect with me.
            </p>
          </div>

          {/* Quick Stats */}
          <StatCardsGrid
            stats={[
              { label: 'Tools', value: '6', icon: Wrench },
              { label: 'AI-Powered', value: '2', icon: Sparkles },
              { label: 'For Recruiters', value: '4', icon: Users },
              { label: 'Free to Use', value: '100%', icon: CheckCircle2 },
            ]}
            columns={4}
            delay={0.3}
          />
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
                className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 h-auto p-1 bg-muted/60 backdrop-blur-sm min-w-max"
                aria-label="Tools Hub navigation tabs"
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
                      aria-controls={`tools-tabpanel-${tab.value}`}
                      id={`tools-tab-${tab.value}`}
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
              {/* Project Analyzer Tab */}
              <TabsContent value="analyzer" className="mt-0">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          AI Project Analyzer
                        </CardTitle>
                        <CardDescription>
                          Analyze any GitHub repository with AI-powered insights
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">AI-Powered</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading project analyzer...</span>
                      </div>
                    }>
                      <ProjectAnalyzer />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Skills Match Tab */}
              <TabsContent 
                value="skills" 
                className="mt-0"
                id="tools-tabpanel-skills"
                role="tabpanel"
                aria-labelledby="tools-tab-skills"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          Skills Matching Tool
                        </CardTitle>
                        <CardDescription>
                          Input job requirements and see how my skills match
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">For Recruiters</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading skills matching tool...</span>
                      </div>
                    }>
                      <SkillsMatchingTool />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ROI Calculator Tab */}
              <TabsContent 
                value="roi" 
                className="mt-0"
                id="tools-tabpanel-roi"
                role="tabpanel"
                aria-labelledby="tools-tab-roi"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calculator className="h-5 w-5 text-primary" />
                          ROI & Impact Calculator
                        </CardTitle>
                        <CardDescription>
                          Calculate the potential business impact and ROI of hiring me
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">For Recruiters</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading ROI calculator...</span>
                      </div>
                    }>
                      <ROICalculator />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Assessment Tab */}
              <TabsContent 
                value="assessment" 
                className="mt-0"
                id="tools-tabpanel-assessment"
                role="tabpanel"
                aria-labelledby="tools-tab-assessment"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileCheck className="h-5 w-5 text-primary" />
                          Quick Assessment Dashboard
                        </CardTitle>
                        <CardDescription>
                          Quick assessment dashboard for recruiters
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">For Recruiters</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading assessment dashboard...</span>
                      </div>
                    }>
                      <QuickAssessmentDashboard />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Hub Tab */}
              <TabsContent 
                value="contact" 
                className="mt-0"
                id="tools-tabpanel-contact"
                role="tabpanel"
                aria-labelledby="tools-tab-contact"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <MessageCircle className="h-5 w-5 text-primary" />
                          Universal Contact Hub
                        </CardTitle>
                        <CardDescription>
                          Get in touch through any channel you prefer
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Contact</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading contact hub...</span>
                      </div>
                    }>
                      <UniversalContactHub />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Business Card Tab */}
              <TabsContent 
                value="card" 
                className="mt-0"
                id="tools-tabpanel-card"
                role="tabpanel"
                aria-labelledby="tools-tab-card"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-primary" />
                          Virtual Business Card
                        </CardTitle>
                        <CardDescription>
                          Digital business card with QR code for easy sharing
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Contact</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading business card...</span>
                      </div>
                    }>
                      <VirtualBusinessCard />
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

export default function ToolsHub() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Tools Hub...</p>
        </div>
      </div>
    }>
      <ToolsHubContent />
    </Suspense>
  )
}

