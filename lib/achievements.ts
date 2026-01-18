export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'exploration' | 'engagement' | 'social' | 'milestone'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  unlockedAt?: string
}

export interface AchievementProgress {
  achievementId: string
  progress: number
  maxProgress: number
  unlocked: boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'read-bio',
    title: 'Life Story Explorer',
    description: 'Read the complete About page',
    icon: '📖',
    category: 'exploration',
    rarity: 'common',
    points: 10,
  },
  {
    id: 'view-all-projects',
    title: 'Project Collector',
    description: 'View all projects on the projects page',
    icon: '🚀',
    category: 'exploration',
    rarity: 'common',
    points: 15,
  },
  {
    id: 'chat-ai',
    title: 'AI Conversationalist',
    description: 'Have a conversation with the AI chatbot',
    icon: '🤖',
    category: 'engagement',
    rarity: 'common',
    points: 10,
  },
  {
    id: 'read-blog-post',
    title: 'Knowledge Seeker',
    description: 'Read a complete blog post',
    icon: '📝',
    category: 'exploration',
    rarity: 'common',
    points: 10,
  },
  {
    id: 'read-case-study',
    title: 'Case Study Analyst',
    description: 'Read a complete case study',
    icon: '🔍',
    category: 'exploration',
    rarity: 'common',
    points: 15,
  },
  {
    id: 'contact-form',
    title: 'Network Builder',
    description: 'Submit the contact form',
    icon: '✉️',
    category: 'social',
    rarity: 'common',
    points: 20,
  },
  {
    id: 'view-resources',
    title: 'Resource Explorer',
    description: 'Visit the resources page',
    icon: '📚',
    category: 'exploration',
    rarity: 'common',
    points: 10,
  },
  {
    id: 'music-player',
    title: 'Music Enthusiast',
    description: 'Play music using the music player',
    icon: '🎵',
    category: 'engagement',
    rarity: 'common',
    points: 10,
  },
  {
    id: 'voice-command',
    title: 'Voice Commander',
    description: 'Use voice commands for navigation',
    icon: '🎤',
    category: 'engagement',
    rarity: 'rare',
    points: 25,
  },
  {
    id: 'read-5-blog-posts',
    title: 'Blog Enthusiast',
    description: 'Read 5 blog posts',
    icon: '📚',
    category: 'exploration',
    rarity: 'rare',
    points: 30,
  },
  {
    id: 'read-3-case-studies',
    title: 'Case Study Expert',
    description: 'Read 3 case studies',
    icon: '🎓',
    category: 'exploration',
    rarity: 'rare',
    points: 35,
  },
  {
    id: 'command-palette',
    title: 'Power User',
    description: 'Use the command palette (Ctrl+K)',
    icon: '⌨️',
    category: 'engagement',
    rarity: 'rare',
    points: 20,
  },
  {
    id: 'explore-all-pages',
    title: 'Site Navigator',
    description: 'Visit all main pages (Home, About, Blog, Projects, Contact)',
    icon: '🗺️',
    category: 'exploration',
    rarity: 'epic',
    points: 50,
  },
  {
    id: 'deep-dive',
    title: 'Deep Diver',
    description: 'Spend more than 10 minutes exploring the site',
    icon: '⏱️',
    category: 'engagement',
    rarity: 'epic',
    points: 40,
  },
  {
    id: 'return-visitor',
    title: 'Loyal Visitor',
    description: 'Return to the site 3 times',
    icon: '🔄',
    category: 'social',
    rarity: 'rare',
    points: 30,
  },
  {
    id: 'streak-3',
    title: 'On Fire',
    description: 'Visit 3 days in a row',
    icon: '🔥',
    category: 'milestone',
    rarity: 'common',
    points: 20,
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Visit 7 days in a row',
    icon: '⚡',
    category: 'milestone',
    rarity: 'rare',
    points: 50,
  },
  {
    id: 'streak-14',
    title: 'Dedicated Explorer',
    description: 'Visit 14 days in a row',
    icon: '🌟',
    category: 'milestone',
    rarity: 'epic',
    points: 100,
  },
  {
    id: 'streak-30',
    title: 'Legendary Streak',
    description: 'Visit 30 days in a row',
    icon: '👑',
    category: 'milestone',
    rarity: 'legendary',
    points: 200,
  },
  {
    id: 'play-all-games',
    title: 'Game Master',
    description: 'Play all 6 games in the Games Hub',
    icon: '🎮',
    category: 'engagement',
    rarity: 'rare',
    points: 40,
  },
  {
    id: 'high-score',
    title: 'High Scorer',
    description: 'Achieve a high score in any game',
    icon: '🏆',
    category: 'engagement',
    rarity: 'common',
    points: 15,
  },
  {
    id: 'download-resume',
    title: 'Resume Collector',
    description: 'Download the resume',
    icon: '📄',
    category: 'engagement',
    rarity: 'common',
    points: 20,
  },
  {
    id: 'use-tools',
    title: 'Tool Explorer',
    description: 'Use any tool in the Tools Hub',
    icon: '🔧',
    category: 'engagement',
    rarity: 'common',
    points: 15,
  },
  {
    id: 'view-insights',
    title: 'Data Analyst',
    description: 'Visit the Insights Hub',
    icon: '📊',
    category: 'exploration',
    rarity: 'common',
    points: 15,
  },
  {
    id: 'read-10-posts',
    title: 'Blog Devotee',
    description: 'Read 10 blog posts',
    icon: '📖',
    category: 'exploration',
    rarity: 'epic',
    points: 60,
  },
  {
    id: 'share-content',
    title: 'Content Sharer',
    description: 'Share any content (blog post, project, etc.)',
    icon: '📤',
    category: 'social',
    rarity: 'rare',
    points: 30,
  },
  {
    id: 'newsletter-signup',
    title: 'Newsletter Subscriber',
    description: 'Subscribe to the newsletter',
    icon: '📧',
    category: 'social',
    rarity: 'rare',
    points: 35,
  },
  {
    id: 'feedback-given',
    title: 'Feedback Provider',
    description: 'Provide feedback on any content',
    icon: '💬',
    category: 'social',
    rarity: 'common',
    points: 20,
  },
  {
    id: 'code-playground',
    title: 'Code Explorer',
    description: 'Use the Code Playground',
    icon: '💻',
    category: 'engagement',
    rarity: 'common',
    points: 15,
  },
  {
    id: 'portfolio-comparison',
    title: 'Portfolio Analyzer',
    description: 'Use the Portfolio Comparison tool',
    icon: '⚖️',
    category: 'engagement',
    rarity: 'rare',
    points: 25,
  },
  {
    id: 'skills-match',
    title: 'Skills Matcher',
    description: 'Use the Skills Matching tool',
    icon: '🎯',
    category: 'engagement',
    rarity: 'rare',
    points: 25,
  },
  {
    id: 'roi-calculator',
    title: 'ROI Analyst',
    description: 'Use the ROI Calculator',
    icon: '💰',
    category: 'engagement',
    rarity: 'rare',
    points: 25,
  },
  {
    id: 'view-timeline',
    title: 'Timeline Explorer',
    description: 'View the interactive timeline',
    icon: '📅',
    category: 'exploration',
    rarity: 'common',
    points: 15,
  },
  {
    id: 'view-certifications',
    title: 'Certification Viewer',
    description: 'View the certifications section',
    icon: '🏅',
    category: 'exploration',
    rarity: 'common',
    points: 15,
  },
  {
    id: 'view-skills-matrix',
    title: 'Skills Analyst',
    description: 'View the Skills Proficiency Matrix',
    icon: '📈',
    category: 'exploration',
    rarity: 'common',
    points: 15,
  },
  {
    id: 'complete-all-achievements',
    title: 'Achievement Master',
    description: 'Unlock all achievements',
    icon: '🌟',
    category: 'milestone',
    rarity: 'legendary',
    points: 500,
  },
]

