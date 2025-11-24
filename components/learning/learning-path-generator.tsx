'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sparkles, Download, CheckCircle2, Clock, Target, BookOpen } from 'lucide-react'

type SkillLevel = 'beginner' | 'intermediate' | 'advanced'
type FocusArea = 'frontend' | 'fullstack' | 'ai'
type TimeCommitment = 'part-time' | 'full-time'

interface LearningModule {
  id: string
  title: string
  duration: string
  focus: string[]
  outcomes: string[]
  resources: Array<{ title: string; url: string }>
}

interface LearningTrack {
  summary: string
  modules: Record<SkillLevel, LearningModule[]>
}

const learningTracks: Record<FocusArea, LearningTrack> = {
  frontend: {
    summary:
      'Modern frontend engineering path focusing on React, design systems, accessibility, and performance.',
    modules: {
      beginner: [
        {
          id: 'fe-beg-1',
          title: 'Foundations: HTML, CSS, JavaScript',
          duration: '2-3 weeks',
          focus: ['HTML semantics', 'Responsive design', 'DOM manipulation'],
          outcomes: [
            'Build semantic layouts',
            'Style components with CSS/Tailwind',
            'Write interactive scripts with vanilla JS',
          ],
          resources: [
            { title: 'MDN Web Docs - Learn Web Development', url: 'https://developer.mozilla.org/en-US/docs/Learn' },
            { title: 'Frontend Masters - Getting Started with CSS', url: 'https://frontendmasters.com/courses/getting-started-css/' },
          ],
        },
        {
          id: 'fe-beg-2',
          title: 'React & Component Architecture',
          duration: '2 weeks',
          focus: ['JSX', 'Hooks', 'State management'],
          outcomes: [
            'Build reusable components',
            'Manage state with hooks',
            'Understand component composition',
          ],
          resources: [
            { title: 'React Docs - Quick Start', url: 'https://react.dev/learn' },
            { title: 'Egghead - The Beginner\'s Guide to React', url: 'https://egghead.io/courses/the-beginner-s-guide-to-react' },
          ],
        },
      ],
      intermediate: [
        {
          id: 'fe-int-1',
          title: 'Next.js & Full-stack Integration',
          duration: '3 weeks',
          focus: ['Routing', 'Data fetching', 'API routes'],
          outcomes: [
            'Build production-ready Next.js apps',
            'Integrate Supabase/Firebase backends',
            'Implement authentication and SEO',
          ],
          resources: [
            { title: 'Next.js Learn Course', url: 'https://nextjs.org/learn' },
            { title: 'Supabase Auth Guide', url: 'https://supabase.com/docs/guides/auth' },
          ],
        },
        {
          id: 'fe-int-2',
          title: 'Design Systems & Accessibility',
          duration: '2 weeks',
          focus: ['Design tokens', 'ARIA', 'Storybook'],
          outcomes: [
            'Create reusable design tokens',
            'Ensure WCAG compliance',
            'Document components with Storybook',
          ],
          resources: [
            { title: 'Design Systems Handbook', url: 'https://www.designbetter.co/design-systems-handbook' },
            { title: 'WebAIM Accessibility Principles', url: 'https://webaim.org/articles/principles/' },
          ],
        },
      ],
      advanced: [
        {
          id: 'fe-adv-1',
          title: 'Performance & Observability',
          duration: '2 weeks',
          focus: ['Core Web Vitals', 'Profiling', 'Analytics'],
          outcomes: [
            'Optimize for Largest Contentful Paint',
            'Use React Profiler & Lighthouse',
            'Instrument analytics dashboards',
          ],
          resources: [
            { title: 'Google Web Vitals', url: 'https://web.dev/vitals/' },
            { title: 'Next.js Performance', url: 'https://nextjs.org/docs/advanced-features/measuring-performance' },
          ],
        },
        {
          id: 'fe-adv-2',
          title: 'Advanced Animations & Micro-Interactions',
          duration: '2 weeks',
          focus: ['Framer Motion', 'Canvas', 'State machines'],
          outcomes: [
            'Design delightful animations responsibly',
            'Build interactive dashboards',
            'Coordinate animations with state machines',
          ],
          resources: [
            { title: 'Framer Motion Docs', url: 'https://www.framer.com/motion/' },
            { title: 'Josh Comeau - Joy of Animations', url: 'https://www.joshwcomeau.com/animation/' },
          ],
        },
      ],
    },
  },
  fullstack: {
    summary:
      'Full-stack specialization across API design, databases, DevOps, and product delivery.',
    modules: {
      beginner: [
        {
          id: 'fs-beg-1',
          title: 'Node.js & REST APIs',
          duration: '2 weeks',
          focus: ['Express', 'REST', 'Postman'],
          outcomes: [
            'Design RESTful APIs',
            'Handle authentication & validation',
            'Test endpoints with Postman',
          ],
          resources: [
            { title: 'Node.js Docs', url: 'https://nodejs.org/en/docs' },
            { title: 'Express Guide', url: 'https://expressjs.com/en/guide/routing.html' },
          ],
        },
        {
          id: 'fs-beg-2',
          title: 'Database Fundamentals',
          duration: '2 weeks',
          focus: ['SQL', 'Schema design', 'Supabase'],
          outcomes: [
            'Design normalized schemas',
            'Write complex SQL queries',
            'Integrate Supabase/Postgres',
          ],
          resources: [
            { title: 'SQLBolt', url: 'https://sqlbolt.com/' },
            { title: 'Supabase Database', url: 'https://supabase.com/docs/guides/database' },
          ],
        },
      ],
      intermediate: [
        {
          id: 'fs-int-1',
          title: 'GraphQL & Microservices',
          duration: '3 weeks',
          focus: ['GraphQL schemas', 'Federation', 'Queues'],
          outcomes: [
            'Implement GraphQL APIs',
            'Coordinate services with queues/workers',
            'Deploy with serverless functions',
          ],
          resources: [
            { title: 'Apollo GraphQL Tutorial', url: 'https://www.apollographql.com/docs/' },
            { title: 'Microservices Patterns', url: 'https://microservices.io/patterns/index.html' },
          ],
        },
        {
          id: 'fs-int-2',
          title: 'Testing & CI/CD',
          duration: '2 weeks',
          focus: ['Vitest', 'Playwright', 'GitHub Actions'],
          outcomes: [
            'Write full coverage unit & e2e tests',
            'Automate pipelines with GitHub Actions',
            'Adopt trunk-based delivery',
          ],
          resources: [
            { title: 'Testing Library', url: 'https://testing-library.com/docs/' },
            { title: 'Playwright Docs', url: 'https://playwright.dev/docs/intro' },
          ],
        },
      ],
      advanced: [
        {
          id: 'fs-adv-1',
          title: 'Scalability & Observability',
          duration: '3 weeks',
          focus: ['Caching', 'Instrumentation', 'Tracing'],
          outcomes: [
            'Design for horizontal scaling',
            'Implement caching layers (Redis/Upstash)',
            'Monitor with OpenTelemetry',
          ],
          resources: [
            { title: 'Practical Monitoring', url: 'https://sre.google/sre-book/practical-monitoring/' },
            { title: 'Upstash Tutorials', url: 'https://upstash.com/docs' },
          ],
        },
        {
          id: 'fs-adv-2',
          title: 'Product Delivery & Architecture',
          duration: '2 weeks',
          focus: ['Domain-driven design', 'Architecture decision records'],
          outcomes: [
            'Facilitate ADRs & architecture reviews',
            'Model domains with bounded contexts',
            'Lead technical roadmaps',
          ],
          resources: [
            { title: 'DDD in Practice', url: 'https://www.domainlanguage.com/ddd/' },
            { title: 'ADR GitHub Template', url: 'https://adr.github.io/' },
          ],
        },
      ],
    },
  },
  ai: {
    summary:
      'AI-first development path blending machine learning, prompt engineering, and ethical delivery.',
    modules: {
      beginner: [
        {
          id: 'ai-beg-1',
          title: 'Python & Data Foundations',
          duration: '2 weeks',
          focus: ['NumPy', 'Pandas', 'Data cleaning'],
          outcomes: [
            'Manipulate datasets with Pandas',
            'Visualize data with Matplotlib',
            'Understand ML workflow basics',
          ],
          resources: [
            { title: 'Kaggle Python Course', url: 'https://www.kaggle.com/learn/python' },
            { title: 'DataCamp - Data Science Toolbox', url: 'https://www.datacamp.com/' },
          ],
        },
        {
          id: 'ai-beg-2',
          title: 'Prompt Engineering & APIs',
          duration: '2 weeks',
          focus: ['LLM APIs', 'Prompt design', 'Safety'],
          outcomes: [
            'Design structured prompts',
            'Call OpenAI/Groq/Gemini APIs',
            'Handle moderation & safety filters',
          ],
          resources: [
            { title: 'OpenAI Prompt Guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
            { title: 'Google Generative AI', url: 'https://ai.google.dev/' },
          ],
        },
      ],
      intermediate: [
        {
          id: 'ai-int-1',
          title: 'Custom Models & RAG',
          duration: '3 weeks',
          focus: ['Vector databases', 'Embeddings', 'Fine-tuning'],
          outcomes: [
            'Build Retrieval Augmented Generation systems',
            'Fine-tune small models on domain data',
            'Deploy inference endpoints',
          ],
          resources: [
            { title: 'LangChain Docs', url: 'https://python.langchain.com/' },
            { title: 'Pinecone RAG Guide', url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/' },
          ],
        },
        {
          id: 'ai-int-2',
          title: 'Ethics & Responsible AI',
          duration: '1 week',
          focus: ['Bias detection', 'Evaluation', 'Compliance'],
          outcomes: [
            'Implement evaluation pipelines',
            'Document datasets and decisions',
            'Apply ethical review checklists',
          ],
          resources: [
            { title: 'Google Responsible AI', url: 'https://ai.google/responsibilities/responsible-ai-practices/' },
            { title: 'Microsoft Responsible AI', url: 'https://www.microsoft.com/en-us/ai/responsible-ai' },
          ],
        },
      ],
      advanced: [
        {
          id: 'ai-adv-1',
          title: 'Agentic Systems & Automation',
          duration: '2 weeks',
          focus: ['Autonomous agents', 'Tooling', 'State machines'],
          outcomes: [
            'Compose multi-step AI agents',
            'Integrate AI SDK (Vercel) workflows',
            'Coordinate long-running jobs',
          ],
          resources: [
            { title: 'Vercel AI SDK', url: 'https://sdk.vercel.ai/' },
            { title: 'Agentic Pattern Guide', url: 'https://www.langchain.com/' },
          ],
        },
        {
          id: 'ai-adv-2',
          title: 'AI Product Delivery',
          duration: '2 weeks',
          focus: ['Experiment tracking', 'Observability', 'Cost control'],
          outcomes: [
            'Track experiments with Weights & Biases',
            'Optimize inference costs',
            'Ship AI experiences safely to prod',
          ],
          resources: [
            { title: 'Weights & Biases Docs', url: 'https://docs.wandb.ai/' },
            { title: 'Prompt Engineering Patterns', url: 'https://www.promptingguide.ai/' },
          ],
        },
      ],
    },
  },
}

type ProgressState = Record<string, boolean>

export default function LearningPathGenerator() {
  const [level, setLevel] = useState<SkillLevel>('beginner')
  const [focusArea, setFocusArea] = useState<FocusArea>('frontend')
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment>('part-time')
  const [progress, setProgress] = useState<ProgressState>({})

  useEffect(() => {
    const stored = localStorage.getItem('learning_paths_progress')
    if (stored) {
      setProgress(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('learning_paths_progress', JSON.stringify(progress))
  }, [progress])

  const track = learningTracks[focusArea]
  const modules = track.modules[level]

  const estimatedDuration = useMemo(() => {
    const weeks = modules.reduce((sum, module) => {
      const numeric = parseInt(module.duration)
      return sum + (Number.isNaN(numeric) ? 2 : numeric)
    }, 0)
    return timeCommitment === 'part-time' ? weeks * 1.5 : weeks
  }, [modules, timeCommitment])

  const toggleProgress = (moduleId: string) => {
    setProgress((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const downloadPlan = () => {
    const plan = {
      focusArea,
      level,
      timeCommitment,
      estimatedDurationWeeks: estimatedDuration,
      modules,
    }
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `learning-path-${focusArea}-${level}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const completionRate = Math.round(
    (modules.filter((module) => progress[module.id]).length / modules.length) * 100,
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary mb-3">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-semibold">AI-Inspired Learning Paths</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Learning Path Generator</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Build a personalized roadmap from Guinea to shipping production features. Choose
          your focus, level, and commitment to generate curated steps with measurable outcomes.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10"
      >
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Customize Path</CardTitle>
            <CardDescription>
              Select your current level, focus area, and timeline to generate recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold mb-2">Focus Area</p>
                <Select value={focusArea} onValueChange={(value: FocusArea) => setFocusArea(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Craft</SelectItem>
                    <SelectItem value="fullstack">Full-Stack Execution</SelectItem>
                    <SelectItem value="ai">AI Product Builder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Skill Level</p>
                <Select value={level} onValueChange={(value: SkillLevel) => setLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Time Commitment</p>
                <Select
                  value={timeCommitment}
                  onValueChange={(value: TimeCommitment) => setTimeCommitment(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="part-time">10-15 hrs / week</SelectItem>
                    <SelectItem value="full-time">20-30 hrs / week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold mb-2">Estimated Duration</p>
                <div className="text-3xl font-bold">{estimatedDuration} weeks</div>
                <p className="text-sm text-muted-foreground">
                  Based on your inputs and recommended pace.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Path Snapshot
            </CardTitle>
            <CardDescription>
              Track progression and export your plan for accountability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
              </div>
              <Button variant="outline" size="sm" onClick={downloadPlan}>
                <Download className="h-4 w-4 mr-2" />
                Download Plan
              </Button>
            </div>
            <Progress value={completionRate} className="h-2" />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{focusArea}</Badge>
                <Badge variant="outline">{level}</Badge>
                <Badge variant="outline">{timeCommitment.replace('-', ' ')}</Badge>
              </div>
              <p className="text-muted-foreground">
                {track.summary}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {modules.map((module) => (
          <Card key={module.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {module.title}
                </CardTitle>
                <CardDescription>{module.duration}</CardDescription>
              </div>
              <Button
                variant={progress[module.id] ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleProgress(module.id)}
                className="whitespace-nowrap"
              >
                {progress[module.id] ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Completed
                  </>
                ) : (
                  'Mark Complete'
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="flex flex-wrap gap-2">
                {module.focus.map((topic) => (
                  <Badge key={topic} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Key Outcomes</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {module.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Resources</p>
                <div className="space-y-1">
                  {module.resources.map((resource) => (
                    <a
                      key={resource.url}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm hover:underline flex items-center gap-2"
                    >
                      <span>↗</span>
                      {resource.title}
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  )
}

