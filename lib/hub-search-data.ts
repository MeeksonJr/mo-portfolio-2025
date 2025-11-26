/**
 * Hub search data structure
 * Contains all hubs and their tabs for search integration
 */

import {
  Code2,
  Play,
  FileCode,
  Terminal,
  BookOpen,
  Eye,
  Sparkles,
  FileCheck,
  Wrench,
  Target,
  Calculator,
  MessageCircle,
  CreditCard,
  BarChart3,
  Activity,
  Calendar,
  Network,
  User,
  Building2,
  TrendingUp,
  LayoutDashboard,
} from 'lucide-react'

export interface HubTab {
  value: string
  label: string
  description: string
  keywords: string[]
  icon: typeof Code2
}

export interface Hub {
  id: string
  name: string
  description: string
  url: string
  icon: typeof Code2
  tabs: HubTab[]
  keywords: string[]
}

export const HUB_SEARCH_DATA: Hub[] = [
  {
    id: 'code',
    name: 'Code Hub',
    description: 'Interactive code playgrounds, reviews, and portfolio source code',
    url: '/code',
    icon: Code2,
    keywords: ['code', 'programming', 'developer', 'coding', 'snippets', 'playground', 'review', 'terminal', 'library'],
    tabs: [
      {
        value: 'playground',
        label: 'Playground',
        description: 'Interactive code editor',
        keywords: ['playground', 'editor', 'code editor', 'interactive', 'experiment'],
        icon: Play,
      },
      {
        value: 'review',
        label: 'Review',
        description: 'Code review simulator',
        keywords: ['review', 'code review', 'feedback', 'comments', 'simulator'],
        icon: Code2,
      },
      {
        value: 'portfolio',
        label: 'Portfolio Code',
        description: 'View portfolio source',
        keywords: ['portfolio', 'source code', 'github', 'repository', 'open source'],
        icon: FileCode,
      },
      {
        value: 'terminal',
        label: 'Terminal',
        description: 'Live coding terminal',
        keywords: ['terminal', 'command line', 'cli', 'bash', 'shell', 'live coding'],
        icon: Terminal,
      },
      {
        value: 'library',
        label: 'Library',
        description: 'Code snippets library',
        keywords: ['library', 'snippets', 'code snippets', 'examples', 'templates'],
        icon: BookOpen,
      },
    ],
  },
  {
    id: 'resume',
    name: 'Resume Hub',
    description: 'View, generate, and download resumes in multiple formats',
    url: '/resume',
    icon: FileCheck,
    keywords: ['resume', 'cv', 'curriculum vitae', 'career', 'job', 'application', 'ats', 'recruiter'],
    tabs: [
      {
        value: 'view',
        label: 'My Resume',
        description: 'View and download resume',
        keywords: ['resume', 'view', 'download', 'pdf', 'cv', 'curriculum vitae'],
        icon: Eye,
      },
      {
        value: 'generate',
        label: 'Generate',
        description: 'Create your own resume',
        keywords: ['generate', 'create', 'builder', 'resume builder', 'wizard', 'template'],
        icon: Sparkles,
      },
      {
        value: 'summary',
        label: 'Quick Summary',
        description: 'Recruiter quick reference',
        keywords: ['summary', 'quick summary', 'recruiter', 'candidate', 'overview', 'profile'],
        icon: FileCheck,
      },
    ],
  },
  {
    id: 'tools',
    name: 'Tools Hub',
    description: 'Interactive tools for project analysis, skills matching, and ROI calculation',
    url: '/tools',
    icon: Wrench,
    keywords: ['tools', 'utilities', 'analyzer', 'calculator', 'assessment', 'contact', 'business card'],
    tabs: [
      {
        value: 'analyzer',
        label: 'Project Analyzer',
        description: 'AI-powered GitHub repository analysis',
        keywords: ['analyzer', 'project analyzer', 'github', 'repository', 'analysis', 'ai', 'insights'],
        icon: Sparkles,
      },
      {
        value: 'skills',
        label: 'Skills Match',
        description: 'Match skills to job requirements',
        keywords: ['skills', 'match', 'matching', 'job requirements', 'qualifications', 'competencies'],
        icon: Target,
      },
      {
        value: 'roi',
        label: 'ROI Calculator',
        description: 'Calculate business impact and ROI',
        keywords: ['roi', 'calculator', 'return on investment', 'business impact', 'value', 'metrics'],
        icon: Calculator,
      },
      {
        value: 'assessment',
        label: 'Assessment',
        description: 'Quick candidate assessment',
        keywords: ['assessment', 'evaluation', 'candidate', 'recruiter', 'screening', 'qualification'],
        icon: FileCheck,
      },
      {
        value: 'contact',
        label: 'Contact Hub',
        description: 'Universal contact options',
        keywords: ['contact', 'reach out', 'connect', 'communication', 'email', 'phone', 'social'],
        icon: MessageCircle,
      },
      {
        value: 'card',
        label: 'Business Card',
        description: 'Digital business card with QR code',
        keywords: ['business card', 'card', 'qr code', 'vcard', 'contact card', 'digital card'],
        icon: CreditCard,
      },
    ],
  },
  {
    id: 'insights',
    name: 'Insights Hub',
    description: 'Portfolio analytics, activity feeds, and data visualizations',
    url: '/insights',
    icon: BarChart3,
    keywords: ['insights', 'analytics', 'data', 'statistics', 'metrics', 'activity', 'recommendations', 'timeline', 'skills'],
    tabs: [
      {
        value: 'analytics',
        label: 'Analytics',
        description: 'Portfolio statistics and metrics',
        keywords: ['analytics', 'statistics', 'metrics', 'data', 'views', 'engagement', 'performance'],
        icon: BarChart3,
      },
      {
        value: 'activity',
        label: 'Activity',
        description: 'Real-time activity feed',
        keywords: ['activity', 'feed', 'timeline', 'updates', 'recent', 'live', 'real-time'],
        icon: Activity,
      },
      {
        value: 'recommendations',
        label: 'Recommendations',
        description: 'AI-powered content suggestions',
        keywords: ['recommendations', 'suggestions', 'ai', 'personalized', 'content', 'curated'],
        icon: Sparkles,
      },
      {
        value: 'timeline',
        label: 'Project Timeline',
        description: 'Interactive project timeline',
        keywords: ['timeline', 'projects', 'chronological', 'history', 'evolution', 'progress'],
        icon: Calendar,
      },
      {
        value: 'skills',
        label: 'Skill Tree',
        description: 'Interactive skill visualization',
        keywords: ['skills', 'skill tree', 'visualization', 'competencies', 'expertise', 'proficiency'],
        icon: Network,
      },
    ],
  },
  {
    id: 'about',
    name: 'About Hub',
    description: 'Personal information, workspace tour, and learning paths',
    url: '/about',
    icon: User,
    keywords: ['about', 'bio', 'personal', 'story', 'journey', 'workspace', 'office', 'uses', 'setup', 'learning'],
    tabs: [
      {
        value: 'bio',
        label: 'Bio',
        description: 'About me and my journey',
        keywords: ['bio', 'biography', 'about', 'story', 'journey', 'background', 'personal'],
        icon: User,
      },
      {
        value: 'uses',
        label: 'Uses',
        description: 'Hardware, software, and tools',
        keywords: ['uses', 'setup', 'tools', 'hardware', 'software', 'stack', 'equipment', 'gear'],
        icon: Wrench,
      },
      {
        value: 'office',
        label: 'Office Tour',
        description: 'Virtual workspace tour',
        keywords: ['office', 'workspace', 'tour', 'setup', 'environment', '360', 'virtual'],
        icon: Building2,
      },
      {
        value: 'activity',
        label: 'Activity Status',
        description: 'Current activity and availability',
        keywords: ['activity', 'status', 'availability', 'online', 'offline', 'current', 'now'],
        icon: Activity,
      },
      {
        value: 'progress',
        label: 'Progress',
        description: 'Progress indicators and tracking',
        keywords: ['progress', 'tracking', 'indicators', 'growth', 'development', 'achievements'],
        icon: TrendingUp,
      },
      {
        value: 'learning',
        label: 'Learning Paths',
        description: 'Personalized learning roadmaps',
        keywords: ['learning', 'paths', 'roadmap', 'education', 'courses', 'skills', 'development'],
        icon: BookOpen,
      },
      {
        value: 'dashboard',
        label: 'Dashboard',
        description: 'Personal exploration dashboard',
        keywords: ['dashboard', 'personal', 'exploration', 'stats', 'overview', 'summary'],
        icon: LayoutDashboard,
      },
    ],
  },
]

