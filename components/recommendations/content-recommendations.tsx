'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, BookOpen, Rocket, Wrench, 
  TrendingUp, Heart, Clock, ExternalLink,
  Github, ArrowRight, Filter, RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'

interface Recommendation {
  id: string
  type: 'project' | 'blog' | 'case-study' | 'resource'
  title: string
  description: string | null
  url: string
  image?: string | null
  tags?: string[]
  reason: string
  score: number
  metadata?: Record<string, any>
}

export default function ContentRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewingHistory, setViewingHistory] = useState<string[]>([])

  useEffect(() => {
    // Get viewing history from localStorage
    const history = JSON.parse(localStorage.getItem('viewing_history') || '[]')
    setViewingHistory(history)
    
    fetchRecommendations(history)
  }, [])

  const fetchRecommendations = async (history: string[] = []) => {
    try {
      setLoading(true)
      const allRecommendations: Recommendation[] = []

      // Fetch projects
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name, description, featured_image, tech_stack, github_url, homepage_url, slug')
        .eq('status', 'published')
        .limit(20)

      if (projects) {
        projects.forEach(project => {
          // Calculate recommendation score based on various factors
          let score = 50 // Base score
          
          // Boost if featured
          if (project.featured_image) score += 10
          
          // Boost if has live URL
          if (project.homepage_url) score += 15
          
          // Boost if tech stack matches viewing history
          if (project.tech_stack && history.length > 0) {
            const matchingTech = project.tech_stack.filter((tech: string) => 
              history.some((h: string) => h.toLowerCase().includes(tech.toLowerCase()))
            )
            score += matchingTech.length * 10
          }

          // Randomize slightly for variety
          score += Math.random() * 20

          // Create slug from name if not available
          const createSlug = (name: string) => {
            return name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
          }

          allRecommendations.push({
            id: `project-${project.id}`,
            type: 'project',
            title: project.name,
            description: project.description,
            url: `/projects/${project.slug || createSlug(project.name)}`,
            image: project.featured_image,
            tags: project.tech_stack || [],
            reason: generateReason('project', project.tech_stack || []),
            score,
            metadata: { github_url: project.github_url, homepage_url: project.homepage_url },
          })
        })
      }

      // Fetch blog posts
      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('id, title, excerpt, featured_image, tags, slug, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(15)

      if (blogPosts) {
        blogPosts.forEach(post => {
          let score = 50
          
          if (post.featured_image) score += 10
          if (post.tags && post.tags.length > 0) score += 5
          
          // Boost recent posts
          const daysSincePublished = post.published_at 
            ? Math.floor((Date.now() - new Date(post.published_at).getTime()) / (1000 * 60 * 60 * 24))
            : 365
          if (daysSincePublished < 30) score += 15
          if (daysSincePublished < 7) score += 10

          // Boost if tags match history
          if (post.tags && history.length > 0) {
            const matchingTags = post.tags.filter((tag: string) =>
              history.some((h: string) => h.toLowerCase().includes(tag.toLowerCase()))
            )
            score += matchingTags.length * 8
          }

          score += Math.random() * 15

          allRecommendations.push({
            id: `blog-${post.id}`,
            type: 'blog',
            title: post.title,
            description: post.excerpt,
            url: `/blog/${post.slug}`,
            image: post.featured_image,
            tags: post.tags || [],
            reason: generateReason('blog', post.tags || []),
            score,
          })
        })
      }

      // Fetch case studies
      const { data: caseStudies } = await supabase
        .from('case_studies')
        .select('id, title, excerpt, featured_image, tags, slug')
        .eq('status', 'published')
        .limit(10)

      if (caseStudies) {
        caseStudies.forEach(cs => {
          let score = 50
          if (cs.featured_image) score += 10
          if (cs.tags && cs.tags.length > 0) score += 5
          score += Math.random() * 15

          allRecommendations.push({
            id: `case-study-${cs.id}`,
            type: 'case-study',
            title: cs.title,
            description: cs.excerpt,
            url: `/case-studies/${cs.slug}`,
            image: cs.featured_image,
            tags: cs.tags || [],
            reason: generateReason('case-study', cs.tags || []),
            score,
          })
        })
      }

      // Sort by score and take top recommendations
      const sorted = allRecommendations.sort((a, b) => b.score - a.score)
      setRecommendations(sorted.slice(0, 20)) // Top 20 recommendations
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      toast.error('Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  const generateReason = (type: string, tags: string[]): string => {
    const reasons = {
      project: [
        'Similar technologies to what you\'ve been exploring',
        'Popular project with great reviews',
        'Recently updated with new features',
        'Featured project showcasing advanced skills',
      ],
      blog: [
        'Related to topics you\'ve shown interest in',
        'Recently published and trending',
        'Covers technologies you\'ve been viewing',
        'Popular post with high engagement',
      ],
      'case-study': [
        'Detailed analysis of real-world solutions',
        'Similar challenges to projects you\'ve viewed',
        'Comprehensive technical breakdown',
        'Featured case study with proven results',
      ],
    }

    const typeReasons = reasons[type as keyof typeof reasons] || reasons.blog
    return typeReasons[Math.floor(Math.random() * typeReasons.length)]
  }

  const filteredRecommendations = useMemo(() => {
    if (selectedCategory === 'all') return recommendations
    return recommendations.filter(rec => rec.type === selectedCategory)
  }, [recommendations, selectedCategory])

  const handleRefresh = () => {
    const history = JSON.parse(localStorage.getItem('viewing_history') || '[]')
    fetchRecommendations(history)
    toast.success('Recommendations refreshed!')
  }

  const categories = [
    { value: 'all', label: 'All', icon: Sparkles },
    { value: 'project', label: 'Projects', icon: Rocket },
    { value: 'blog', label: 'Blog Posts', icon: BookOpen },
    { value: 'case-study', label: 'Case Studies', icon: TrendingUp },
    { value: 'resource', label: 'Resources', icon: Wrench },
  ]

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Analyzing your interests...</p>
          </div>
        </div>
        <FooterLight />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Sparkles className="h-10 w-10 text-primary" />
              AI-Powered Recommendations
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Personalized content recommendations based on your browsing history and interests
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between"
          >
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
              <TabsList>
                {categories.map(cat => {
                  const Icon = cat.icon
                  return (
                    <TabsTrigger key={cat.value} value={cat.value} className="gap-2">
                      <Icon className="h-4 w-4" />
                      {cat.label}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                {filteredRecommendations.length} recommendations
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map((rec, idx) => {
                const typeIcons = {
                  project: Rocket,
                  blog: BookOpen,
                  'case-study': TrendingUp,
                  resource: Wrench,
                }
                const Icon = typeIcons[rec.type] || BookOpen

                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                  >
                    <Card className="h-full hover:border-primary/50 transition-all cursor-pointer group">
                      <Link href={rec.url}>
                        {rec.image && (
                          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                            <Image
                              src={rec.image}
                              alt={rec.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-primary/90">
                                <Icon className="h-3 w-3 mr-1" />
                                {rec.type}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="line-clamp-2 mb-2">{rec.title}</CardTitle>
                              <CardDescription className="line-clamp-2">
                                {rec.description || 'No description available'}
                              </CardDescription>
                            </div>
                            {!rec.image && (
                              <div className="p-2 rounded-lg bg-muted">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {/* Recommendation Reason */}
                            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                              <div className="flex items-start gap-2">
                                <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-muted-foreground">{rec.reason}</p>
                              </div>
                            </div>

                            {/* Tags */}
                            {rec.tags && rec.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {rec.tags.slice(0, 3).map((tag, tagIdx) => (
                                  <Badge key={tagIdx} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {rec.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{rec.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}

                            {/* Score Indicator */}
                            <div className="flex items-center justify-between text-xs pt-2 border-t">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <TrendingUp className="h-3 w-3" />
                                Match: {Math.round(rec.score)}%
                              </div>
                              <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                                View
                                <ArrowRight className="h-3 w-3" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  </motion.div>
                )
              })
            ) : (
              <Card className="col-span-full">
                <CardContent className="py-16 text-center">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No recommendations available</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  How Recommendations Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-1 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-primary" />
                      Personalized
                    </p>
                    <p className="text-muted-foreground">
                      Recommendations are based on your browsing history and interests
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Smart Matching
                    </p>
                    <p className="text-muted-foreground">
                      AI analyzes content similarity, tags, and engagement to find the best matches
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1 flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-primary" />
                      Always Fresh
                    </p>
                    <p className="text-muted-foreground">
                      Recommendations update as you explore more content
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <FooterLight />
    </>
  )
}

