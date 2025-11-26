'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Code2, Search, Copy, Check, Tag, Filter,
  FileCode, Terminal, Database, Globe, Zap,
  ChevronRight, Download, ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface CodeSnippet {
  id: string
  title: string
  description: string
  code: string
  language: string
  category: string
  tags: string[]
  usage?: string
  project?: string
  projectUrl?: string
}

const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: '1',
    title: 'React Custom Hook - useDebounce',
    description: 'A reusable debounce hook for optimizing API calls and search inputs',
    code: `import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Usage
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)

  useEffect(() => {
    // API call with debounced value
    fetchResults(debouncedSearch)
  }, [debouncedSearch])

  return <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
}`,
    language: 'typescript',
    category: 'React',
    tags: ['react', 'hooks', 'performance', 'optimization'],
    usage: 'Use this hook to debounce user input, API calls, or any value that changes frequently.',
  },
  {
    id: '2',
    title: 'Next.js API Route with Error Handling',
    description: 'A robust API route pattern with proper error handling and validation',
    code: `import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const requestSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request
    const validatedData = requestSchema.parse(body)
    
    // Process request
    const result = await processRequest(validatedData)
    
    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}`,
    language: 'typescript',
    category: 'Next.js',
    tags: ['nextjs', 'api', 'validation', 'error-handling'],
    usage: 'Use this pattern for all API routes to ensure proper validation and error handling.',
  },
  {
    id: '3',
    title: 'Supabase RLS Policy Example',
    description: 'Row Level Security policy for user-specific data access',
    code: `-- Enable RLS on table
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own projects
CREATE POLICY "Users can view own projects"
  ON user_projects
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own projects
CREATE POLICY "Users can insert own projects"
  ON user_projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON user_projects
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON user_projects
  FOR DELETE
  USING (auth.uid() = user_id);`,
    language: 'sql',
    category: 'Database',
    tags: ['supabase', 'postgresql', 'security', 'rls'],
    usage: 'Apply these policies to ensure users can only access their own data.',
  },
  {
    id: '4',
    title: 'TypeScript Utility Types',
    description: 'Common TypeScript utility types for better type safety',
    code: `// Pick - Select specific properties
type UserPreview = Pick<User, 'id' | 'name' | 'email'>

// Omit - Exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>

// Partial - Make all properties optional
type PartialUser = Partial<User>

// Required - Make all properties required
type RequiredUser = Required<PartialUser>

// Readonly - Make all properties readonly
type ReadonlyUser = Readonly<User>

// Record - Create object type with specific keys
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>

// Extract - Extract types from union
type StringTypes = Extract<string | number | boolean, string>

// Exclude - Exclude types from union
type NonStringTypes = Exclude<string | number | boolean, string>

// NonNullable - Remove null and undefined
type NonNullString = NonNullable<string | null | undefined>`,
    language: 'typescript',
    category: 'TypeScript',
    tags: ['typescript', 'types', 'utilities'],
    usage: 'Use these utility types to create more precise and reusable types.',
  },
  {
    id: '5',
    title: 'Framer Motion Page Transition',
    description: 'Smooth page transitions using Framer Motion',
    code: `'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}`,
    language: 'typescript',
    category: 'Animation',
    tags: ['framer-motion', 'animation', 'transitions'],
    usage: 'Wrap your page content with this component for smooth transitions.',
  },
  {
    id: '6',
    title: 'Tailwind CSS Dark Mode Toggle',
    description: 'Dark mode implementation with system preference detection',
    code: `'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}`,
    language: 'typescript',
    category: 'UI/UX',
    tags: ['tailwindcss', 'dark-mode', 'next-themes'],
    usage: 'Add this component to your navigation for theme switching.',
  },
]

const CATEGORIES = ['All', 'React', 'Next.js', 'TypeScript', 'Database', 'Animation', 'UI/UX']
const LANGUAGES = ['All', 'typescript', 'javascript', 'sql', 'css', 'html']

export default function CodeSnippetLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredSnippets = useMemo(() => {
    return CODE_SNIPPETS.filter(snippet => {
      const matchesSearch = 
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'All' || snippet.category === selectedCategory
      const matchesLanguage = selectedLanguage === 'All' || snippet.language === selectedLanguage

      return matchesSearch && matchesCategory && matchesLanguage
    })
  }, [searchQuery, selectedCategory, selectedLanguage])

  const handleCopy = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedId(id)
      toast.success('Code copied to clipboard!')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  const handleDownload = (snippet: CodeSnippet) => {
    const blob = new Blob([snippet.code], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${snippet.title.replace(/\s/g, '-')}.${snippet.language === 'typescript' ? 'ts' : snippet.language === 'javascript' ? 'js' : snippet.language}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    toast.success('File downloaded!')
  }

  return (
    <div className="w-full">
        <div className="w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Code2 className="h-10 w-10 text-primary" />
              Code Snippets Library
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse and learn from real production code snippets. Copy, download, or explore.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search snippets by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Category:</span>
                <div className="flex gap-2">
                  {CATEGORIES.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Language:</span>
                <div className="flex gap-2">
                  {LANGUAGES.map((lang) => (
                    <Button
                      key={lang}
                      variant={selectedLanguage === lang ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedLanguage(lang)}
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Snippets List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  Snippets ({filteredSnippets.length})
                </h2>
              </div>
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredSnippets.length > 0 ? (
                  filteredSnippets.map((snippet, idx) => (
                    <motion.div
                      key={snippet.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all hover:border-primary ${
                          selectedSnippet?.id === snippet.id ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedSnippet(snippet)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base">{snippet.title}</CardTitle>
                            <Badge variant="secondary" className="text-xs">
                              {snippet.language}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs line-clamp-2">
                            {snippet.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex flex-wrap gap-1">
                            {snippet.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {snippet.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{snippet.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No snippets found matching your criteria</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>

            {/* Code Viewer */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              {selectedSnippet ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 mb-2">
                          <FileCode className="h-5 w-5" />
                          {selectedSnippet.title}
                        </CardTitle>
                        <CardDescription>{selectedSnippet.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(selectedSnippet.code, selectedSnippet.id)}
                        >
                          {copiedId === selectedSnippet.id ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(selectedSnippet)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge>{selectedSnippet.category}</Badge>
                      <Badge variant="secondary">{selectedSnippet.language}</Badge>
                      {selectedSnippet.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedSnippet.usage && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Usage
                        </p>
                        <p className="text-sm text-muted-foreground">{selectedSnippet.usage}</p>
                      </div>
                    )}
                    <div className="relative">
                      <div className="absolute top-2 right-2 z-10">
                        <Badge variant="secondary" className="text-xs">
                          {selectedSnippet.language}
                        </Badge>
                      </div>
                      <SyntaxHighlighter
                        language={selectedSnippet.language}
                        style={vscDarkPlus}
                        customStyle={{
                          borderRadius: '0.5rem',
                          padding: '1.5rem',
                          fontSize: '0.875rem',
                          margin: 0,
                        }}
                        showLineNumbers
                      >
                        {selectedSnippet.code}
                      </SyntaxHighlighter>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Code2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">
                      Select a code snippet to view it here
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
    </div>
  )
}

