/**
 * Gamified Exploration System
 * Enhances the achievement system with exploration rewards and discovery mechanics
 */

import { unlockAchievement, updateProgress, getAchievementState } from './achievements'

export interface ExplorationMilestone {
  id: string
  name: string
  description: string
  requirement: {
    type: 'pages_visited' | 'time_on_site' | 'features_used' | 'content_viewed'
    value: number
  }
  reward: {
    achievementId: string
    points: number
  }
}

export const EXPLORATION_MILESTONES: ExplorationMilestone[] = [
  {
    id: 'first_visit',
    name: 'First Steps',
    description: 'Visit the portfolio for the first time',
    requirement: {
      type: 'pages_visited',
      value: 1,
    },
    reward: {
      achievementId: 'first-visitor',
      points: 10,
    },
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Visit 5 different pages',
    requirement: {
      type: 'pages_visited',
      value: 5,
    },
    reward: {
      achievementId: 'explorer',
      points: 25,
    },
  },
  {
    id: 'deep_diver',
    name: 'Deep Diver',
    description: 'Visit 10 different pages',
    requirement: {
      type: 'pages_visited',
      value: 10,
    },
    reward: {
      achievementId: 'deep-diver',
      points: 50,
    },
  },
  {
    id: 'feature_master',
    name: 'Feature Master',
    description: 'Use 5 different features',
    requirement: {
      type: 'features_used',
      value: 5,
    },
    reward: {
      achievementId: 'feature-master',
      points: 30,
    },
  },
  {
    id: 'content_enthusiast',
    name: 'Content Enthusiast',
    description: 'View 10 pieces of content',
    requirement: {
      type: 'content_viewed',
      value: 10,
    },
    reward: {
      achievementId: 'content-enthusiast',
      points: 40,
    },
  },
]

export function trackPageVisit(page: string): void {
  const state = getAchievementState()
  const visitedPages = new Set(JSON.parse(localStorage.getItem('visited_pages') || '[]'))
  visitedPages.add(page)
  localStorage.setItem('visited_pages', JSON.stringify([...visitedPages]))

  // Check exploration milestones
  checkExplorationMilestones(visitedPages.size, 'pages_visited')
}

export function trackFeatureUsage(featureId: string): void {
  const usedFeatures = new Set(JSON.parse(localStorage.getItem('used_features') || '[]'))
  usedFeatures.add(featureId)
  localStorage.setItem('used_features', JSON.stringify([...usedFeatures]))

  // Check exploration milestones
  checkExplorationMilestones(usedFeatures.size, 'features_used')
}

export function trackContentView(contentId: string): void {
  const viewedContent = new Set(JSON.parse(localStorage.getItem('viewed_content') || '[]'))
  viewedContent.add(contentId)
  localStorage.setItem('viewed_content', JSON.stringify([...viewedContent]))

  // Check exploration milestones
  checkExplorationMilestones(viewedContent.size, 'content_viewed')
}

function checkExplorationMilestones(currentValue: number, type: ExplorationMilestone['requirement']['type']): void {
  EXPLORATION_MILESTONES.forEach((milestone) => {
    if (milestone.requirement.type === type && currentValue >= milestone.requirement.value) {
      const wasUnlocked = unlockAchievement(milestone.reward.achievementId)
      if (wasUnlocked && typeof window !== 'undefined' && (window as any).unlockAchievement) {
        ;(window as any).unlockAchievement(milestone.reward.achievementId)
      }
    } else if (milestone.requirement.type === type) {
      // Update progress
      updateProgress(
        milestone.reward.achievementId,
        currentValue,
        milestone.requirement.value
      )
    }
  })
}

export function getExplorationProgress(): {
  pagesVisited: number
  featuresUsed: number
  contentViewed: number
  milestonesCompleted: number
} {
  const visitedPages = new Set(JSON.parse(localStorage.getItem('visited_pages') || '[]'))
  const usedFeatures = new Set(JSON.parse(localStorage.getItem('used_features') || '[]'))
  const viewedContent = new Set(JSON.parse(localStorage.getItem('viewed_content') || '[]'))
  const state = getAchievementState()

  const milestonesCompleted = EXPLORATION_MILESTONES.filter((milestone) =>
    state.unlocked.includes(milestone.reward.achievementId)
  ).length

  return {
    pagesVisited: visitedPages.size,
    featuresUsed: usedFeatures.size,
    contentViewed: viewedContent.size,
    milestonesCompleted,
  }
}

