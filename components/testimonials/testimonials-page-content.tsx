'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Star, Filter, Search, Quote, Video, Linkedin, Twitter, Globe, BarChart3, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { TestimonialGridSkeleton } from '@/components/loading/content-skeletons'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import PageContainer from '@/components/layout/page-container'
import { SECTION_SPACING, TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface Testimonial {
  id: string
  client_name: string
  client_title?: string
  client_company?: string
  client_avatar_url?: string
  rating: number
  testimonial_text: string
  project_name?: string
  testimonial_type: 'client' | 'colleague' | 'mentor' | 'student'
  is_featured: boolean
  video_url?: string
  linkedin_url?: string
  twitter_url?: string
  website_url?: string
  created_at: string
}

export default function TestimonialsPageContent() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [sortOption, setSortOption] = useState<'recent' | 'rating' | 'featured'>('recent')
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; client: string } | null>(null)

  useEffect(() => {
    loadTestimonials()
  }, [])

  useEffect(() => {
    filterTestimonials()
  }, [testimonials, searchQuery, ratingFilter, typeFilter, featuredOnly])

  const loadTestimonials = async () => {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading testimonials:', error)
        setTestimonials([])
      } else {
        setTestimonials(data || [])
      }
    } catch (error) {
      console.error('Error loading testimonials:', error)
      setTestimonials([])
    } finally {
      setIsLoading(false)
    }
  }

  const projectOptions = useMemo(() => {
    const projects = new Set<string>()
    testimonials.forEach((t) => {
      if (t.project_name) {
        projects.add(t.project_name)
      }
    })
    return Array.from(projects).sort()
  }, [testimonials])

  const filterTestimonials = () => {
    let filtered = [...testimonials]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.client_name.toLowerCase().includes(query) ||
          t.testimonial_text.toLowerCase().includes(query) ||
          t.client_company?.toLowerCase().includes(query) ||
          t.project_name?.toLowerCase().includes(query)
      )
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      const rating = parseInt(ratingFilter)
      filtered = filtered.filter((t) => t.rating === rating)
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((t) => t.testimonial_type === typeFilter)
    }

    // Project filter
    if (projectFilter !== 'all') {
      filtered = filtered.filter((t) => t.project_name === projectFilter)
    }

    // Featured filter
    if (featuredOnly) {
      filtered = filtered.filter((t) => t.is_featured)
    }

    // Sorting
    if (sortOption === 'rating') {
      filtered = filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortOption === 'featured') {
      filtered = filtered.sort((a, b) => Number(b.is_featured) - Number(a.is_featured))
    } else {
      filtered = filtered.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    }

    setFilteredTestimonials(filtered)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
        }`}
      />
    ))
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      client: 'Client',
      colleague: 'Colleague',
      mentor: 'Mentor',
      student: 'Student',
    }
    return labels[type] || type
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      client: 'bg-blue-500',
      colleague: 'bg-green-500',
      mentor: 'bg-purple-500',
      student: 'bg-orange-500',
    }
    return colors[type] || 'bg-gray-500'
  }

  // Calculate statistics
  const stats = {
    total: testimonials.length,
    averageRating: testimonials.length > 0
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      : '0.0',
    featured: testimonials.filter((t) => t.is_featured).length,
  }

  const ratingDistribution = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    testimonials.forEach((t) => {
      counts[t.rating] = (counts[t.rating] || 0) + 1
    })
    return counts
  }, [testimonials])

  const typeDistribution = useMemo(() => {
    const types: Record<string, number> = {}
    testimonials.forEach((t) => {
      types[t.testimonial_type] = (types[t.testimonial_type] || 0) + 1
    })
    return types
  }, [testimonials])

  const openVideoModal = (url: string, client: string) => {
    setSelectedVideo({ url, client })
    setIsVideoOpen(true)
  }

  const renderVideoEmbed = (url: string) => {
    const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/)
    if (youtubeMatch) {
      const embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`
      return (
        <iframe
          className="w-full aspect-video rounded-lg"
          src={embedUrl}
          title="Video testimonial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    }

    return (
      <video controls className="w-full rounded-lg" src={url}>
        Your browser does not support the video tag.
      </video>
    )
  }

  return (
    <PageContainer width="wide" padding="default">
      <div className={SECTION_SPACING.paddingNormal}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("text-center", SECTION_SPACING.normal)}
      >
        <h1 className={cn(TYPOGRAPHY.h1, "mb-4")}>Testimonials</h1>
        <p className={cn(TYPOGRAPHY.lead, "text-muted-foreground max-w-2xl mx-auto", SECTION_SPACING.mb8)}>
          What clients, colleagues, and collaborators say about working with me
        </p>
        
        {/* Testimonial Submission Link Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn("max-w-2xl mx-auto", SECTION_SPACING.mb8)}
        >
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Quote className="h-5 w-5 text-primary" />
                    Share Your Experience
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Worked with me on a project? Share your testimonial! It will be reviewed and may be featured on this page.
                  </p>
                  <Link href="/testimonials/submit">
                    <Button className="w-full sm:w-auto">
                      <Quote className="h-4 w-4 mr-2" />
                      Submit Testimonial
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", SECTION_SPACING.normal)}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Testimonials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{stats.averageRating}</div>
              <div className="flex">
                {renderStars(Math.round(parseFloat(stats.averageRating)))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Featured</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.featured}</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Distribution Insights */}
      {!isLoading && testimonials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", SECTION_SPACING.normal)}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Rating Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of testimonial ratings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution[rating] || 0
                const percentage = testimonials.length
                  ? Math.round((count / testimonials.length) * 100)
                  : 0
                return (
                  <div key={rating} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{rating} Stars</span>
                        <div className="flex">
                          {renderStars(rating)}
                        </div>
                      </div>
                      <span className="text-muted-foreground">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Testimonial Types
              </CardTitle>
              <CardDescription>
                Diversity of testimonial sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(typeDistribution).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getTypeColor(type)}>
                      {getTypeLabel(type)}
                    </Badge>
                  </div>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={SECTION_SPACING.mb8}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search testimonials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="colleague">Colleague</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projectOptions.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Select value={sortOption} onValueChange={(value: 'recent' | 'rating' | 'featured') => setSortOption(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="featured">Featured First</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={featuredOnly ? 'default' : 'outline'}
                  onClick={() => setFeaturedOnly(!featuredOnly)}
                  className="w-full"
                >
                  {featuredOnly ? 'Show All' : 'Featured Only'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Testimonials Grid */}
      {isLoading ? (
        <TestimonialGridSkeleton count={6} />
      ) : filteredTestimonials.length === 0 ? (
        <Card>
          <CardContent className={cn(SECTION_SPACING.paddingNormal, "text-center")}>
            <Quote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No testimonials found matching your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`h-full flex flex-col ${testimonial.is_featured ? 'border-primary border-2' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {testimonial.client_avatar_url ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={testimonial.client_avatar_url}
                            alt={testimonial.client_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold text-lg">
                            {testimonial.client_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{testimonial.client_name}</CardTitle>
                        {testimonial.client_title && (
                          <CardDescription>
                            {testimonial.client_title}
                            {testimonial.client_company && ` at ${testimonial.client_company}`}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    {testimonial.is_featured && (
                      <Badge variant="default" className="ml-2">Featured</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{renderStars(testimonial.rating)}</div>
                    <Badge variant="outline" className={getTypeColor(testimonial.testimonial_type)}>
                      {getTypeLabel(testimonial.testimonial_type)}
                    </Badge>
                  </div>
                  {testimonial.project_name && (
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.project_name}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="relative mb-4">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                    <p className="text-sm leading-relaxed pl-4">{testimonial.testimonial_text}</p>
                  </div>
                  {(testimonial.linkedin_url || testimonial.twitter_url || testimonial.website_url || testimonial.video_url) && (
                    <div className="flex items-center gap-2 pt-4 border-t">
                      {testimonial.video_url && (
                        <button
                          onClick={() => openVideoModal(testimonial.video_url!, testimonial.client_name)}
                          className="text-muted-foreground hover:text-primary transition-colors"
                          aria-label="Watch video testimonial"
                        >
                          <Video className="h-4 w-4" />
                        </button>
                      )}
                      {testimonial.linkedin_url && (
                        <a
                          href={testimonial.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          aria-label="LinkedIn profile"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {testimonial.twitter_url && (
                        <a
                          href={testimonial.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          aria-label="Twitter profile"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                      {testimonial.website_url && (
                        <a
                          href={testimonial.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          aria-label="Website"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        {selectedVideo && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedVideo.client}'s Testimonial</DialogTitle>
            </DialogHeader>
            {renderVideoEmbed(selectedVideo.url)}
          </DialogContent>
        )}
      </Dialog>
      </div>
    </PageContainer>
  )
}

