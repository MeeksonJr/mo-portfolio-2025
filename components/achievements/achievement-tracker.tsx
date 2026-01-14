'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import {
  Achievement,
  getAchievementState,
  unlockAchievement,
  updateProgress,
  trackPageVisit,
  trackTimeOnSite,
  ACHIEVEMENTS,
} from '@/lib/achievements'
import { updateStreak, getStreakAchievement } from '@/lib/achievement-streaks'
import AchievementNotification from './achievement-notification'

export default function AchievementTracker() {
  const pathname = usePathname()
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  const checkAndUnlock = useCallback((achievementId: string): boolean => {
    console.log('🔍 Checking achievement:', achievementId)
    const state = getAchievementState()
    
    // Check if already unlocked
    if (state.unlocked.includes(achievementId)) {
      console.log('✅ Achievement already unlocked:', achievementId)
      return false
    }
    
    const wasUnlocked = unlockAchievement(achievementId)
    if (wasUnlocked) {
      const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId)
      if (achievement) {
        console.log('🎉 Achievement unlocked:', achievement.title)
        // Use setTimeout to ensure state update happens
        setTimeout(() => {
          setNewAchievement(achievement)
        }, 100)
      }
      return true
    }
    return false
  }, [])

  useEffect(() => {
    // Track page visit
    if (pathname) {
      trackPageVisit(pathname)
      // Update streak on page visit
      const { isNewStreak, streak } = updateStreak()
      if (isNewStreak && streak > 0) {
        // Check for streak achievements
        const streakAchievementId = getStreakAchievement(streak)
        if (streakAchievementId) {
          checkAndUnlock(streakAchievementId)
        }
      }
    }
  }, [pathname, checkAndUnlock])

  useEffect(() => {
    // Track time on site (check every minute)
    const interval = setInterval(() => {
      trackTimeOnSite()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  // Track specific page visits
  useEffect(() => {
    if (!pathname) return

    // Use a small delay to ensure page is fully loaded
    const timer = setTimeout(() => {
      const state = getAchievementState()

      // Track About page visit
      if (pathname === '/about' && !state.unlocked.includes('read-bio')) {
        console.log('📖 Tracking About page visit for achievement')
        checkAndUnlock('read-bio')
      }

      // Track Resources page visit
      if (pathname === '/resources' && !state.unlocked.includes('view-resources')) {
        console.log('📚 Tracking Resources page visit for achievement')
        checkAndUnlock('view-resources')
      }

      // Track Games page visit
      if (pathname === '/games' && !state.unlocked.includes('play-all-games')) {
        console.log('🎮 Tracking Games page visit for achievement')
        // This will be tracked when games are actually played
      }

      // Track Insights page visit
      if (pathname === '/insights' && !state.unlocked.includes('view-insights')) {
        console.log('📊 Tracking Insights page visit for achievement')
        checkAndUnlock('view-insights')
      }

      // Track Timeline page visit
      if (pathname === '/timeline' && !state.unlocked.includes('view-timeline')) {
        console.log('📅 Tracking Timeline page visit for achievement')
        checkAndUnlock('view-timeline')
      }

      // Track Code Hub visit
      if (pathname === '/code' && !state.unlocked.includes('code-playground')) {
        console.log('💻 Tracking Code Hub visit for achievement')
        checkAndUnlock('code-playground')
      }

      // Track Tools Hub visit
      if (pathname === '/tools' && !state.unlocked.includes('use-tools')) {
        console.log('🔧 Tracking Tools Hub visit for achievement')
        checkAndUnlock('use-tools')
      }

      // Track Skills Match visit
      if (pathname === '/skills-match' && !state.unlocked.includes('skills-match')) {
        console.log('🎯 Tracking Skills Match visit for achievement')
        checkAndUnlock('skills-match')
      }

      // Track ROI Calculator visit
      if (pathname === '/roi-calculator' && !state.unlocked.includes('roi-calculator')) {
        console.log('💰 Tracking ROI Calculator visit for achievement')
        checkAndUnlock('roi-calculator')
      }

      // Track Portfolio Comparison visit
      if (pathname === '/portfolio-comparison' && !state.unlocked.includes('portfolio-comparison')) {
        console.log('⚖️ Tracking Portfolio Comparison visit for achievement')
        checkAndUnlock('portfolio-comparison')
      }

      // Track Resume download (check if resume page was visited)
      if (pathname === '/resume' && !state.unlocked.includes('download-resume')) {
        // This will be tracked when resume is actually downloaded
      }

      // Track blog post reads
      if (pathname.startsWith('/blog/') && !state.unlocked.includes('read-blog-post')) {
        console.log('📝 Tracking blog post read for achievement')
        checkAndUnlock('read-blog-post')
        // Track progress for reading multiple posts
        const blogPostsRead = JSON.parse(localStorage.getItem('blog_posts_read') || '[]')
        if (!blogPostsRead.includes(pathname)) {
          blogPostsRead.push(pathname)
          localStorage.setItem('blog_posts_read', JSON.stringify(blogPostsRead))
          
          // Check for reading 5 posts
          if (blogPostsRead.length >= 5 && !state.unlocked.includes('read-5-blog-posts')) {
            checkAndUnlock('read-5-blog-posts')
          }
          // Check for reading 10 posts
          if (blogPostsRead.length >= 10 && !state.unlocked.includes('read-10-posts')) {
            checkAndUnlock('read-10-posts')
          }
        }
      }

      // Track case study reads
      if (pathname.startsWith('/case-studies/') && !state.unlocked.includes('read-case-study')) {
        console.log('🔍 Tracking case study read for achievement')
        checkAndUnlock('read-case-study')
        // Track progress for reading multiple case studies
        const caseStudiesRead = JSON.parse(localStorage.getItem('case_studies_read') || '[]')
        if (!caseStudiesRead.includes(pathname)) {
          caseStudiesRead.push(pathname)
          localStorage.setItem('case_studies_read', JSON.stringify(caseStudiesRead))
          
          // Check for reading 3 case studies
          if (caseStudiesRead.length >= 3 && !state.unlocked.includes('read-3-case-studies')) {
            checkAndUnlock('read-3-case-studies')
          }
        }
      }
    }, 500) // Wait 500ms for page to load

    return () => clearTimeout(timer)
  }, [pathname, checkAndUnlock])

  // Expose functions for other components to use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).unlockAchievement = (achievementId: string) => {
        console.log('🔓 Attempting to unlock achievement:', achievementId)
        return checkAndUnlock(achievementId)
      }
      ;(window as any).updateAchievementProgress = updateProgress
    }
  }, [checkAndUnlock])

  return (
    <AchievementNotification
      achievement={newAchievement}
      onClose={() => setNewAchievement(null)}
    />
  )
}

