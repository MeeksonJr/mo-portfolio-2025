'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
} from 'lucide-react'
import ProjectAnalyzer from '@/components/project-analyzer/project-analyzer'
import SkillsMatchingTool from '@/components/skills-match/skills-matching-tool'
import ROICalculator from '@/components/roi/roi-calculator'
import QuickAssessmentDashboard from '@/components/assessment/quick-assessment-dashboard'
import UniversalContactHub from '@/components/contact-hub/universal-contact-hub'
import VirtualBusinessCard from '@/components/business-card/virtual-business-card'

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
    router.push(`/tools?tab=${value}`, { scroll: false })
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
              <Wrench className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Tools Hub
              </h1>
            </motion.div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Interactive tools and utilities to analyze projects, match skills, calculate ROI, and connect with me.
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
              { label: 'Tools', value: '6', icon: Wrench },
              { label: 'AI-Powered', value: '2', icon: Sparkles },
              { label: 'For Recruiters', value: '4', icon: Users },
              { label: 'Free to Use', value: '100%', icon: CheckCircle2 },
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
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto p-1 bg-muted/50 overflow-x-auto">
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
                    <ProjectAnalyzer />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Skills Match Tab */}
              <TabsContent value="skills" className="mt-0">
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
                    <SkillsMatchingTool />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ROI Calculator Tab */}
              <TabsContent value="roi" className="mt-0">
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
                    <ROICalculator />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Assessment Tab */}
              <TabsContent value="assessment" className="mt-0">
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
                    <QuickAssessmentDashboard />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Hub Tab */}
              <TabsContent value="contact" className="mt-0">
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
                    <UniversalContactHub />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Business Card Tab */}
              <TabsContent value="card" className="mt-0">
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
                    <VirtualBusinessCard />
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

