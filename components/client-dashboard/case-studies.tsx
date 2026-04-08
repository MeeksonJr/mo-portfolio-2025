'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { resumeData } from '@/lib/resume-data'
import { Star, MessageSquareQuote, CheckCircle, ExternalLink, Loader2 } from 'lucide-react'

export default function CaseStudies() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchTestimonials() {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('rating', { ascending: false })
        .limit(4)
      
      if (data) setTestimonials(data)
      setLoading(false)
    }
    fetchTestimonials()
  }, [])

  const caseStudies = resumeData.projects.slice(0, 3)

  return (
    <div className="w-full space-y-16">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight border-b border-primary/20 pb-4">
          B2B SaaS Case Studies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {caseStudies.map((study: any, idx: number) => (
            <div key={idx} className="bg-card/50 hover:bg-card border border-border hover:border-primary/50 transition-all rounded-2xl p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg leading-tight">{study.name}</h3>
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              </div>
              <p className="text-muted-foreground text-sm flex-grow mb-6">
                {study.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {study.technologies.slice(0, 3).map((tech: string) => (
                  <span key={tech} className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
              <a 
                href={study.link || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors mt-auto"
              >
                View Live Deployment <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <MessageSquareQuote className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Client Endorsements</h2>
        </div>
        
        {loading ? (
          <div className="w-full h-32 border border-primary/20 bg-card/10 rounded-xl flex items-center justify-center text-primary">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading reviews from database...
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((test: any) => (
              <div key={test.id} className="relative bg-card border border-border p-8 rounded-2xl">
                <MessageSquareQuote className="absolute top-4 right-4 w-12 h-12 text-primary/10" />
                <div className="flex text-amber-500 mb-4">
                  {[...Array(test.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-lg italic text-foreground mb-6 line-clamp-4">
                  "{test.testimonial_text}"
                </p>
                <div className="flex items-center gap-4">
                  {test.image_url ? (
                    <img src={test.image_url} alt={test.author_name || 'Client'} className="w-12 h-12 rounded-full object-cover border border-primary/20" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {test.author_name ? test.author_name.charAt(0) : 'C'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold leading-tight">{test.author_name || 'Verified Client'}</h4>
                    <p className="text-xs text-muted-foreground">{test.author_title || 'Client'}{test.company_name ? `, ${test.company_name}` : ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full p-8 border border-border bg-card/30 rounded-xl text-center text-muted-foreground italic text-sm">
            Endorsements are being synchronized from the platform registry.
          </div>
        )}
      </div>
    </div>
  )
}