const STORAGE_KEY = 'portfolio_achievements'
const PROGRESS_KEY = 'portfolio_achievement_progress'
const VISIT_COUNT_KEY = 'portfolio_visit_count'
const LAST_VISIT_KEY = 'portfolio_last_visit'

export interface AchievementState {
  unlocked: string[]
  progress: Record<string, AchievementProgress>
  visitCount: number
  lastVisit: string | null
  sessionStartTime: number | null
}

export function getAchievementState(): AchievementState {
  if (typeof window === 'undefined') {
    return {
      unlocked: [],
      progress: {},
      visitCount: 0,
      lastVisit: null,
      sessionStartTime: null,
    }
  }

  const unlocked = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}')
  const visitCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10)
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY)
  const sessionStartTime = sessionStorage.getItem('session_start_time')
    ? parseInt(sessionStorage.getItem('session_start_time') || '0', 10)
    : Date.now()

  // Initialize session start time if not set
  if (!sessionStorage.getItem('session_start_time')) {
    sessionStorage.setItem('session_start_time', sessionStartTime.toString())
  }

  return {
    unlocked,
    progress,
    visitCount,
    lastVisit,
    sessionStartTime,
  }
}

export function saveAchievementState(state: AchievementState): void {
  if (typeof window === 'undefined') return

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.unlocked))
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress))
  localStorage.setItem(VISIT_COUNT_KEY, state.visitCount.toString())
  if (state.lastVisit) {
    localStorage.setItem(LAST_VISIT_KEY, state.lastVisit)
  }
}

