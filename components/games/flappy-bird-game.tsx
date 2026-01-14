'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, RotateCcw, Play, Pause, Trophy } from 'lucide-react'
import { saveScore, getHighScore, saveGameState, loadGameState, clearGameState } from '@/lib/games/game-storage'
import { toast } from 'sonner'

interface FlappyBirdGameProps {
  musicEnabled: boolean
  musicVolume: number
}

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600
const BIRD_SIZE = 30
const GRAVITY = 0.5
const JUMP_STRENGTH = -8
const PIPE_WIDTH = 60
const PIPE_GAP = 150
const PIPE_SPEED = 3

export default function FlappyBirdGame({ musicEnabled, musicVolume }: FlappyBirdGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const gameLoopRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const gameStateRef = useRef({
    birdY: CANVAS_HEIGHT / 2,
    birdVelocity: 0,
    pipes: [] as Array<{ x: number; topHeight: number }>,
    frameCount: 0,
  })

  useEffect(() => {
    setHighScore(getHighScore('flappy-bird'))
    const savedState = loadGameState('flappy-bird')
    if (savedState) {
      gameStateRef.current = { ...gameStateRef.current, ...savedState }
    }
  }, [])

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
    ctx.fillStyle = '#87CEEB'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    const state = gameStateRef.current

    // Draw bird
    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.arc(CANVAS_WIDTH / 2, state.birdY, BIRD_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw pipes
    ctx.fillStyle = '#228B22'
    state.pipes.forEach(pipe => {
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight)
      ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT - pipe.topHeight - PIPE_GAP)
    })

    // Draw score
    ctx.fillStyle = '#000'
    ctx.font = '32px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(score.toString(), CANVAS_WIDTH / 2, 50)
  }, [score])

  const update = useCallback(() => {
    if (!isPlaying || isPaused) return

    const state = gameStateRef.current

    // Update bird
    state.birdVelocity += GRAVITY
    state.birdY += state.birdVelocity

    // Generate new pipes
    state.frameCount++
    if (state.frameCount % 100 === 0) {
      state.pipes.push({
        x: CANVAS_WIDTH,
        topHeight: Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50,
      })
    }

    // Move pipes
    state.pipes = state.pipes.map(pipe => ({
      ...pipe,
      x: pipe.x - PIPE_SPEED,
    })).filter(pipe => pipe.x + PIPE_WIDTH > 0)

    // Check collisions
    const birdX = CANVAS_WIDTH / 2
    const birdLeft = birdX - BIRD_SIZE / 2
    const birdRight = birdX + BIRD_SIZE / 2
    const birdTop = state.birdY - BIRD_SIZE / 2
    const birdBottom = state.birdY + BIRD_SIZE / 2

    // Ground/ceiling collision
    if (birdTop <= 0 || birdBottom >= CANVAS_HEIGHT) {
      gameOver()
      return
    }

    // Pipe collision
    for (const pipe of state.pipes) {
      if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH) {
        if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
          gameOver()
          return
        }
      }

      // Score point
      if (pipe.x + PIPE_WIDTH < birdLeft && !pipe.scored) {
        setScore(prev => prev + 1)
        pipe.scored = true
      }
    }
  }, [isPlaying, isPaused])

  const gameOver = () => {
    setIsPlaying(false)
    setIsPaused(false)
    if (score > 0) {
      saveScore('flappy-bird', score)
      if (score > highScore) {
        setHighScore(score)
      }
      toast.success(`Game Over! Score: ${score}`)
      
      // Track achievements
      if (typeof window !== 'undefined') {
        if (score >= 10 && (window as any).unlockAchievement) {
          ;(window as any).unlockAchievement('high-score')
        }
        
        const gamesPlayed = JSON.parse(localStorage.getItem('games_played') || '[]')
        if (!gamesPlayed.includes('flappy-bird')) {
          gamesPlayed.push('flappy-bird')
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

    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      e.preventDefault()
      gameStateRef.current.birdVelocity = JUMP_STRENGTH
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
      birdY: CANVAS_HEIGHT / 2,
      birdVelocity: 0,
      pipes: [],
      frameCount: 0,
    }
    setScore(0)
    clearGameState('flappy-bird')
  }

  const pauseGame = () => {
    setIsPaused(!isPaused)
  }

  const saveGame = () => {
    saveGameState('flappy-bird', gameStateRef.current)
    toast.success('Game saved!')
  }

  return (
    <Card className="bg-background/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Flappy Bird</CardTitle>
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
            className="border-2 border-border rounded-lg"
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
          <p>Press Space, Arrow Up, or W to flap</p>
        </div>
        {musicEnabled && (
          <audio ref={audioRef} src="/audio/game-music.mp3" loop />
        )}
      </CardContent>
    </Card>
  )
}

