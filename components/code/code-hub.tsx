'use client'

import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCardsGrid } from '@/components/ui/stat-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Code2,
  Play,
  Copy,
  Download,
  RefreshCw,
  Terminal,
  FileCode,
  FileText,
  Search,
  Sparkles,
  Check,
  Zap,
  BookOpen,
  GitBranch,
  Loader2,
} from 'lucide-react'
import { showSuccessToast, showErrorToast } from '@/lib/toast-helpers'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useScreenReaderAnnouncement } from '@/components/accessibility/live-region'
import { useFocusManagement } from '@/hooks/use-focus-management'
import PageContainer from '@/components/layout/page-container'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

// Lazy load tab components for better performance
const CodePlayground = lazy(() => import('@/components/code-playground/code-playground'))
const CodeReviewSimulator = lazy(() => import('@/components/code-review/code-review-simulator'))
const PortfolioCodeViewer = lazy(() => import('@/components/portfolio-code-viewer/portfolio-code-viewer'))
const LiveCodingTerminal = lazy(() => import('@/components/terminal/live-coding-terminal'))
const CodeSnippetLibrary = lazy(() => import('@/components/code/code-snippet-library'))

const TAB_OPTIONS = [
  { value: 'playground', label: 'Playground', icon: Play, description: 'Interactive code editor' },
  { value: 'review', label: 'Review', icon: Code2, description: 'Code review simulator' },
  { value: 'portfolio', label: 'Portfolio Code', icon: FileCode, description: 'View portfolio source' },
  { value: 'terminal', label: 'Terminal', icon: Terminal, description: 'Live coding terminal' },
  { value: 'library', label: 'Library', icon: BookOpen, description: 'Code snippets library' },
] as const

function CodeHubContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('playground')
  const [searchQuery, setSearchQuery] = useState('')
  const { announce } = useScreenReaderAnnouncement()

  // Sync tab with URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && TAB_OPTIONS.some((t) => t.value === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Focus management for tab changes
  useFocusManagement(activeTab, `code-tabpanel-${activeTab}`)

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const tab = TAB_OPTIONS.find((t) => t.value === value)
    setActiveTab(value)
    router.push(`/code?tab=${value}`, { scroll: false })
    
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
              <Code2 className="h-8 w-8 text-primary" />
              <h1 className={cn(TYPOGRAPHY.h1, "bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent")}>
                Code Hub
              </h1>
            </motion.div>
            <p className={cn(TYPOGRAPHY.lead, "text-muted-foreground max-w-2xl mx-auto")}>
              Explore, learn, and interact with real production code. From interactive playgrounds to code reviews and portfolio source code.
            </p>
          </div>

          {/* Quick Stats */}
          <StatCardsGrid
            stats={[
              { label: 'Code Examples', value: '50+', icon: FileCode },
              { label: 'Languages', value: '10+', icon: Code2 },
              { label: 'Projects', value: '20+', icon: GitBranch },
              { label: 'Snippets', value: '100+', icon: Sparkles },
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
          <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b mb-6 shadow-sm">
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList 
                className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto p-1 bg-muted/60 backdrop-blur-sm min-w-max"
                aria-label="Code Hub navigation tabs"
              >
                {TAB_OPTIONS.map((tab, index) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.value
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background/95 data-[state=active]:backdrop-blur-sm data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border/50 min-w-[80px] sm:min-w-[100px] transition-all"
                      aria-label={`${tab.label} tab, ${tab.description}. ${isActive ? 'Currently active' : ''} Press Enter or Space to activate.`}
                      aria-selected={isActive}
                      aria-controls={`code-tabpanel-${tab.value}`}
                      id={`code-tab-${tab.value}`}
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
              <TabsContent 
                value="playground" 
                className="mt-0"
                id="code-tabpanel-playground"
                role="tabpanel"
                aria-labelledby="code-tab-playground"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Play className="h-5 w-5 text-primary" />
                          Interactive Code Playground
                        </CardTitle>
                        <CardDescription>
                          Write, run, and experiment with code in real-time
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Zap className="h-3 w-3" />
                        Live
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading playground...</span>
                      </div>
                    }>
                      <CodePlayground />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent 
                value="review" 
                className="mt-0"
                id="code-tabpanel-review"
                role="tabpanel"
                aria-labelledby="code-tab-review"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Code2 className="h-5 w-5 text-primary" />
                          Code Review Simulator
                        </CardTitle>
                        <CardDescription>
                          Practice code reviews with interactive commenting and feedback
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Educational</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CodeReviewSimulator />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent 
                value="portfolio" 
                className="mt-0"
                id="code-tabpanel-portfolio"
                role="tabpanel"
                aria-labelledby="code-tab-portfolio"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileCode className="h-5 w-5 text-primary" />
                          Portfolio Source Code
                        </CardTitle>
                        <CardDescription>
                          Browse the actual source code of this portfolio
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Open Source</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading portfolio code viewer...</span>
                      </div>
                    }>
                      <PortfolioCodeViewer />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent 
                value="terminal" 
                className="mt-0"
                id="code-tabpanel-terminal"
                role="tabpanel"
                aria-labelledby="code-tab-terminal"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Terminal className="h-5 w-5 text-primary" />
                          Live Coding Terminal
                        </CardTitle>
                        <CardDescription>
                          Execute code snippets from the portfolio with terminal output
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Zap className="h-3 w-3" />
                        Interactive
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading terminal...</span>
                      </div>
                    }>
                      <LiveCodingTerminal />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent 
                value="library" 
                className="mt-0"
                id="code-tabpanel-library"
                role="tabpanel"
                aria-labelledby="code-tab-library"
                tabIndex={0}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          Code Snippets Library
                        </CardTitle>
                        <CardDescription>
                          Searchable collection of production code examples
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{searchQuery ? 'Filtered' : 'All'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Search Bar */}
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search code snippets..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <CodeSnippetLibrary />
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

export default function CodeHub() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Code Hub...</p>
        </div>
      </div>
    }>
      <CodeHubContent />
    </Suspense>
  )
}