export function unlockAchievement(achievementId: string): boolean {
  const state = getAchievementState()
  
  if (state.unlocked.includes(achievementId)) {
    return false // Already unlocked
  }

  state.unlocked.push(achievementId)
  state.unlocked.sort()

  // Update progress
  if (state.progress[achievementId]) {
    state.progress[achievementId].unlocked = true
    state.progress[achievementId].progress = state.progress[achievementId].maxProgress
  }

  saveAchievementState(state)
  return true // Newly unlocked
}

export function updateProgress(achievementId: string, progress: number, maxProgress: number): boolean {
  const state = getAchievementState()
  
  // Don't update if already unlocked
  if (state.unlocked.includes(achievementId)) {
    return false
  }

  const currentProgress = state.progress[achievementId] || {
    achievementId,
    progress: 0,
    maxProgress,
    unlocked: false,
  }

  currentProgress.progress = Math.min(progress, maxProgress)
  currentProgress.maxProgress = maxProgress

  // Check if achievement should be unlocked
  if (currentProgress.progress >= maxProgress && !currentProgress.unlocked) {
    state.progress[achievementId] = currentProgress
    saveAchievementState(state)
    return unlockAchievement(achievementId)
  }

  state.progress[achievementId] = currentProgress
  saveAchievementState(state)
  return false
}

export function trackPageVisit(page: string): void {
  const state = getAchievementState()
  const now = new Date().toISOString()

  // Track visit count
  const isNewVisit = !state.lastVisit || 
    new Date(now).getTime() - new Date(state.lastVisit).getTime() > 24 * 60 * 60 * 1000 // 24 hours

  if (isNewVisit) {
    state.visitCount++
    state.lastVisit = now
  }

  // Track pages visited for "explore-all-pages" achievement
  const visitedPages = new Set(
    JSON.parse(localStorage.getItem('visited_pages') || '[]')
  )
  visitedPages.add(page)

  localStorage.setItem('visited_pages', JSON.stringify([...visitedPages]))

  // Check if all main pages visited
  const mainPages = ['/', '/about', '/blog', '/projects', '/contact']
  const allVisited = mainPages.every((p) => visitedPages.has(p))

  if (allVisited && !state.unlocked.includes('explore-all-pages')) {
    const wasUnlocked = unlockAchievement('explore-all-pages')
    if (wasUnlocked && typeof window !== 'undefined' && (window as any).unlockAchievement) {
      // Trigger notification via global function
      ;(window as any).unlockAchievement('explore-all-pages')
    }
  }

  // Check return visitor achievement
  if (state.visitCount >= 3 && !state.unlocked.includes('return-visitor')) {
    const wasUnlocked = unlockAchievement('return-visitor')
    if (wasUnlocked && typeof window !== 'undefined' && (window as any).unlockAchievement) {
      // Trigger notification via global function
      ;(window as any).unlockAchievement('return-visitor')
    }
  }

  saveAchievementState(state)
}

export function trackTimeOnSite(): void {
  const state = getAchievementState()
  
  if (!state.sessionStartTime) return

  const timeSpent = (Date.now() - state.sessionStartTime) / 1000 / 60 // minutes

  if (timeSpent >= 10 && !state.unlocked.includes('deep-dive')) {
    const wasUnlocked = unlockAchievement('deep-dive')
    if (wasUnlocked && typeof window !== 'undefined' && (window as any).unlockAchievement) {
      // Trigger notification via global function
      ;(window as any).unlockAchievement('deep-dive')
    }
  }
}

export function getTotalPoints(): number {
  const state = getAchievementState()
  return state.unlocked.reduce((total, id) => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === id)
    return total + (achievement?.points || 0)
  }, 0)
}

export function getUnlockedAchievements(): Achievement[] {
  const state = getAchievementState()
  return ACHIEVEMENTS.filter((a) => state.unlocked.includes(a.id))
}

export function getAchievementProgress(achievementId: string): AchievementProgress | null {
  const state = getAchievementState()
  return state.progress[achievementId] || null
}

export function getAllAchievementsWithProgress(): Array<Achievement & { progress: AchievementProgress | null }> {
  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    progress: getAchievementProgress(achievement.id),
    unlockedAt: getAchievementState().unlocked.includes(achievement.id)
      ? new Date().toISOString()
      : undefined,
  }))
}

/**
 * Check if all achievements are unlocked
 */
export function checkAllAchievementsUnlocked(): boolean {
  const state = getAchievementState()
  return state.unlocked.length === ACHIEVEMENTS.length
}

/**
 * Check and unlock "complete-all-achievements" if all are unlocked
 */
export function checkCompleteAllAchievements(): void {
  if (checkAllAchievementsUnlocked()) {
    const state = getAchievementState()
    if (!state.unlocked.includes('complete-all-achievements')) {
      unlockAchievement('complete-all-achievements')
      if (typeof window !== 'undefined' && (window as any).unlockAchievement) {
        ;(window as any).unlockAchievement('complete-all-achievements')
      }
    }
  }
}

