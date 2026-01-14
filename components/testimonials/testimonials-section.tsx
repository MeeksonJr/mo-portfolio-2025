'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, Video, Linkedin, Twitter, Globe, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from 'next/link'

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

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; client: string } | null>(null)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .order('rating', { ascending: false })
        .limit(6)

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-transparent text-muted-foreground'
        }`}
      />
    ))
  }

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

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

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="text-center">
          <div className="h-8 w-48 bg-muted rounded mx-auto mb-4 animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded mx-auto animate-pulse" />
        </div>
      </div>
    )
  }

  if (testimonials.length === 0) {
    return null
  }

  const currentTestimonial = testimonials[currentIndex]
  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="glass rounded-2xl p-8 md:p-12 mb-16"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Say</h2>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex">
            {renderStars(Math.round(averageRating))}
          </div>
          <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
          <span className="text-muted-foreground">({testimonials.length} reviews)</span>
        </div>
        <p className="text-muted-foreground">
          Testimonials from clients, colleagues, and collaborators
        </p>
      </div>

      {/* Featured Testimonial Carousel */}
      <div className="relative max-w-4xl mx-auto">
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Client Info */}
              <div className="flex-shrink-0 flex flex-col items-center md:items-start">
                {currentTestimonial.client_avatar_url ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-primary/20">
                    <Image
                      src={currentTestimonial.client_avatar_url}
                      alt={currentTestimonial.client_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-2 border-primary/20">
                    <Quote className="h-10 w-10 text-primary" />
                  </div>
                )}
                <div className="text-center md:text-left">
                  <h3 className="font-bold text-lg">{currentTestimonial.client_name}</h3>
                  {currentTestimonial.client_title && (
                    <p className="text-sm text-muted-foreground">{currentTestimonial.client_title}</p>
                  )}
                  {currentTestimonial.client_company && (
                    <p className="text-sm text-muted-foreground">{currentTestimonial.client_company}</p>
                  )}
                  <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
                    {renderStars(currentTestimonial.rating)}
                  </div>
                  {currentTestimonial.project_name && (
                    <Badge variant="outline" className="mt-2">
                      {currentTestimonial.project_name}
                    </Badge>
                  )}
                  {/* Social Links */}
                  <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
                    {currentTestimonial.linkedin_url && (
                      <Link
                        href={currentTestimonial.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </Link>
                    )}
                    {currentTestimonial.twitter_url && (
                      <Link
                        href={currentTestimonial.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                      </Link>
                    )}
                    {currentTestimonial.website_url && (
                      <Link
                        href={currentTestimonial.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Testimonial Text */}
              <div className="flex-1">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-lg leading-relaxed mb-4 italic">
                  &quot;{currentTestimonial.testimonial_text}&quot;
                </p>
                {currentTestimonial.video_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openVideoModal(currentTestimonial.video_url!, currentTestimonial.client_name)}
                    className="gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Watch Video Testimonial
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted-foreground/30'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* View All Link */}
      <div className="text-center mt-8">
        <Link href="/testimonials">
          <Button variant="outline">
            View All Testimonials ({testimonials.length})
          </Button>
        </Link>
      </div>

      {/* Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Video Testimonial from {selectedVideo?.client}</DialogTitle>
          </DialogHeader>
          {selectedVideo && renderVideoEmbed(selectedVideo.url)}
        </DialogContent>
      </Dialog>
    </motion.section>
  )
}

