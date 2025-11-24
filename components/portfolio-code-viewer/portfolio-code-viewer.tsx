'use client'

import { useState } from 'react'
import type React from 'react'
import { motion } from 'framer-motion'
import { Code2, FileCode, Folder, ChevronRight, ChevronDown, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface CodeFile {
  path: string
  name: string
  content: string
  language: string
  description?: string
}

interface CodeDirectory {
  name: string
  files: CodeFile[]
  subdirectories?: CodeDirectory[]
}

const portfolioCodeStructure: CodeDirectory[] = [
  {
    name: 'app',
    files: [
      {
        path: 'app/page.tsx',
        name: 'page.tsx',
        content: `import HeroLight from "@/components/hero-light"
import QuickStats from "@/components/quick-stats"
import TechSnapshot from "@/components/tech-snapshot"
import AboutLight from "@/components/about-light"
import ProjectsLight from "@/components/projects-light"
import ServicesPricing from "@/components/services-pricing"
import CoursesSection from "@/components/courses-section"
import Contact from "@/components/contact"
import FooterLight from "@/components/footer-light"
import Navigation from "@/components/navigation"
import { AIChatbotVoice } from "@/components/chatbot/chatbot-wrappers"
import ScrollProgress from "@/components/scroll-progress"
import Experience from "@/components/experience"
import StructuredData from "@/components/structured-data"
import FloatingActionMenu from "@/components/floating-action-menu"

export default function Home() {
  return (
    <>
      <StructuredData
        type="Person"
        title="Mohamed Datt - Full Stack Developer"
        description="Creative Full Stack Developer specializing in AI-powered web applications"
        url="/"
      />
      <div className="min-h-screen bg-background relative">
        <ScrollProgress />
        <Navigation />
        <main className="relative z-10">
          <HeroLight />
          <QuickStats />
          <TechSnapshot />
          <AboutLight />
          <ProjectsLight />
          <Experience />
          <ServicesPricing />
          <CoursesSection />
          <Contact />
        </main>
        <FooterLight />
        <AIChatbotVoice />
      </div>
    </>
  )
}`,
        language: 'tsx',
        description: 'Main home page component',
      },
    ],
    subdirectories: [
      {
        name: 'api',
        files: [
          {
            path: 'app/api/simple-chat/route.ts',
            name: 'route.ts',
            content: `import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createRateLimitMiddleware } from '@/lib/rate-limiting'
import { sanitizeText } from '@/lib/input-sanitization'
import { logServerAnalyticsEvent } from '@/lib/analytics-server'

const rateLimit = createRateLimitMiddleware('ai')

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimit(req)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { message, model = 'gemini', history = [] } = await req.json()
    
    // Sanitize input
    const sanitizedMessage = sanitizeText(message)
    
    if (!sanitizedMessage.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
    const aiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const prompt = \`You are a helpful AI assistant for Mohamed Datt's portfolio.
    Provide friendly, professional responses. Keep responses concise and relevant.
    
    User message: \${sanitizedMessage}\`

    const result = await aiModel.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Track analytics
    await logServerAnalyticsEvent({
      event_type: 'chat_usage',
      page_path: '/api/simple-chat',
      metadata: { model },
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}`,
            language: 'typescript',
            description: 'AI chat API endpoint with rate limiting and sanitization',
          },
        ],
      },
    ],
  },
  {
    name: 'components',
    files: [
      {
        path: 'components/hero-light.tsx',
        name: 'hero-light.tsx',
        content: `'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HeroLight() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Mohamed Datt
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Full Stack Developer
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="#contact">Get In Touch</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/projects">View Work</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}`,
        language: 'tsx',
        description: 'Hero section component',
      },
    ],
  },
  {
    name: 'lib',
    files: [
      {
        path: 'lib/rate-limiting.ts',
        name: 'rate-limiting.ts',
        content: `import { NextRequest, NextResponse } from 'next/server'

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  message?: string
}

export const RATE_LIMIT_PRESETS = {
  strict: { maxRequests: 10, windowMs: 60000 },
  standard: { maxRequests: 100, windowMs: 60000 },
  lenient: { maxRequests: 1000, windowMs: 60000 },
  ai: { maxRequests: 20, windowMs: 60000 },
} as const

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function createRateLimitMiddleware(
  preset: keyof typeof RATE_LIMIT_PRESETS = 'standard'
) {
  const config = RATE_LIMIT_PRESETS[preset]

  return async (req: NextRequest): Promise<NextResponse | null> => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const key = \`\${ip}:\${preset}\`

    const record = rateLimitStore.get(key)

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs })
      return null
    }

    if (record.count >= config.maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000)
      return NextResponse.json(
        { error: config.message || 'Rate limit exceeded' },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(record.resetTime).toISOString(),
          },
        }
      )
    }

    record.count++
    return null
  }
}`,
        language: 'typescript',
        description: 'Rate limiting utility for API routes',
      },
    ],
  },
]

export default function PortfolioCodeViewer() {
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null)
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['app', 'components', 'lib']))
  const [copied, setCopied] = useState(false)

  const toggleDirectory = (path: string) => {
    const newExpanded = new Set(expandedDirs)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedDirs(newExpanded)
  }

  const handleCopy = () => {
    if (selectedFile) {
      navigator.clipboard.writeText(selectedFile.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const renderDirectory = (dir: CodeDirectory, path: string = ''): React.ReactNode[] => {
    const fullPath = path ? `${path}/${dir.name}` : dir.name
    const isExpanded = expandedDirs.has(fullPath)
    const elements: React.ReactNode[] = []

    elements.push(
      <div key={fullPath} className="select-none">
        <button
          onClick={() => toggleDirectory(fullPath)}
          className="flex items-center gap-2 w-full px-2 py-1 hover:bg-muted rounded text-left"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <Folder className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">{dir.name}</span>
        </button>
        {isExpanded && (
          <div className="ml-6 space-y-1">
            {dir.files.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`flex items-center gap-2 w-full px-2 py-1 hover:bg-muted rounded text-left ${
                  selectedFile?.path === file.path ? 'bg-muted' : ''
                }`}
              >
                <FileCode className="w-4 h-4 text-green-500" />
                <span className="text-sm">{file.name}</span>
              </button>
            ))}
            {dir.subdirectories?.map((subdir) => {
              const subElements = renderDirectory(subdir, fullPath)
              elements.push(...subElements)
              return null
            })}
          </div>
        )}
      </div>
    )

    return elements
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-3">
              <Code2 className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Portfolio Code Viewer</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the actual code behind this portfolio. Real production code from the repository.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* File Tree */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>File Structure</CardTitle>
                <CardDescription>Browse portfolio code files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-[600px] overflow-y-auto">
                  {portfolioCodeStructure.map((dir) => renderDirectory(dir))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code Viewer */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileCode className="w-5 h-5" />
                      {selectedFile?.name || 'Select a file'}
                    </CardTitle>
                    {selectedFile?.description && (
                      <CardDescription>{selectedFile.description}</CardDescription>
                    )}
                  </div>
                  {selectedFile && (
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedFile ? (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <SyntaxHighlighter
                      language={selectedFile.language}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                      showLineNumbers
                    >
                      {selectedFile.content}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-96 text-muted-foreground">
                    <div className="text-center">
                      <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Select a file from the file tree to view its code</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

