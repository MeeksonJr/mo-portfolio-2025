'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, RotateCcw, Play, Pause, Trophy } from 'lucide-react'
import { saveScore, getHighScore, saveGameState, loadGameState, clearGameState } from '@/lib/games/game-storage'
import { toast } from 'sonner'

interface PongGameProps {
  musicEnabled: boolean
  musicVolume: number
}

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 400
const PADDLE_WIDTH = 10
const PADDLE_HEIGHT = 80
const BALL_SIZE = 10
const PADDLE_SPEED = 5

export default function PongGame({ musicEnabled, musicVolume }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState({ player: 0, ai: 0 })
  const [highScore, setHighScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const gameLoopRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const gameStateRef = useRef({
    playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballSpeedX: 5,
    ballSpeedY: 3,
    playerScore: 0,
    aiScore: 0,
  })

  useEffect(() => {
    setHighScore(getHighScore('pong'))
    const savedState = loadGameState('pong')
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
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw center line
    ctx.strokeStyle = '#fff'
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(CANVAS_WIDTH / 2, 0)
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)
    ctx.stroke()
    ctx.setLineDash([])

    const state = gameStateRef.current

    // Draw paddles
    ctx.fillStyle = '#fff'
    ctx.fillRect(20, state.playerY, PADDLE_WIDTH, PADDLE_HEIGHT)
    ctx.fillRect(CANVAS_WIDTH - 30, state.aiY, PADDLE_WIDTH, PADDLE_HEIGHT)

    // Draw ball
    ctx.beginPath()
    ctx.arc(state.ballX, state.ballY, BALL_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw scores
    ctx.font = '32px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(state.playerScore.toString(), CANVAS_WIDTH / 4, 50)
    ctx.fillText(state.aiScore.toString(), (3 * CANVAS_WIDTH) / 4, 50)
  }, [])

  const update = useCallback(() => {
    if (!isPlaying || isPaused) return

    const state = gameStateRef.current

    // Move ball
    state.ballX += state.ballSpeedX
    state.ballY += state.ballSpeedY

    // Ball collision with top/bottom
    if (state.ballY <= BALL_SIZE / 2 || state.ballY >= CANVAS_HEIGHT - BALL_SIZE / 2) {
      state.ballSpeedY = -state.ballSpeedY
    }

    // AI paddle movement
    const aiCenter = state.aiY + PADDLE_HEIGHT / 2
    if (aiCenter < state.ballY - 10) {
      state.aiY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.aiY + PADDLE_SPEED)
    } else if (aiCenter > state.ballY + 10) {
      state.aiY = Math.max(0, state.aiY - PADDLE_SPEED)
    }

    // Ball collision with paddles
    if (state.ballX <= 30 && state.ballX >= 20 && 
        state.ballY >= state.playerY && state.ballY <= state.playerY + PADDLE_HEIGHT) {
      state.ballSpeedX = -state.ballSpeedX
      state.ballX = 30
    }

    if (state.ballX >= CANVAS_WIDTH - 30 && state.ballX <= CANVAS_WIDTH - 20 &&
        state.ballY >= state.aiY && state.ballY <= state.aiY + PADDLE_HEIGHT) {
      state.ballSpeedX = -state.ballSpeedX
      state.ballX = CANVAS_WIDTH - 30
    }

    // Score points
    if (state.ballX < 0) {
      state.aiScore++
      setScore(prev => ({ ...prev, ai: prev.ai + 1 }))
      resetBall()
    } else if (state.ballX > CANVAS_WIDTH) {
      state.playerScore++
      setScore(prev => ({ ...prev, player: prev.player + 1 }))
      resetBall()
    }
  }, [isPlaying, isPaused])

  const resetBall = () => {
    const state = gameStateRef.current
    state.ballX = CANVAS_WIDTH / 2
    state.ballY = CANVAS_HEIGHT / 2
    state.ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 5
    state.ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 3
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
    if (!isPlaying) return

    const state = gameStateRef.current
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      state.playerY = Math.max(0, state.playerY - PADDLE_SPEED)
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      state.playerY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.playerY + PADDLE_SPEED)
    }
  }, [isPlaying])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const startGame = () => {
    setIsPlaying(true)
    setIsPaused(false)
    gameStateRef.current.playerScore = 0
    gameStateRef.current.aiScore = 0
    resetBall()
    setScore({ player: 0, ai: 0 })
    clearGameState('pong')
  }

  const pauseGame = () => {
    setIsPaused(!isPaused)
  }

  const saveGame = () => {
    saveGameState('pong', gameStateRef.current)
    toast.success('Game saved!')
  }

  const handleSaveScore = () => {
    const totalScore = score.player
    if (totalScore > 0) {
      saveScore('pong', totalScore)
      if (totalScore > highScore) {
        setHighScore(totalScore)
      }
      toast.success('Score saved!')
    }
  }

  return (
    <Card className="bg-background/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pong</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">High: {highScore}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Score: {score.player}</span>
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
          {score.player > 0 && (
            <Button onClick={handleSaveScore} variant="outline">
              Save Score
            </Button>
          )}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>Use Arrow Keys or W/S to move your paddle</p>
        </div>
        {musicEnabled && (
          <audio ref={audioRef} src="/audio/game-music.mp3" loop />
        )}
      </CardContent>
    </Card>
  )
}

