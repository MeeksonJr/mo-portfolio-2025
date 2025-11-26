'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, CheckCircle2, AlertCircle, Lightbulb, X, Plus, Code2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CodeComment {
  id: string
  line: number
  type: 'suggestion' | 'question' | 'praise' | 'issue'
  text: string
  author: string
  timestamp: string
}

interface CodeSnippet {
  id: string
  title: string
  language: string
  code: string
  description: string
}

const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: '1',
    title: 'React Component with Performance Issue',
    language: 'typescript',
    code: `function UserList({ users }) {
  const [filter, setFilter] = useState('')
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(filter.toLowerCase())
  )
  
  return (
    <div>
      <input 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
      />
      {filteredUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}`,
    description: 'A React component that filters users. Can you spot the performance issue?',
  },
  {
    id: '2',
    title: 'API Route with Missing Error Handling',
    language: 'typescript',
    code: `export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  const user = await db.users.findUnique({
    where: { id: userId }
  })
  
  return Response.json({ user })
}`,
    description: 'An API route that fetches user data. What error handling is missing?',
  },
  {
    id: '3',
    title: 'TypeScript Function with Type Safety Issues',
    language: 'typescript',
    code: `function processData(data: any) {
  const result = []
  
  for (let i = 0; i < data.length; i++) {
    result.push({
      id: data[i].id,
      name: data[i].name.toUpperCase(),
      score: data[i].score * 1.1
    })
  }
  
  return result
}`,
    description: 'A data processing function. How can we improve type safety?',
  },
]

const COMMENT_TYPES = {
  suggestion: { icon: Lightbulb, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Suggestion' },
  question: { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Question' },
  praise: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Praise' },
  issue: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Issue' },
}

export default function CodeReviewSimulator() {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(CODE_SNIPPETS[0])
  const [comments, setComments] = useState<CodeComment[]>([])
  const [newComment, setNewComment] = useState({ line: 1, type: 'suggestion' as const, text: '' })
  const [showAddComment, setShowAddComment] = useState(false)

  const handleAddComment = () => {
    if (!newComment.text.trim()) return

    const comment: CodeComment = {
      id: `comment-${Date.now()}`,
      line: newComment.line,
      type: newComment.type,
      text: newComment.text,
      author: 'You',
      timestamp: new Date().toLocaleTimeString(),
    }

    setComments([...comments, comment])
    setNewComment({ line: 1, type: 'suggestion', text: '' })
    setShowAddComment(false)
  }

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter((c) => c.id !== id))
  }

  const codeLines = selectedSnippet.code.split('\n')

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Code Review Simulator</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience an interactive code review process. Add comments, suggestions, and questions to practice your code review skills.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Code Snippet Selector */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Code Samples</CardTitle>
            <CardDescription>Select a code snippet to review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {CODE_SNIPPETS.map((snippet) => (
              <Button
                key={snippet.id}
                variant={selectedSnippet.id === snippet.id ? 'default' : 'outline'}
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => {
                  setSelectedSnippet(snippet)
                  setComments([])
                  setShowAddComment(false)
                }}
              >
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    <span className="font-semibold">{snippet.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{snippet.description}</span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Code Viewer with Comments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedSnippet.title}</CardTitle>
                <CardDescription>{selectedSnippet.description}</CardDescription>
              </div>
              <Button onClick={() => setShowAddComment(!showAddComment)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add Comment Form */}
            <AnimatePresence>
              {showAddComment && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 bg-muted rounded-lg space-y-3"
                >
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max={codeLines.length}
                      value={newComment.line}
                      onChange={(e) => setNewComment({ ...newComment, line: parseInt(e.target.value) || 1 })}
                      className="w-20 px-2 py-1 border rounded text-sm"
                      placeholder="Line"
                    />
                    <select
                      value={newComment.type}
                      onChange={(e) => setNewComment({ ...newComment, type: e.target.value as typeof newComment.type })}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                      aria-label="Comment type"
                    >
                      <option value="suggestion">Suggestion</option>
                      <option value="question">Question</option>
                      <option value="praise">Praise</option>
                      <option value="issue">Issue</option>
                    </select>
                  </div>
                  <Textarea
                    value={newComment.text}
                    onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                    placeholder="Enter your comment..."
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleAddComment} size="sm">
                      Add Comment
                    </Button>
                    <Button onClick={() => setShowAddComment(false)} variant="ghost" size="sm">
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Code Display */}
            <ScrollArea className="h-[500px] rounded-md border p-4 bg-gray-900 text-white font-mono text-sm">
              <div className="relative">
                {codeLines.map((line, index) => {
                  const lineNumber = index + 1
                  const lineComments = comments.filter((c) => c.line === lineNumber)
                  const hasComments = lineComments.length > 0

                  return (
                    <div key={index} className="relative group">
                      <div
                        className={`flex gap-4 ${
                          hasComments ? 'bg-yellow-900/20 border-l-2 border-yellow-500 pl-2' : ''
                        }`}
                      >
                        <span className="text-gray-500 select-none w-8 text-right">{lineNumber}</span>
                        <code className="flex-1">{line || ' '}</code>
                      </div>
                      {hasComments && (
                        <div className="ml-12 mt-2 space-y-2">
                          {lineComments.map((comment) => {
                            const typeConfig = COMMENT_TYPES[comment.type]
                            const Icon = typeConfig.icon
                            return (
                              <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`${typeConfig.bg} p-3 rounded-lg border border-gray-700`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-start gap-2 flex-1">
                                    <Icon className={`h-4 w-4 mt-0.5 ${typeConfig.color}`} />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-xs">
                                          {typeConfig.label}
                                        </Badge>
                                        <span className="text-xs text-gray-400">{comment.author}</span>
                                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                      </div>
                                      <p className="text-sm text-gray-200">{comment.text}</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-gray-400 hover:text-white"
                                    onClick={() => handleDeleteComment(comment.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Review Summary */}
            {comments.length > 0 && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Review Summary</h3>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Comments: </span>
                    <span className="font-semibold">{comments.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Issues: </span>
                    <span className="font-semibold text-red-600">
                      {comments.filter((c) => c.type === 'issue').length}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Suggestions: </span>
                    <span className="font-semibold text-yellow-600">
                      {comments.filter((c) => c.type === 'suggestion').length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

