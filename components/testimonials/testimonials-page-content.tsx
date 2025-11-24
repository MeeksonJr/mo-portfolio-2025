'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Filter, Search, Quote, Video, ExternalLink, Linkedin, Twitter, Globe } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { TestimonialGridSkeleton } from '@/components/loading/content-skeletons'

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

    // Featured filter
    if (featuredOnly) {
      filtered = filtered.filter((t) => t.is_featured)
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Testimonials</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          What clients, colleagues, and collaborators say about working with me
        </p>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
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
              <Button
                variant={featuredOnly ? 'default' : 'outline'}
                onClick={() => setFeaturedOnly(!featuredOnly)}
                className="w-full"
              >
                {featuredOnly ? 'Show All' : 'Featured Only'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Testimonials Grid */}
      {isLoading ? (
        <TestimonialGridSkeleton count={6} />
      ) : filteredTestimonials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
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
                        <a
                          href={testimonial.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          aria-label="Watch video testimonial"
                        >
                          <Video className="h-4 w-4" />
                        </a>
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
    </div>
  )
}

