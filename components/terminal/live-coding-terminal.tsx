'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Copy,
  Download,
  RefreshCw,
  Terminal,
  Code,
  FileCode,
  FileText,
} from 'lucide-react'
import { showSuccessToast, showErrorToast } from '@/lib/toast-helpers'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeSnippet {
  id: string
  title: string
  description: string
  language: string
  code: string
  file: string
  project?: string
}

const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'api-route',
    title: 'API Route Handler',
    description: 'Next.js API route with error handling and rate limiting',
    language: 'typescript',
    file: 'app/api/project-analyzer/route.ts',
    project: 'Portfolio',
    code: `import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/ai-providers'
import { createRateLimitMiddleware } from '@/lib/rate-limiting'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = createRateLimitMiddleware('ai', { windowMs: 60000, max: 10 })
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) return rateLimitResult

    const { repoUrl } = await request.json()
    
    // Validate input
    if (!repoUrl || typeof repoUrl !== 'string') {
      return NextResponse.json(
        { error: 'Invalid repository URL' },
        { status: 400 }
      )
    }

    // Fetch repository data
    const repoData = await fetchRepositoryData(repoUrl)
    
    // Generate AI analysis
    const analysis = await callAI({
      messages: [{ role: 'user', content: \`Analyze: \${repoData}\` }],
    })

    return NextResponse.json({ analysis })
  } catch (error) {
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}`,
  },
  {
    id: 'react-component',
    title: 'React Component',
    description: 'Reusable React component with TypeScript',
    language: 'typescript',
    file: 'components/ui/button.tsx',
    project: 'Portfolio',
    code: `'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }`,
  },
  {
    id: 'utility-function',
    title: 'Utility Function',
    description: 'Type-safe utility function with error handling',
    language: 'typescript',
    file: 'lib/utils.ts',
    project: 'Portfolio',
    code: `import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return \`\${minutes} minute\${minutes > 1 ? 's' : ''} ago\`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return \`\${hours} hour\${hours > 1 ? 's' : ''} ago\`
  }
  const days = Math.floor(diffInSeconds / 86400)
  return \`\${days} day\${days > 1 ? 's' : ''} ago\`
}

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}`,
  },
]

export default function LiveCodingTerminal() {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(CODE_SNIPPETS[0])
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll terminal to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  const handleRun = async () => {
    setIsRunning(true)
    setOutput('')

    // Simulate code execution
    const lines = [
      '> Running code...',
      '> Checking syntax...',
      '> ✓ Syntax valid',
      '> Executing...',
      '> ✓ Code executed successfully',
      '',
      'Output:',
      'Hello from the portfolio!',
      'This is a live code preview.',
    ]

    for (let i = 0; i < lines.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setOutput((prev) => prev + lines[i] + '\n')
    }

    setIsRunning(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedSnippet.code)
    showSuccessToast('Code copied to clipboard!')
  }

  const handleDownload = () => {
    const blob = new Blob([selectedSnippet.code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = selectedSnippet.file
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showSuccessToast('Code downloaded!')
  }

  const handleClear = () => {
    setOutput('')
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Live Coding Terminal</h1>
        <p className="text-muted-foreground">
          Explore real code snippets from the portfolio with live preview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code Editor */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Code Editor</CardTitle>
                <CardDescription>Select a code snippet to view</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedSnippet.id} onValueChange={(id) => {
              const snippet = CODE_SNIPPETS.find((s) => s.id === id)
              if (snippet) setSelectedSnippet(snippet)
            }}>
              <TabsList className="grid w-full grid-cols-3">
                {CODE_SNIPPETS.map((snippet) => (
                  <TabsTrigger key={snippet.id} value={snippet.id}>
                    {snippet.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {CODE_SNIPPETS.map((snippet) => (
                <TabsContent key={snippet.id} value={snippet.id} className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{snippet.file}</span>
                      {snippet.project && (
                        <Badge variant="secondary">{snippet.project}</Badge>
                      )}
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <SyntaxHighlighter
                        language={snippet.language}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: '1rem',
                          fontSize: '0.875rem',
                          lineHeight: '1.5',
                        }}
                      >
                        {snippet.code}
                      </SyntaxHighlighter>
                    </div>
                    <p className="text-sm text-muted-foreground">{snippet.description}</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Terminal Output */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Terminal</CardTitle>
                <CardDescription>Live code execution output</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleRun}
                  disabled={isRunning}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isRunning ? 'Running...' : 'Run'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleClear}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              ref={terminalRef}
              className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg h-[500px] overflow-y-auto"
            >
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="h-4 w-4" />
                <span>portfolio-terminal</span>
                <Badge variant="secondary" className="ml-auto">
                  {selectedSnippet.language}
                </Badge>
              </div>
              <div className="whitespace-pre-wrap">
                {output || (
                  <span className="text-muted-foreground">
                    Click "Run" to execute the code...
                  </span>
                )}
              </div>
              {isRunning && (
                <span className="inline-block animate-pulse">▋</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