/**
 * Search all hubs and tabs for matching content
 */
export function searchHubs(query: string): Array<{ hub: Hub; tab?: HubTab; matchType: 'hub' | 'tab' }> {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return []

  const results: Array<{ hub: Hub; tab?: HubTab; matchType: 'hub' | 'tab' }> = []

  HUB_SEARCH_DATA.forEach((hub) => {
    // Check if hub matches
    const hubMatches =
      hub.name.toLowerCase().includes(lowerQuery) ||
      hub.description.toLowerCase().includes(lowerQuery) ||
      hub.keywords.some((keyword) => keyword.toLowerCase().includes(lowerQuery))

    if (hubMatches) {
      results.push({ hub, matchType: 'hub' })
    }

    // Check if any tab matches
    hub.tabs.forEach((tab) => {
      const tabMatches =
        tab.label.toLowerCase().includes(lowerQuery) ||
        tab.description.toLowerCase().includes(lowerQuery) ||
        tab.keywords.some((keyword) => keyword.toLowerCase().includes(lowerQuery))

      if (tabMatches) {
        results.push({ hub, tab, matchType: 'tab' })
      }
    })
  })

  return results
}

/**
 * Get hub by ID
 */
export function getHubById(id: string): Hub | undefined {
  return HUB_SEARCH_DATA.find((hub) => hub.id === id)
}

/**
 * Get all hub names for filters
 */
export function getAllHubNames(): string[] {
  return HUB_SEARCH_DATA.map((hub) => hub.name)
}

