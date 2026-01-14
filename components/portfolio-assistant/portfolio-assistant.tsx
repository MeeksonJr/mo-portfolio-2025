'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, Send, Bot, User, Sparkles, X, 
  Lightbulb, Code, Briefcase, GraduationCap, 
  FolderGit2, Zap, RefreshCw, Copy, Check
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTED_QUERIES = [
  {
    category: 'Projects',
    queries: [
      'Show me projects using React',
      'What AI projects have you built?',
      'Tell me about your SaaS applications',
    ],
    icon: FolderGit2,
  },
  {
    category: 'Experience',
    queries: [
      'What\'s your experience with AI?',
      'Tell me about your internship',
      'What technologies do you use?',
    ],
    icon: Briefcase,
  },
  {
    category: 'Education',
    queries: [
      'Tell me about your education',
      'What did you study?',
      'Where did you go to school?',
    ],
    icon: GraduationCap,
  },
  {
    category: 'Skills',
    queries: [
      'What are your frontend skills?',
      'Do you know Python?',
      'What AI tools do you use?',
    ],
    icon: Code,
  },
]

export default function PortfolioAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `👋 Hi! I'm Mohamed's AI Portfolio Assistant. I can help you learn about:

- **Projects**: Ask about specific technologies, features, or project details
- **Experience**: Learn about work history, internships, and achievements
- **Education**: Get information about degrees, courses, and learning journey
- **Skills**: Discover technical skills, tools, and expertise
- **Contact**: Find out how to get in touch

Try asking me something like "Show me projects using React" or "What's your experience with AI?"`,
        timestamp: new Date(),
      }])
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (query?: string) => {
    const messageText = query || input.trim()
    if (!messageText) return

    // Track achievement
    if (typeof window !== 'undefined' && (window as any).unlockAchievement) {
      ;(window as any).unlockAchievement('chat-ai')
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          model: 'gemini',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      // Check if response is JSON (error response) or streaming
      const contentType = response.headers.get('content-type') || ''
      
      if (contentType.includes('application/json')) {
        // Handle JSON error response
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || 'Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body available')
      }

      const decoder = new TextDecoder()
      let assistantContent = ''
      let buffer = ''
      let hasReceivedData = false

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            // Process any remaining buffer
            if (buffer.trim()) {
              assistantContent += buffer
              hasReceivedData = true
              setMessages(prev => {
                const updated = [...prev]
                const lastMsg = updated[updated.length - 1]
                if (lastMsg && lastMsg.role === 'assistant') {
                  lastMsg.content = assistantContent.trim()
                }
                return updated
              })
            }
            break
          }

          hasReceivedData = true
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          
          // Keep the last incomplete line in buffer
          buffer = lines.pop() || ''

          // Process complete lines
          for (const line of lines) {
            if (!line.trim()) continue
            
            // Handle different streaming formats
            // Try to parse as JSON first (some formats use JSON)
            try {
              const jsonMatch = line.match(/^data: (.+)$/)
              if (jsonMatch) {
                const jsonData = JSON.parse(jsonMatch[1])
                if (jsonData.content || jsonData.text) {
                  assistantContent += (jsonData.content || jsonData.text) + '\n'
                } else if (jsonData.delta?.content) {
                  assistantContent += jsonData.delta.content
                }
              } else {
                // Plain text chunk
                assistantContent += line + '\n'
              }
            } catch {
              // Not JSON, treat as plain text
              assistantContent += line + '\n'
            }
            
            // Update the message content in real-time
            setMessages(prev => {
              const updated = [...prev]
              const lastMsg = updated[updated.length - 1]
              if (lastMsg && lastMsg.role === 'assistant') {
                lastMsg.content = assistantContent.trim()
              }
              return updated
            })
          }
        }
        
        // Ensure final content is set
        if (assistantContent.trim()) {
          setMessages(prev => {
            const updated = [...prev]
            const lastMsg = updated[updated.length - 1]
            if (lastMsg && lastMsg.role === 'assistant') {
              lastMsg.content = assistantContent.trim()
            }
            return updated
          })
        } else if (!hasReceivedData) {
          // If no content was received at all, show an error
          setMessages(prev => {
            const updated = [...prev]
            const lastMsg = updated[updated.length - 1]
            if (lastMsg && lastMsg.role === 'assistant') {
              lastMsg.content = 'Sorry, I received an empty response. Please try again.'
            }
            return updated
          })
        }
      } catch (streamError) {
        console.error('Error reading stream:', streamError)
        // If streaming fails, try to show error message
        setMessages(prev => {
          const updated = [...prev]
          const lastMsg = updated[updated.length - 1]
          if (lastMsg && lastMsg.role === 'assistant') {
            lastMsg.content = lastMsg.content || 'Sorry, I encountered an error while generating the response. Please try again.'
          }
          return updated
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I\'m having trouble right now. Please try again later or use the contact form.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
      toast.error('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQueryClick = (query: string) => {
    setInput(query)
    setTimeout(() => {
      handleSend(query)
    }, 100)
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `👋 Hi! I'm Mohamed's AI Portfolio Assistant. I can help you learn about:

- **Projects**: Ask about specific technologies, features, or project details
- **Experience**: Learn about work history, internships, and achievements
- **Education**: Get information about degrees, courses, and learning journey
- **Skills**: Discover technical skills, tools, and expertise
- **Contact**: Find out how to get in touch

Try asking me something like "Show me projects using React" or "What's your experience with AI?"`,
      timestamp: new Date(),
    }])
    toast.success('Chat cleared!')
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Bot className="h-10 w-10 text-primary" />
              AI Portfolio Assistant
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ask questions about my portfolio, projects, experience, and skills in natural language. 
              Get instant answers powered by AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                      <CardTitle className="text-lg">Chat with AI Assistant</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearChat}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Clear
                    </Button>
                  </div>
                  <CardDescription>
                    Ask me anything about Mohamed's portfolio, projects, or experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => {
                      const isUser = message.role === 'user'
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isUser && (
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Bot className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <div className={`max-w-[80%] rounded-lg p-3 ${
                            isUser 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            {isUser ? (
                              <p className="text-sm">{message.content}</p>
                            ) : (
                              <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                              </div>
                            )}
                          </div>
                          {isUser && (
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2 items-center text-muted-foreground"
                    >
                      <Bot className="h-4 w-4" />
                      <div className="flex gap-1">
                        {/* eslint-disable-next-line react/no-unknown-property */}
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        {/* eslint-disable-next-line react/no-unknown-property */}
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        {/* eslint-disable-next-line react/no-unknown-property */}
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>
                <div className="border-t p-4 flex-shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSend()
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything about the portfolio..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </div>

            {/* Suggested Queries Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Suggested Queries
                  </CardTitle>
                  <CardDescription>
                    Click any query to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {SUGGESTED_QUERIES.map((category, idx) => {
                    const Icon = category.icon
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Icon className="h-4 w-4 text-primary" />
                          <span>{category.category}</span>
                        </div>
                        <div className="space-y-1">
                          {category.queries.map((query, qIdx) => (
                            <Button
                              key={qIdx}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-left h-auto py-2 px-3 text-xs"
                              onClick={() => handleQueryClick(query)}
                            >
                              {query}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-primary" />
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/projects">
                      <FolderGit2 className="h-4 w-4 mr-2" />
                      View Projects
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/resume">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Download Resume
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/contact-hub">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Me
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/assessment">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Quick Assessment
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <FooterLight />
    </>
  )
}

