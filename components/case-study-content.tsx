'use client'

import { Calendar, Eye, ArrowLeft, CheckCircle2, Lightbulb, Target, TrendingUp, DollarSign, Clock, Users, BarChart3, Download } from 'lucide-react'
import SmartRecommendations from '@/components/recommendations/smart-recommendations'
import SocialShareButton from '@/components/social-share/social-share-button'
import { ContentPerformanceInsights } from '@/components/analytics/content-performance-insights'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import PageContainer from '@/components/layout/page-container'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

interface CaseStudy {
  id: string
  title: string
  slug: string
  description: string | null
  content: string
  featured_image: string | null
  tech_stack: string[] | null
  published_at: string | null
  views: number
  problem_statement: string | null
  solution_overview: string | null
  challenges: string[] | null
  results: string | null
  lessons_learned: string[] | null
  metrics?: {
    performance_improvement?: string
    cost_savings?: string
    time_saved?: string
    user_growth?: string
    revenue_impact?: string
    efficiency_gain?: string
  } | null
  roi_data?: {
    investment?: string
    return?: string
    payback_period?: string
    annual_savings?: string
  } | null
}

interface RelatedCaseStudy {
  id: string
  title: string
  slug: string
  description: string | null
  featured_image: string | null
  published_at: string | null
}

interface CaseStudyContentProps {
  caseStudy: CaseStudy
  relatedCaseStudies: RelatedCaseStudy[]
}

