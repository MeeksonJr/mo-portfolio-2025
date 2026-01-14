'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, RotateCcw, Play, Pause, Trophy } from 'lucide-react'
import { saveScore, getHighScore, saveGameState, loadGameState, clearGameState } from '@/lib/games/game-storage'
import { toast } from 'sonner'

interface SpaceInvadersGameProps {
  musicEnabled: boolean
  musicVolume: number
}

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 500
const PLAYER_WIDTH = 50
const PLAYER_HEIGHT = 20
const PLAYER_SPEED = 5
const BULLET_SIZE = 5
const BULLET_SPEED = 7
const ENEMY_SIZE = 30
const ENEMY_ROWS = 5
const ENEMY_COLS = 10
const ENEMY_SPACING = 60

export default function SpaceInvadersGame({ musicEnabled, musicVolume }: SpaceInvadersGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const gameLoopRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const gameStateRef = useRef({
    playerX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    bullets: [] as Array<{ x: number; y: number }>,
    enemies: [] as Array<{ x: number; y: number; alive: boolean }>,
    enemyDirection: 1,
    enemySpeed: 1,
  })

  useEffect(() => {
    setHighScore(getHighScore('space-invaders'))
    const savedState = loadGameState('space-invaders')
    if (savedState) {
      gameStateRef.current = { ...gameStateRef.current, ...savedState }
    } else {
      initializeEnemies()
    }
  }, [])

  const initializeEnemies = () => {
    const enemies: Array<{ x: number; y: number; alive: boolean }> = []
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMY_COLS; col++) {
        enemies.push({
          x: col * ENEMY_SPACING + 50,
          y: row * ENEMY_SPACING + 50,
          alive: true,
        })
      }
    }
    gameStateRef.current.enemies = enemies
  }

  useEffect(() => {
    if (musicEnabled && audioRef.current) {
      audioRef.current.volume = musicVolume
      audioRef.current.loop = true
      audioRef.current.play().catch(() => {})
    } else if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [musicEnabled, musicVolume])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    const state = gameStateRef.current

    // Draw player
    ctx.fillStyle = '#0f0'
    ctx.fillRect(state.playerX, CANVAS_HEIGHT - 40, PLAYER_WIDTH, PLAYER_HEIGHT)

    // Draw bullets
    ctx.fillStyle = '#ff0'
    state.bullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, BULLET_SIZE, BULLET_SIZE)
    })

    // Draw enemies
    ctx.fillStyle = '#f00'
    state.enemies.forEach(enemy => {
      if (enemy.alive) {
        ctx.fillRect(enemy.x, enemy.y, ENEMY_SIZE, ENEMY_SIZE)
      }
    })

    // Draw score
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial'
    ctx.fillText(`Score: ${score}`, 10, 30)
  }, [score])

  const update = useCallback(() => {
    if (!isPlaying || isPaused) return

    const state = gameStateRef.current

    // Move bullets
    state.bullets = state.bullets
      .map(bullet => ({ x: bullet.x, y: bullet.y - BULLET_SPEED }))
      .filter(bullet => bullet.y > 0)

    // Move enemies
    let shouldMoveDown = false
    state.enemies.forEach(enemy => {
      if (enemy.alive) {
        enemy.x += state.enemySpeed * state.enemyDirection
        if (enemy.x <= 0 || enemy.x >= CANVAS_WIDTH - ENEMY_SIZE) {
          shouldMoveDown = true
        }
      }
    })

    if (shouldMoveDown) {
      state.enemyDirection *= -1
      state.enemies.forEach(enemy => {
        if (enemy.alive) {
          enemy.y += 20
        }
      })
    }

    // Check bullet-enemy collisions
    state.bullets.forEach((bullet, bulletIndex) => {
      state.enemies.forEach((enemy, enemyIndex) => {
        if (enemy.alive &&
            bullet.x < enemy.x + ENEMY_SIZE &&
            bullet.x + BULLET_SIZE > enemy.x &&
            bullet.y < enemy.y + ENEMY_SIZE &&
            bullet.y + BULLET_SIZE > enemy.y) {
          enemy.alive = false
          state.bullets.splice(bulletIndex, 1)
          setScore(prev => prev + 10)
        }
      })
    })

    // Check if all enemies defeated
    if (state.enemies.every(e => !e.alive)) {
      initializeEnemies()
      state.enemySpeed += 0.5
    }

    // Check if enemies reached player
    if (state.enemies.some(e => e.alive && e.y >= CANVAS_HEIGHT - 60)) {
      gameOver()
    }
  }, [isPlaying, isPaused])

  const gameOver = () => {
    setIsPlaying(false)
    setIsPaused(false)
    if (score > 0) {
      saveScore('space-invaders', score)
      if (score > highScore) {
        setHighScore(score)
      }
      toast.success(`Game Over! Score: ${score}`)
      
      // Track achievements
      if (typeof window !== 'undefined') {
        if (score >= 100 && (window as any).unlockAchievement) {
          ;(window as any).unlockAchievement('high-score')
        }
        
        const gamesPlayed = JSON.parse(localStorage.getItem('games_played') || '[]')
        if (!gamesPlayed.includes('space-invaders')) {
          gamesPlayed.push('space-invaders')
          localStorage.setItem('games_played', JSON.stringify(gamesPlayed))
          
          if (gamesPlayed.length >= 9 && (window as any).unlockAchievement) {
            ;(window as any).unlockAchievement('play-all-games')
          }
        }
      }
    }
  }

  useEffect(() => {
    if (isPlaying && !isPaused) {
      const gameLoop = () => {
        update()
        draw()
        gameLoopRef.current = requestAnimationFrame(gameLoop)
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      draw()
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [isPlaying, isPaused, update, draw])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isPlaying || isPaused) return

    const state = gameStateRef.current
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      state.playerX = Math.max(0, state.playerX - PLAYER_SPEED)
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      state.playerX = Math.min(CANVAS_WIDTH - PLAYER_WIDTH, state.playerX + PLAYER_SPEED)
    } else if (e.key === ' ' || e.key === 'ArrowUp') {
      e.preventDefault()
      // Shoot bullet
      if (state.bullets.length < 5) {
        state.bullets.push({
          x: state.playerX + PLAYER_WIDTH / 2 - BULLET_SIZE / 2,
          y: CANVAS_HEIGHT - 40,
        })
      }
    }
  }, [isPlaying, isPaused])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const startGame = () => {
    setIsPlaying(true)
    setIsPaused(false)
    gameStateRef.current = {
      playerX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      bullets: [],
      enemies: [],
      enemyDirection: 1,
      enemySpeed: 1,
    }
    initializeEnemies()
    setScore(0)
    clearGameState('space-invaders')
  }

  const pauseGame = () => {
    setIsPaused(!isPaused)
  }

  const saveGame = () => {
    saveGameState('space-invaders', gameStateRef.current)
    toast.success('Game saved!')
  }

  return (
    <Card className="bg-background/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Space Invaders</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">High: {highScore}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Score: {score}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-border rounded-lg bg-black"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button onClick={startGame} disabled={isPlaying && !isPaused}>
            {isPlaying ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Restart' : 'Start'}
          </Button>
          {isPlaying && (
            <Button onClick={pauseGame} variant="outline">
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          )}
          {isPlaying && (
            <Button onClick={saveGame} variant="outline" size="icon">
              <Save className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>Arrow Keys or A/D to move, Space to shoot</p>
        </div>
        {musicEnabled && (
          <audio ref={audioRef} src="/audio/game-music.mp3" loop />
        )}
      </CardContent>
    </Card>
  )
}

