'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
} from 'lucide-react'
import { showSuccessToast, showErrorToast } from '@/lib/toast-helpers'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CodePlayground from '@/components/code-playground/code-playground'
import CodeReviewSimulator from '@/components/code-review/code-review-simulator'
import PortfolioCodeViewer from '@/components/portfolio-code-viewer/portfolio-code-viewer'
import LiveCodingTerminal from '@/components/terminal/live-coding-terminal'
import CodeSnippetLibrary from '@/components/code/code-snippet-library'

const TAB_OPTIONS = [
  { value: 'playground', label: 'Playground', icon: Play, description: 'Interactive code editor' },
  { value: 'review', label: 'Review', icon: Code2, description: 'Code review simulator' },
  { value: 'portfolio', label: 'Portfolio Code', icon: FileCode, description: 'View portfolio source' },
  { value: 'terminal', label: 'Terminal', icon: Terminal, description: 'Live coding terminal' },
  { value: 'library', label: 'Library', icon: BookOpen, description: 'Code snippets library' },
] as const

export default function CodeHub() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('playground')
  const [searchQuery, setSearchQuery] = useState('')

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
    router.push(`/code?tab=${value}`, { scroll: false })
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
              <Code2 className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Code Hub
              </h1>
            </motion.div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore, learn, and interact with real production code. From interactive playgrounds to code reviews and portfolio source code.
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
              { label: 'Code Examples', value: '50+', icon: FileCode },
              { label: 'Languages', value: '10+', icon: Code2 },
              { label: 'Projects', value: '20+', icon: GitBranch },
              { label: 'Snippets', value: '100+', icon: Sparkles },
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
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 bg-muted/50">
              {TAB_OPTIONS.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex flex-col md:flex-row items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs md:text-sm font-medium">{tab.label}</span>
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
              <TabsContent value="playground" className="mt-0">
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
                    <CodePlayground />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="review" className="mt-0">
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

              <TabsContent value="portfolio" className="mt-0">
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
                    <PortfolioCodeViewer />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="terminal" className="mt-0">
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
                    <LiveCodingTerminal />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="library" className="mt-0">
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
      </div>
    </div>
  )
}