export default function CaseStudyContent({ caseStudy, relatedCaseStudies }: CaseStudyContentProps) {

  return (
    <article>
      <PageContainer width="narrow" padding="default">
      {/* Back Button */}
      <Link
        href="/case-studies"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Case Studies</span>
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            Case Study
          </Badge>
        </div>
        <h1 className={cn(TYPOGRAPHY.h1, "mb-4")}>{caseStudy.title}</h1>
        {caseStudy.description && (
          <p className={cn(TYPOGRAPHY.lead, "text-muted-foreground mb-6")}>{caseStudy.description}</p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          {caseStudy.published_at && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(caseStudy.published_at), 'MMMM d, yyyy')}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{caseStudy.views || 0} views</span>
          </div>
          <div className="ml-auto">
            <SocialShareButton
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={caseStudy.title}
              description={caseStudy.description || ''}
              variant="ghost"
              size="sm"
              contentType="case-study"
              contentId={caseStudy.id}
            />
          </div>
        </div>

        {/* Featured Image */}
        {caseStudy.featured_image && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <img
              src={caseStudy.featured_image}
              alt={caseStudy.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tech Stack */}
        {caseStudy.tech_stack && caseStudy.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {caseStudy.tech_stack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {/* Problem Statement */}
      {caseStudy.problem_statement && (
        <section className="mb-8 p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Lightbulb className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2 text-red-900 dark:text-red-100">Problem Statement</h2>
              <p className="text-red-800 dark:text-red-200">{caseStudy.problem_statement}</p>
            </div>
          </div>
        </section>
      )}

      {/* Solution Overview */}
      {caseStudy.solution_overview && (
        <section className="mb-8 p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2 text-green-900 dark:text-green-100">Solution Overview</h2>
              <p className="text-green-800 dark:text-green-200">{caseStudy.solution_overview}</p>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="prose prose-lg prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:border prose-pre:border-border mb-8">
        <ReactMarkdown
          components={{
            code: ({ node, inline, className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto border border-border">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              )
            },
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-primary hover:underline font-medium"
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {children}
              </a>
            ),
            img: ({ src, alt }) => (
              <img
                src={src || ''}
                alt={alt || ''}
                className="rounded-lg my-6 w-full"
              />
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                {children}
              </blockquote>
            ),
          }}
        >
          {caseStudy.content}
        </ReactMarkdown>
      </div>

      {/* Challenges */}
      {caseStudy.challenges && caseStudy.challenges.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Challenges Faced</h2>
          <ul className="space-y-2">
            {caseStudy.challenges.map((challenge, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{challenge}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Results */}
      {caseStudy.results && (
        <section className="mb-8 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Results & Impact
          </h2>
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <ReactMarkdown>{caseStudy.results}</ReactMarkdown>
          </div>
        </section>
      )}

      {/* Metrics & KPIs */}
      {caseStudy.metrics && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Key Metrics & KPIs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {caseStudy.metrics.performance_improvement && (
              <div className="p-4 bg-muted rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Performance</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">{caseStudy.metrics.performance_improvement}</p>
                <p className="text-sm text-muted-foreground mt-1">Improvement</p>
              </div>
            )}
            {caseStudy.metrics.cost_savings && (
              <div className="p-4 bg-muted rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Cost Savings</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">{caseStudy.metrics.cost_savings}</p>
                <p className="text-sm text-muted-foreground mt-1">Annual savings</p>
              </div>
            )}
            {caseStudy.metrics.time_saved && (
              <div className="p-4 bg-muted rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold">Time Saved</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">{caseStudy.metrics.time_saved}</p>
                <p className="text-sm text-muted-foreground mt-1">Per week/month</p>
              </div>
            )}
            {caseStudy.metrics.user_growth && (
              <div className="p-4 bg-muted rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold">User Growth</h3>
                </div>
                <p className="text-2xl font-bold text-orange-600">{caseStudy.metrics.user_growth}</p>
                <p className="text-sm text-muted-foreground mt-1">Increase</p>
              </div>
            )}
            {caseStudy.metrics.revenue_impact && (
              <div className="p-4 bg-muted rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Revenue Impact</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">{caseStudy.metrics.revenue_impact}</p>
                <p className="text-sm text-muted-foreground mt-1">Additional revenue</p>
              </div>
            )}
            {caseStudy.metrics.efficiency_gain && (
              <div className="p-4 bg-muted rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-semibold">Efficiency</h3>
                </div>
                <p className="text-2xl font-bold text-indigo-600">{caseStudy.metrics.efficiency_gain}</p>
                <p className="text-sm text-muted-foreground mt-1">Gain</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ROI Section */}
      {caseStudy.roi_data && (
        <section className="mb-8 p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border border-green-200 dark:border-green-900">
          <h2 className="text-2xl font-semibold mb-6 text-green-900 dark:text-green-100 flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Return on Investment (ROI)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudy.roi_data.investment && (
              <div className="p-4 bg-background/50 rounded-lg">
                <h3 className="font-semibold mb-2 text-muted-foreground">Investment</h3>
                <p className="text-3xl font-bold">{caseStudy.roi_data.investment}</p>
              </div>
            )}
            {caseStudy.roi_data.return && (
              <div className="p-4 bg-background/50 rounded-lg">
                <h3 className="font-semibold mb-2 text-muted-foreground">Return</h3>
                <p className="text-3xl font-bold text-green-600">{caseStudy.roi_data.return}</p>
              </div>
            )}
            {caseStudy.roi_data.payback_period && (
              <div className="p-4 bg-background/50 rounded-lg">
                <h3 className="font-semibold mb-2 text-muted-foreground">Payback Period</h3>
                <p className="text-3xl font-bold">{caseStudy.roi_data.payback_period}</p>
              </div>
            )}
            {caseStudy.roi_data.annual_savings && (
              <div className="p-4 bg-background/50 rounded-lg">
                <h3 className="font-semibold mb-2 text-muted-foreground">Annual Savings</h3>
                <p className="text-3xl font-bold text-blue-600">{caseStudy.roi_data.annual_savings}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lessons Learned */}
      {caseStudy.lessons_learned && caseStudy.lessons_learned.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Lessons Learned</h2>
          <ul className="space-y-2">
            {caseStudy.lessons_learned.map((lesson, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{lesson}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Case Studies */}
      {relatedCaseStudies.length > 0 && (
        <section className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Related Case Studies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedCaseStudies.map((related) => (
              <Link
                key={related.id}
                href={`/case-studies/${related.slug}`}
                className="group glass rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {related.featured_image && (
                  <div className="relative w-full h-32 overflow-hidden">
                    <img
                      src={related.featured_image}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  {related.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {related.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Content Performance Insights */}
      <div className="mt-16 pt-8 border-t">
        <ContentPerformanceInsights
          contentId={caseStudy.id}
          contentType="case_study"
          contentTitle={caseStudy.title}
        />
      </div>

      {/* Smart Recommendations */}
      <SmartRecommendations
        currentItem={{
          id: caseStudy.id,
          title: caseStudy.title,
          description: caseStudy.description || undefined,
          tags: caseStudy.tech_stack || [],
          type: 'case-study',
          views: caseStudy.views,
          createdAt: caseStudy.published_at || undefined,
        }}
        contentType="case-study"
        limit={3}
      />
      </PageContainer>
    </article>
  )
}

