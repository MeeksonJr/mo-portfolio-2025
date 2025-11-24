'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Server, Database, Globe, Shield, Zap, Layers, Network,
  ChevronRight, ChevronDown, Code, Lock, Gauge, GitBranch
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface ArchitectureLayer {
  id: string
  name: string
  description: string
  technologies: string[]
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface ArchitectureDiagram {
  id: string
  title: string
  description: string
  type: 'full-stack' | 'api' | 'database' | 'security' | 'scalability'
  layers: ArchitectureLayer[]
  connections?: { from: string; to: string; label?: string }[]
}

const architectureDiagrams: ArchitectureDiagram[] = [
  {
    id: 'full-stack',
    title: 'Full Stack Architecture',
    description: 'Complete application architecture from frontend to database',
    type: 'full-stack',
    layers: [
      {
        id: 'frontend',
        name: 'Frontend Layer',
        description: 'React, Next.js, TypeScript, TailwindCSS',
        technologies: ['Next.js 15', 'React 19', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
        icon: Globe,
        color: 'text-blue-600'
      },
      {
        id: 'api',
        name: 'API Layer',
        description: 'RESTful APIs, Server Actions, Edge Functions',
        technologies: ['Next.js API Routes', 'Server Actions', 'Edge Functions', 'Middleware'],
        icon: Network,
        color: 'text-green-600'
      },
      {
        id: 'ai',
        name: 'AI Integration Layer',
        description: 'AI services and model integrations',
        technologies: ['Gemini 2.0', 'Groq', 'Hugging Face', 'Vercel AI SDK'],
        icon: Zap,
        color: 'text-purple-600'
      },
      {
        id: 'database',
        name: 'Database Layer',
        description: 'PostgreSQL, Supabase, Firebase',
        technologies: ['Supabase (PostgreSQL)', 'Firebase', 'Row Level Security', 'Real-time Subscriptions'],
        icon: Database,
        color: 'text-orange-600'
      },
      {
        id: 'storage',
        name: 'Storage Layer',
        description: 'File storage and CDN',
        technologies: ['Supabase Storage', 'Vercel Blob', 'Image Optimization'],
        icon: Server,
        color: 'text-red-600'
      }
    ],
    connections: [
      { from: 'frontend', to: 'api', label: 'HTTP/HTTPS' },
      { from: 'api', to: 'ai', label: 'API Calls' },
      { from: 'api', to: 'database', label: 'SQL Queries' },
      { from: 'api', to: 'storage', label: 'File Uploads' }
    ]
  },
  {
    id: 'scalability',
    title: 'Scalability Patterns',
    description: 'Architecture patterns for handling growth and traffic',
    type: 'scalability',
    layers: [
      {
        id: 'cdn',
        name: 'CDN & Edge',
        description: 'Global content delivery',
        technologies: ['Vercel Edge Network', 'Static Generation', 'ISR', 'Edge Functions'],
        icon: Globe,
        color: 'text-blue-600'
      },
      {
        id: 'caching',
        name: 'Caching Layer',
        description: 'Performance optimization',
        technologies: ['Next.js Caching', 'Redis (Upstash)', 'Browser Cache', 'API Cache'],
        icon: Gauge,
        color: 'text-green-600'
      },
      {
        id: 'database-scaling',
        name: 'Database Scaling',
        description: 'Horizontal and vertical scaling',
        technologies: ['Connection Pooling', 'Read Replicas', 'Partitioning', 'Indexing'],
        icon: Database,
        color: 'text-orange-600'
      },
      {
        id: 'monitoring',
        name: 'Monitoring & Analytics',
        description: 'Performance tracking',
        technologies: ['Vercel Analytics', 'Speed Insights', 'Error Tracking', 'Custom Metrics'],
        icon: Gauge,
        color: 'text-purple-600'
      }
    ]
  },
  {
    id: 'security',
    title: 'Security Architecture',
    description: 'Security measures and best practices',
    type: 'security',
    layers: [
      {
        id: 'authentication',
        name: 'Authentication',
        description: 'User authentication and authorization',
        technologies: ['Supabase Auth', 'JWT Tokens', 'OAuth', 'Session Management'],
        icon: Lock,
        color: 'text-blue-600'
      },
      {
        id: 'data-protection',
        name: 'Data Protection',
        description: 'Encryption and data security',
        technologies: ['Row Level Security', 'Encryption at Rest', 'Encryption in Transit', 'Data Validation'],
        icon: Shield,
        color: 'text-green-600'
      },
      {
        id: 'api-security',
        name: 'API Security',
        description: 'API protection and rate limiting',
        technologies: ['Rate Limiting', 'CORS', 'Input Sanitization', 'CSRF Protection'],
        icon: Network,
        color: 'text-orange-600'
      },
      {
        id: 'compliance',
        name: 'Compliance',
        description: 'Security standards and compliance',
        technologies: ['GDPR Compliance', 'Security Headers', 'CSP', 'HSTS'],
        icon: Shield,
        color: 'text-purple-600'
      }
    ]
  }
]

const ArchitectureVisualization = ({ diagram }: { diagram: ArchitectureDiagram }) => {
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set())

  const toggleLayer = (layerId: string) => {
    const newExpanded = new Set(expandedLayers)
    if (newExpanded.has(layerId)) {
      newExpanded.delete(layerId)
    } else {
      newExpanded.add(layerId)
    }
    setExpandedLayers(newExpanded)
  }

  return (
    <div className="space-y-4">
      {/* Visual Architecture Diagram */}
      <div className="relative p-8 bg-gradient-to-br from-background to-muted/20 rounded-lg border border-border">
        <div className="space-y-6">
          {diagram.layers.map((layer, index) => {
            const isExpanded = expandedLayers.has(layer.id)
            const Icon = layer.icon

            return (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connection Line */}
                {index < diagram.layers.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-6 bg-border z-0" />
                )}

                {/* Layer Card */}
                <Collapsible open={isExpanded} onOpenChange={() => toggleLayer(layer.id)}>
                  <CollapsibleTrigger asChild>
                    <Card className="relative z-10 cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-muted ${layer.color}`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{layer.name}</CardTitle>
                                  <CardDescription className="text-sm mt-1">
                                    {layer.description}
                                  </CardDescription>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </CardHeader>
                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <div className="flex flex-wrap gap-2">
                                {layer.technologies.map((tech) => (
                                  <Badge key={tech} variant="secondary" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </CollapsibleTrigger>
                    </Collapsible>
                  </motion.div>
                )
              })}
            </div>
          </div>

      {/* Connections Visualization */}
      {diagram.connections && diagram.connections.length > 0 && (
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Layer Connections
          </h4>
          <div className="space-y-2">
            {diagram.connections.map((conn, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">{conn.from}</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium">{conn.to}</span>
                {conn.label && (
                  <span className="text-xs">({conn.label})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function TechnicalArchitectureShowcase() {
    const [selectedDiagram, setSelectedDiagram] = useState<string>('full-stack')

    const currentDiagram = architectureDiagrams.find((d) => d.id === selectedDiagram) || architectureDiagrams[0]

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
              <h1 className="text-4xl font-bold tracking-tight">Technical Architecture Showcase</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore the architecture patterns, scalability solutions, and security implementations
                behind modern web applications
              </p>
            </motion.div>
          </div>

          {/* Diagram Selector */}
          <Tabs value={selectedDiagram} onValueChange={setSelectedDiagram} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
              <TabsTrigger value="full-stack">Full Stack</TabsTrigger>
              <TabsTrigger value="scalability">Scalability</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedDiagram} className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDiagram}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">{currentDiagram.title}</CardTitle>
                      <CardDescription className="text-base">
                        {currentDiagram.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ArchitectureVisualization diagram={currentDiagram} />
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  <CardTitle>Layered Architecture</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Clean separation of concerns with distinct layers for frontend, API, AI, and database
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <CardTitle>Performance Optimized</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built with caching, CDN, and edge computing for optimal performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <CardTitle>Security First</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Multiple layers of security including authentication, encryption, and compliance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

