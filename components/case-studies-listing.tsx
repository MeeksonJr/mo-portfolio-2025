'use client'

import { useState, useMemo } from 'react'
import { Search, Calendar, Eye, Briefcase, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'

interface CaseStudy {
  id: string
  title: string
  slug: string
  description: string | null
  featured_image: string | null
  tech_stack: string[] | null
  published_at: string | null
  views: number
  created_at: string
}

interface CaseStudiesListingProps {
  caseStudies: CaseStudy[]
}

export default function CaseStudiesListing({ caseStudies }: CaseStudiesListingProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTechStack, setSelectedTechStack] = useState<string | null>(null)

  // Extract all unique tech stacks
  const allTechStacks = useMemo(() => {
    const techSet = new Set<string>()
    caseStudies.forEach((cs) => {
      cs.tech_stack?.forEach((tech) => techSet.add(tech))
    })
    return Array.from(techSet).sort()
  }, [caseStudies])

  // Filter case studies
  const filteredCaseStudies = useMemo(() => {
    let filtered = caseStudies

    if (searchQuery) {
      filtered = filtered.filter(
        (cs) =>
          cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cs.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cs.tech_stack?.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedTechStack) {
      filtered = filtered.filter((cs) =>
        cs.tech_stack?.some((tech) => tech === selectedTechStack)
      )
    }

    return filtered
  }, [caseStudies, searchQuery, selectedTechStack])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Case Studies</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          In-depth explorations of projects, challenges, solutions, and outcomes
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search case studies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tech Stack Filter */}
        {allTechStacks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Filter by Tech Stack:</p>
              {selectedTechStack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTechStack(null)}
                  className="h-7 text-xs"
                >
                  Clear filter
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTechStacks.map((tech) => (
                <Button
                  key={tech}
                  variant={selectedTechStack === tech ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    setSelectedTechStack(selectedTechStack === tech ? null : tech)
                  }
                  className="h-8 text-xs"
                >
                  {tech}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Case Studies Grid */}
      {filteredCaseStudies.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No case studies found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCaseStudies.map((caseStudy) => (
            <Link
              key={caseStudy.id}
              href={`/case-studies/${caseStudy.slug}`}
              className="group glass rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {caseStudy.featured_image && (
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={caseStudy.featured_image}
                    alt={caseStudy.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Case Study</span>
                </div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {caseStudy.title}
                </h2>
                {caseStudy.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {caseStudy.description}
                  </p>
                )}
                {caseStudy.tech_stack && caseStudy.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {caseStudy.tech_stack.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {caseStudy.tech_stack.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{caseStudy.tech_stack.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  {caseStudy.published_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(caseStudy.published_at), 'MMM d, yyyy')}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {caseStudy.views || 0}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-primary group-hover:gap-2 transition-all">
                  <span className="text-sm font-medium">Read case study</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

