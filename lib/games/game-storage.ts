/**
 * Game storage utilities for saving scores and game state
 */

export interface GameScore {
  game: string
  score: number
  level?: number
  timestamp: number
  metadata?: Record<string, any>
}

export interface GameSave {
  game: string
  state: any
  timestamp: number
}

const STORAGE_PREFIX = 'game_'

export function saveScore(game: string, score: number, level?: number, metadata?: Record<string, any>): void {
  if (typeof window === 'undefined') return

  const scores = getScores(game)
  const newScore: GameScore = {
    game,
    score,
    level,
    timestamp: Date.now(),
    metadata,
  }

  scores.push(newScore)
  // Keep only top 10 scores
  scores.sort((a, b) => b.score - a.score)
  const topScores = scores.slice(0, 10)

  localStorage.setItem(`${STORAGE_PREFIX}scores_${game}`, JSON.stringify(topScores))
}

export function getScores(game: string): GameScore[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}scores_${game}`)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getHighScore(game: string): number {
  const scores = getScores(game)
  return scores.length > 0 ? scores[0].score : 0
}

export function saveGameState(game: string, state: any): void {
  if (typeof window === 'undefined') return

  const save: GameSave = {
    game,
    state,
    timestamp: Date.now(),
  }

  localStorage.setItem(`${STORAGE_PREFIX}save_${game}`, JSON.stringify(save))
}

export function loadGameState(game: string): any | null {
  if (typeof window === 'undefined') return null

  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}save_${game}`)
    if (!data) return null

    const save: GameSave = JSON.parse(data)
    // Only load saves from last 24 hours
    if (Date.now() - save.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(`${STORAGE_PREFIX}save_${game}`)
      return null
    }

    return save.state
  } catch {
    return null
  }
}

export function clearGameState(game: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(`${STORAGE_PREFIX}save_${game}`)
}

