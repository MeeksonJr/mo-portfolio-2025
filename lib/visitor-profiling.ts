/**
 * Visitor Profiling System
 * Lightweight visitor type detection and content emphasis
 */

export type VisitorType = 'recruiter' | 'developer' | 'client' | 'student' | 'general'

export interface VisitorProfile {
  type: VisitorType
  confidence: number
  interests: string[]
  viewedContent: string[]
  timeOnSite: number
  lastVisit: string
}

const VISITOR_PROFILE_KEY = 'portfolio_visitor_profile'
const VIEWED_CONTENT_KEY = 'portfolio_viewed_content'
const TIME_ON_SITE_KEY = 'portfolio_time_on_site'
const FIRST_VISIT_KEY = 'portfolio_first_visit'

/**
 * Detect visitor type based on behavior
 */
export function detectVisitorType(): VisitorType {
  if (typeof window === 'undefined') return 'general'

  const viewedContent = JSON.parse(localStorage.getItem(VIEWED_CONTENT_KEY) || '[]')
  const searchQueries = JSON.parse(localStorage.getItem('portfolio_search_queries') || '[]')
  
  // Analyze viewed content types
  const contentTypes = viewedContent.map((item: string) => {
    if (item.includes('/projects')) return 'project'
    if (item.includes('/blog')) return 'blog'
    if (item.includes('/case-studies')) return 'case_study'
    if (item.includes('/resume') || item.includes('/contact')) return 'contact'
    if (item.includes('/skills-match') || item.includes('/assessment')) return 'assessment'
    return 'other'
  })

  // Recruiter signals: resume views, contact form, skills match
  const recruiterSignals = contentTypes.filter((t: string) => 
    t === 'contact' || t === 'assessment'
  ).length

  // Developer signals: projects, case studies, architecture
  const developerSignals = contentTypes.filter((t: string) => 
    t === 'project' || t === 'case_study'
  ).length

  // Client signals: case studies, testimonials
  const clientSignals = contentTypes.filter((t: string) => 
    t === 'case_study'
  ).length

  // Student signals: blog posts, learning paths
  const studentSignals = contentTypes.filter((t: string) => 
    t === 'blog'
  ).length

  // Determine type based on strongest signal
  const signals = [
    { type: 'recruiter' as VisitorType, score: recruiterSignals * 2 },
    { type: 'developer' as VisitorType, score: developerSignals * 1.5 },
    { type: 'client' as VisitorType, score: clientSignals * 1.5 },
    { type: 'student' as VisitorType, score: studentSignals },
  ]

  const strongest = signals.reduce((max, current) => 
    current.score > max.score ? current : max
  )

  return strongest.score > 0 ? strongest.type : 'general'
}

/**
 * Get or create visitor profile
 */
export function getVisitorProfile(): VisitorProfile {
  if (typeof window === 'undefined') {
    return {
      type: 'general',
      confidence: 0,
      interests: [],
      viewedContent: [],
      timeOnSite: 0,
      lastVisit: new Date().toISOString(),
    }
  }

  const stored = localStorage.getItem(VISITOR_PROFILE_KEY)
  if (stored) {
    const profile = JSON.parse(stored)
    // Update type detection
    profile.type = detectVisitorType()
    return profile
  }

  const firstVisit = localStorage.getItem(FIRST_VISIT_KEY) || new Date().toISOString()
  if (!localStorage.getItem(FIRST_VISIT_KEY)) {
    localStorage.setItem(FIRST_VISIT_KEY, firstVisit)
  }

  const viewedContent = JSON.parse(localStorage.getItem(VIEWED_CONTENT_KEY) || '[]')
  const timeOnSite = parseInt(localStorage.getItem(TIME_ON_SITE_KEY) || '0', 10)

  const profile: VisitorProfile = {
    type: detectVisitorType(),
    confidence: viewedContent.length > 0 ? Math.min(viewedContent.length / 5, 1) : 0,
    interests: extractInterests(viewedContent),
    viewedContent,
    timeOnSite,
    lastVisit: new Date().toISOString(),
  }

  saveVisitorProfile(profile)
  return profile
}

/**
 * Extract interests from viewed content
 */
function extractInterests(viewedContent: string[]): string[] {
  const interests: Set<string> = new Set()

  viewedContent.forEach((item: string) => {
    if (item.includes('/projects')) interests.add('projects')
    if (item.includes('/blog')) interests.add('blog')
    if (item.includes('/case-studies')) interests.add('case-studies')
    if (item.includes('/architecture')) interests.add('architecture')
    if (item.includes('/collaboration')) interests.add('collaboration')
    if (item.includes('/learning-paths')) interests.add('learning')
  })

  return Array.from(interests)
}

/**
 * Save visitor profile
 */
export function saveVisitorProfile(profile: VisitorProfile): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(VISITOR_PROFILE_KEY, JSON.stringify(profile))
}

/**
 * Track content view
 */
export function trackContentView(url: string): void {
  if (typeof window === 'undefined') return

  const viewed = JSON.parse(localStorage.getItem(VIEWED_CONTENT_KEY) || '[]')
  if (!viewed.includes(url)) {
    viewed.push(url)
    // Keep only last 20 views
    if (viewed.length > 20) {
      viewed.shift()
    }
    localStorage.setItem(VIEWED_CONTENT_KEY, JSON.stringify(viewed))
  }

  // Update profile
  const profile = getVisitorProfile()
  profile.viewedContent = viewed
  profile.interests = extractInterests(viewed)
  profile.type = detectVisitorType()
  profile.confidence = Math.min(viewed.length / 5, 1)
  profile.lastVisit = new Date().toISOString()
  saveVisitorProfile(profile)
}

/**
 * Update time on site
 */
export function updateTimeOnSite(seconds: number): void {
  if (typeof window === 'undefined') return
  const current = parseInt(localStorage.getItem(TIME_ON_SITE_KEY) || '0', 10)
  localStorage.setItem(TIME_ON_SITE_KEY, (current + seconds).toString())

  const profile = getVisitorProfile()
  profile.timeOnSite = current + seconds
  saveVisitorProfile(profile)
}

/**
 * Get content emphasis based on visitor type
 */
export function getContentEmphasis(visitorType: VisitorType): {
  highlightSections: string[]
  recommendedContent: string[]
} {
  const emphasis: Record<VisitorType, { highlightSections: string[]; recommendedContent: string[] }> = {
    recruiter: {
      highlightSections: ['experience', 'skills', 'achievements', 'testimonials'],
      recommendedContent: ['/resume', '/skills-match', '/testimonials', '/case-studies'],
    },
    developer: {
      highlightSections: ['projects', 'architecture', 'tech-stack', 'github'],
      recommendedContent: ['/projects', '/architecture', '/collaboration', '/demos'],
    },
    client: {
      highlightSections: ['case-studies', 'testimonials', 'services', 'contact'],
      recommendedContent: ['/case-studies', '/testimonials', '/contact', '/projects'],
    },
    student: {
      highlightSections: ['blog', 'learning-paths', 'resources', 'timeline'],
      recommendedContent: ['/blog', '/learning-paths', '/resources', '/timeline'],
    },
    general: {
      highlightSections: ['projects', 'about', 'contact'],
      recommendedContent: ['/projects', '/about', '/contact'],
    },
  }

  return emphasis[visitorType] || emphasis.general
}

