'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Copy, Download, RefreshCw, Code2, FileCode } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface CodeExample {
  id: string
  title: string
  description: string
  language: 'javascript' | 'typescript' | 'python' | 'html' | 'css'
  code: string
  output?: string
}

const codeExamples: CodeExample[] = [
  {
    id: 'react-component',
    title: 'React Component Example',
    description: 'A simple React component with TypeScript',
    language: 'typescript',
    code: `import { useState } from 'react'

interface ButtonProps {
  label: string
  onClick: () => void
}

export const CustomButton = ({ label, onClick }: ButtonProps) => {
  const [clicked, setClicked] = useState(false)
  
  return (
    <button
      onClick={() => {
        setClicked(true)
        onClick()
        setTimeout(() => setClicked(false), 1000)
      }}
      className={\`px-4 py-2 rounded \${clicked ? 'bg-green-500' : 'bg-blue-500'} text-white\`}
    >
      {label}
    </button>
  )
}`,
  },
  {
    id: 'async-function',
    title: 'Async/Await Pattern',
    description: 'Modern async function with error handling',
    language: 'javascript',
    code: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`)
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

// Usage
fetchUserData(123)
  .then(user => console.log('User:', user))
  .catch(error => console.error('Failed:', error))`,
  },
  {
    id: 'array-methods',
    title: 'Array Methods',
    description: 'Common array manipulation patterns',
    language: 'javascript',
    code: `const numbers = [1, 2, 3, 4, 5]

// Map: Transform each element
const doubled = numbers.map(n => n * 2)
// [2, 4, 6, 8, 10]

// Filter: Keep elements that match condition
const evens = numbers.filter(n => n % 2 === 0)
// [2, 4]

// Reduce: Accumulate values
const sum = numbers.reduce((acc, n) => acc + n, 0)
// 15

// Find: Get first matching element
const found = numbers.find(n => n > 3)
// 4

// Some: Check if any element matches
const hasEven = numbers.some(n => n % 2 === 0)
// true

// Every: Check if all elements match
const allPositive = numbers.every(n => n > 0)
// true`,
  },
  {
    id: 'nextjs-api',
    title: 'Next.js API Route',
    description: 'Server-side API route handler',
    language: 'typescript',
    code: `import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || 'World'
  
  return NextResponse.json({
    message: \`Hello, \${name}!\`,
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Process the data
    const result = {
      received: body,
      processed: true,
    }
    
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    )
  }
}`,
  },
]

export default function CodePlayground() {
  const [selectedExample, setSelectedExample] = useState<CodeExample>(codeExamples[0])
  const [code, setCode] = useState(selectedExample.code)
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCode(selectedExample.code)
    setOutput('')
  }, [selectedExample])

  const handleRun = async () => {
    setIsRunning(true)
    setOutput('Running code...\n')

    // Simulate code execution
    // In a real implementation, you'd send this to a code execution service
    setTimeout(() => {
      if (selectedExample.language === 'javascript' || selectedExample.language === 'typescript') {
        setOutput('✅ Code executed successfully!\n\nNote: This is a demo. In production, code would be executed in a sandboxed environment.')
      } else {
        setOutput('✅ Code executed successfully!')
      }
      setIsRunning(false)
    }, 1000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedExample.id}.${selectedExample.language === 'typescript' ? 'ts' : selectedExample.language === 'javascript' ? 'js' : selectedExample.language}`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setCode(selectedExample.code)
    setOutput('')
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
              <h1 className="text-4xl font-bold tracking-tight">Code Playground</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Interactive code examples and snippets. Run, copy, and experiment with code in your browser.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Examples Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
                <CardDescription>Select an example to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {codeExamples.map((example) => (
                    <button
                      key={example.id}
                      onClick={() => setSelectedExample(example)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedExample.id === example.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      <div className="font-semibold text-sm">{example.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {example.description}
                      </div>
                      <div className="text-xs text-primary mt-1 capitalize">
                        {example.language}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedExample.title}</CardTitle>
                    <CardDescription>{selectedExample.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      disabled={copied}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button
                      onClick={handleRun}
                      disabled={isRunning}
                      size="sm"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isRunning ? 'Running...' : 'Run'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="code" className="w-full">
                  <TabsList>
                    <TabsTrigger value="code">
                      <FileCode className="w-4 h-4 mr-2" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="output">
                      <Code2 className="w-4 h-4 mr-2" />
                      Output
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="code" className="mt-4">
                    <label htmlFor="code-editor" className="sr-only">
                      Code Editor
                    </label>
                    <textarea
                      id="code-editor"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-96 font-mono text-sm bg-muted p-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      spellCheck={false}
                      aria-label="Code editor"
                      placeholder="Enter your code here..."
                    />
                  </TabsContent>
                  <TabsContent value="output" className="mt-4">
                    <div className="w-full h-96 font-mono text-sm bg-muted p-4 rounded-lg border border-border overflow-auto whitespace-pre-wrap">
                      {output || 'No output yet. Click "Run" to execute the code.'}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

