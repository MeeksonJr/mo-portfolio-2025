/**
 * Onboarding tour steps for first-time visitors
 * Guides users through key features of the portfolio
 */

export interface OnboardingStep {
  id: string
  target: string // CSS selector or element ID
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  action?: {
    label: string
    onClick: () => void
  }
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    target: 'body',
    title: 'Welcome to My Portfolio! 👋',
    content: 'Explore my work, skills, and projects. This quick tour will show you around.',
    position: 'center',
  },
  {
    id: 'hero',
    target: '#main-content',
    title: 'Hero Section',
    content: 'This is where you can learn about me and download my resume. Check out the "Open to Work" badge!',
    position: 'bottom',
  },
  {
    id: 'navigation',
    target: 'nav',
    title: 'Navigation',
    content: 'Use the navigation menu to explore different sections: Projects, Blog, Resume, and more.',
    position: 'bottom',
  },
  {
    id: 'projects',
    target: '#projects',
    title: 'Projects',
    content: 'View my featured projects and case studies. Each project includes live demos and GitHub links.',
    position: 'top',
  },
  {
    id: 'games',
    target: 'a[href="/games"]',
    title: 'Games Hub',
    content: 'Play interactive games I built! Try Snake, Tetris, Memory, and more. Track your high scores!',
    position: 'bottom',
  },
  {
    id: 'resume',
    target: 'a[href="/resume"]',
    title: 'Resume Hub',
    content: 'View, download, or generate resumes in multiple formats. Perfect for recruiters!',
    position: 'bottom',
  },
  {
    id: 'preferences',
    target: '[data-user-preferences]',
    title: 'User Preferences',
    content: 'Customize your experience! Adjust theme, font size, animations, and more in the preferences menu.',
    position: 'left',
  },
  {
    id: 'complete',
    target: 'body',
    title: 'You\'re All Set! 🎉',
    content: 'Feel free to explore! You can restart this tour anytime from the preferences menu.',
    position: 'center',
  },
]

export const STORAGE_KEY = 'onboarding_completed'

export function hasCompletedOnboarding(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

export function markOnboardingComplete(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, 'true')
}

export function resetOnboarding(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

