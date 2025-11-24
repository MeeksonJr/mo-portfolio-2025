/**
 * Shared TypeScript types and interfaces
 */

// API Response Types
export interface ApiResponse<T = unknown> {
  success?: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  error: string
  message?: string
  code?: string
  details?: Record<string, unknown>
  timestamp?: string
}

// Chat/Message Types
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
  isTyping?: boolean
}

export interface ChatHistory {
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

// GitHub Types
export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  topics: string[]
  is_featured?: boolean
}

export interface GitHubData {
  success: boolean
  repositories: GitHubRepository[]
  stats: {
    total_repos: number
    total_stars: number
    total_forks: number
    followers: number
    following: number
  }
  fetched_at: string
}

// Project Analysis Types
export interface ProjectAnalysis {
  repoUrl: string
  techStack: {
    languages: string[]
    frameworks: string[]
    databases: string[]
    tools: string[]
  }
  codeQuality: {
    score: number
    metrics: {
      testCoverage?: string
      documentation?: string
      codeStyle?: string
      dependencies?: string
    }
  }
  insights: {
    strengths: string[]
    improvements: string[]
    recommendations: string[]
  }
  documentation?: {
    readme: string
    apiDocs?: string
  }
  analyzedAt: string
}

// Content Types
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image?: string
  published_at?: string
  updated_at?: string
  tags?: string[]
  category?: string
  status: 'draft' | 'published'
}

export interface Project {
  id: string
  name: string
  description: string
  featured_image?: string
  github_url?: string
  homepage_url?: string
  tech_stack?: string[]
  created_at?: string
  updated_at?: string
  status: 'draft' | 'published'
}

export interface CaseStudy {
  id: string
  title: string
  slug: string
  description: string
  featured_image?: string
  content: string
  published_at?: string
  updated_at?: string
  tags?: string[]
  status: 'draft' | 'published'
}

// Analytics Types
export interface AnalyticsEvent {
  id?: string
  event_type: 'page_view' | 'click' | 'download' | 'form_submit' | 'feature_usage' | 'chat_usage'
  page_path: string
  metadata?: Record<string, unknown>
  timestamp?: string
}

// Visitor Profile Types
export interface VisitorProfile {
  type: 'recruiter' | 'developer' | 'client' | 'student' | 'general'
  confidence: number
  interests: string[]
  pagesViewed: string[]
  timeOnSite: number
  lastUpdated: string
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type Nullable<T> = T | null
export type Maybe<T> = T | null | undefined

