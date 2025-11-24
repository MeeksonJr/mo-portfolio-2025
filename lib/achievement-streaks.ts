/**
 * Achievement Streak System
 * Tracks consecutive days of visiting and unlocking achievements
 */

const STREAK_KEY = 'portfolio_achievement_streak'
const LAST_STREAK_DATE_KEY = 'portfolio_last_streak_date'

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string | null
  totalDays: number
}

export function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastVisitDate: null,
      totalDays: 0,
    }
  }

  const stored = localStorage.getItem(STREAK_KEY)
  const lastDate = localStorage.getItem(LAST_STREAK_DATE_KEY)
  
  if (!stored) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastVisitDate: null,
      totalDays: 0,
    }
  }

  const data = JSON.parse(stored) as StreakData
  return {
    ...data,
    lastVisitDate: lastDate,
  }
}

export function updateStreak(): { isNewStreak: boolean; streak: number } {
  if (typeof window === 'undefined') {
    return { isNewStreak: false, streak: 0 }
  }

  const today = new Date().toDateString()
  const streakData = getStreakData()
  const lastVisit = streakData.lastVisitDate

  // If visited today, no update needed
  if (lastVisit === today) {
    return { isNewStreak: false, streak: streakData.currentStreak }
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()

  let newStreak = 1
  let isNewStreak = false

  if (lastVisit === yesterdayStr) {
    // Continue streak
    newStreak = streakData.currentStreak + 1
    isNewStreak = newStreak > streakData.currentStreak
  } else if (lastVisit && lastVisit !== today) {
    // Streak broken, start over
    newStreak = 1
    isNewStreak = true
  } else {
    // First visit
    isNewStreak = true
  }

  const updatedData: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, streakData.longestStreak),
    lastVisitDate: today,
    totalDays: streakData.totalDays + (lastVisit !== today ? 1 : 0),
  }

  localStorage.setItem(STREAK_KEY, JSON.stringify(updatedData))
  localStorage.setItem(LAST_STREAK_DATE_KEY, today)

  return { isNewStreak, streak: newStreak }
}

export function getStreakAchievement(streak: number): string | null {
  if (streak >= 30) return 'streak-30'
  if (streak >= 14) return 'streak-14'
  if (streak >= 7) return 'streak-7'
  if (streak >= 3) return 'streak-3'
  return null
}

