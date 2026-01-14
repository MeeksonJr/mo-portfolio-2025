'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Download,
  Sparkles,
  User,
  Briefcase,
  FileCheck,
  Share2,
  Eye,
  Zap,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { showSuccessToast, showErrorToast } from '@/lib/toast-helpers'
import ResumeViewer from '@/components/resume/resume-viewer'
import ResumeGenerator from '@/components/resume/resume-generator'
import CandidateSummaryContent from '@/components/candidate-summary/candidate-summary-content'
import { useScreenReaderAnnouncement } from '@/components/accessibility/live-region'
import { useFocusManagement } from '@/hooks/use-focus-management'
import { resumeData } from '@/lib/resume-data'

const TAB_OPTIONS = [
  { value: 'view', label: 'My Resume', icon: Eye, description: 'View and download resume' },
  { value: 'generate', label: 'Generate', icon: Sparkles, description: 'Create your own resume' },
  { value: 'summary', label: 'Quick Summary', icon: FileCheck, description: 'Recruiter quick reference' },
] as const

type ResumeFormat = 'ats' | 'creative' | 'traditional'

export default function ResumeHub() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Resume Hub...</p>
        </div>
      </div>
    }>
      <ResumeHubContent />
    </Suspense>
  )
}

function ResumeHubContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('view')
  const [selectedFormat, setSelectedFormat] = useState<ResumeFormat>('ats')
  const [isDownloading, setIsDownloading] = useState(false)
  const { announce } = useScreenReaderAnnouncement()

  // Sync tab with URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && TAB_OPTIONS.some((t) => t.value === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Focus management for tab changes
  useFocusManagement(activeTab, `resume-tabpanel-${activeTab}`)

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const tab = TAB_OPTIONS.find((t) => t.value === value)
    setActiveTab(value)
    router.push(`/resume?tab=${value}`, { scroll: false })
    
    // Announce tab change to screen readers
    if (tab) {
      announce(`Switched to ${tab.label} tab: ${tab.description}`, 'polite')
    }
  }

  const handleDownloadPDF = async (format: ResumeFormat = selectedFormat) => {
    setIsDownloading(true)
    try {
      const response = await fetch('/api/resume/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: resumeData, format }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Mohamed-Datt-Resume-${format}-${new Date().getFullYear()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      showSuccessToast('Resume downloaded successfully!')
    } catch (error) {
      console.error('Error downloading resume:', error)
      showErrorToast('Failed to download resume. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/resume?tab=view`
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mohamed Datt - Resume',
          text: 'Check out my resume',
          url,
        })
        showSuccessToast('Resume shared!')
      } catch (error) {
        // User cancelled or error occurred
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error)
        }
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url)
      showSuccessToast('Resume link copied to clipboard!')
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
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Resume Hub
              </h1>
            </motion.div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              View, generate, and share professional resumes. Multiple formats available for different use cases.
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
              { label: 'Formats', value: '3', icon: FileText },
              { label: 'Experience', value: '3+', icon: Briefcase },
              { label: 'Projects', value: '20+', icon: Zap },
              { label: 'Skills', value: '30+', icon: CheckCircle2 },
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
                className="grid w-full grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 h-auto p-1 bg-muted/60 backdrop-blur-sm min-w-max"
                aria-label="Resume Hub navigation tabs"
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
                      aria-controls={`resume-tabpanel-${tab.value}`}
                      id={`resume-tab-${tab.value}`}
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
              {/* My Resume Tab */}
              <TabsContent 
                value="view" 
                className="mt-0"
                id="resume-tabpanel-view"
                role="tabpanel"
                aria-labelledby="resume-tab-view"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5 text-primary" />
                          My Resume
                        </CardTitle>
                        <CardDescription>
                          View and download resume in multiple formats
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <div className="flex gap-1">
                          {(['ats', 'creative', 'traditional'] as ResumeFormat[]).map((format) => (
                            <Button
                              key={format}
                              variant={selectedFormat === format ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSelectedFormat(format)}
                              className="capitalize"
                            >
                              {format}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShare}
                          className="gap-2"
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleDownloadPDF(selectedFormat)}
                          disabled={isDownloading}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          {isDownloading ? 'Downloading...' : 'Download PDF'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Format Info */}
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="font-semibold">Format: {selectedFormat.toUpperCase()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedFormat === 'ats' && 'Optimized for Applicant Tracking Systems'}
                          {selectedFormat === 'creative' && 'Modern, visually appealing design'}
                          {selectedFormat === 'traditional' && 'Classic professional format'}
                        </p>
                      </div>

                      {/* Resume Viewer */}
                      <div className="border rounded-lg overflow-hidden">
                        <Suspense fallback={
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">Loading resume viewer...</span>
                          </div>
                        }>
                          <ResumeViewer data={resumeData} format={selectedFormat} />
                        </Suspense>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Generate Resume Tab */}
              <TabsContent value="generate" className="mt-0">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          Resume Generator
                        </CardTitle>
                        <CardDescription>
                          Create your professional resume using our step-by-step wizard
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">6 Steps</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading resume generator...</span>
                      </div>
                    }>
                      <ResumeGenerator />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quick Summary Tab */}
              <TabsContent 
                value="summary" 
                className="mt-0"
                id="resume-tabpanel-summary"
                role="tabpanel"
                aria-labelledby="resume-tab-summary"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileCheck className="h-5 w-5 text-primary" />
                          Quick Candidate Summary
                        </CardTitle>
                        <CardDescription>
                          One-page summary optimized for recruiters and hiring managers
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">For Recruiters</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading candidate summary...</span>
                      </div>
                    }>
                      <CandidateSummaryContent />
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

