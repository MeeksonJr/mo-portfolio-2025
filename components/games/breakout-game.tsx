'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, RotateCcw, Play, Pause, Trophy } from 'lucide-react'
import { saveScore, getHighScore, saveGameState, loadGameState, clearGameState } from '@/lib/games/game-storage'
import { toast } from 'sonner'

interface BreakoutGameProps {
  musicEnabled: boolean
  musicVolume: number
}

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 500
const PADDLE_WIDTH = 80
const PADDLE_HEIGHT = 10
const BALL_SIZE = 10
const BRICK_ROWS = 5
const BRICK_COLS = 8
const BRICK_WIDTH = 45
const BRICK_HEIGHT = 20
const BRICK_GAP = 5

type Brick = { x: number; y: number; destroyed: boolean }

export default function BreakoutGame({ musicEnabled, musicVolume }: BreakoutGameProps) {
  const [paddleX, setPaddleX] = useState(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2)
  const [ballX, setBallX] = useState(CANVAS_WIDTH / 2)
  const [ballY, setBallY] = useState(CANVAS_HEIGHT - 50)
  const [ballDX, setBallDX] = useState(3)
  const [ballDY, setBallDY] = useState(-3)
  const [bricks, setBricks] = useState<Brick[]>([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number | null>(null)

  useEffect(() => {
    setHighScore(getHighScore('breakout'))
    initializeBricks()
  }, [])

  const initializeBricks = () => {
    const newBricks: Brick[] = []
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        newBricks.push({
          x: col * (BRICK_WIDTH + BRICK_GAP) + BRICK_GAP,
          y: row * (BRICK_HEIGHT + BRICK_GAP) + BRICK_GAP + 50,
          destroyed: false,
        })
      }
    }
    setBricks(newBricks)
  }

  const gameLoop = useCallback(() => {
    if (!isPlaying || isPaused) return

    setBallX(prev => {
      let newX = prev + ballDX
      if (newX <= BALL_SIZE || newX >= CANVAS_WIDTH - BALL_SIZE) {
        setBallDX(prev => -prev)
        newX = prev
      }
      return newX
    })

    setBallY(prev => {
      let newY = prev + ballDY
      if (newY <= BALL_SIZE) {
        setBallDY(prev => -prev)
        newY = prev
      } else if (newY >= CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_SIZE) {
        if (prev >= paddleX && prev <= paddleX + PADDLE_WIDTH) {
          setBallDY(prev => -Math.abs(prev))
          newY = prev
        } else if (newY >= CANVAS_HEIGHT - BALL_SIZE) {
          setLives(prev => {
            const newLives = prev - 1
            if (newLives <= 0) {
              gameOver()
            } else {
              setBallX(CANVAS_WIDTH / 2)
              setBallY(CANVAS_HEIGHT - 50)
              setBallDX(3)
              setBallDY(-3)
            }
            return newLives
          })
          newY = CANVAS_HEIGHT - 50
        }
      }
      return newY
    })

    // Check brick collisions
    setBricks(prev => {
      const updated = [...prev]
      let hit = false
      updated.forEach(brick => {
        if (
          !brick.destroyed &&
          ballX >= brick.x &&
          ballX <= brick.x + BRICK_WIDTH &&
          ballY >= brick.y &&
          ballY <= brick.y + BRICK_HEIGHT
        ) {
          brick.destroyed = true
          hit = true
          setScore(prevScore => {
            const newScore = prevScore + 10
            if (newScore > highScore) {
              setHighScore(newScore)
            }
            return newScore
          })
        }
      })

      if (hit) {
        setBallDY(prev => -prev)
      }

      if (updated.every(b => b.destroyed)) {
        toast.success('You won!')
        gameOver()
      }

      return updated
    })
  }, [isPlaying, isPaused, ballDX, ballDY, ballX, ballY, paddleX, highScore])

  useEffect(() => {
    if (isPlaying && !isPaused) {
      gameLoopRef.current = requestAnimationFrame(function animate() {
        gameLoop()
        gameLoopRef.current = requestAnimationFrame(animate)
      })
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
        gameLoopRef.current = null
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [isPlaying, isPaused, gameLoop])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying || isPaused) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      const newX = e.clientX - rect.left - PADDLE_WIDTH / 2
      setPaddleX(Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, newX)))
    }
  }

  const startGame = () => {
    setBallX(CANVAS_WIDTH / 2)
    setBallY(CANVAS_HEIGHT - 50)
    setBallDX(3)
    setBallDY(-3)
    setPaddleX(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2)
    setScore(0)
    setLives(3)
    setIsPlaying(true)
    setIsPaused(false)
    initializeBricks()
    clearGameState('breakout')
  }

  const pauseGame = () => {
    setIsPaused(!isPaused)
  }

  const gameOver = () => {
    setIsPlaying(false)
    setIsPaused(false)
    if (score > 0) {
      saveScore('breakout', score)
      toast.success(`Game Over! Score: ${score}`)
    }
  }

  const saveGame = () => {
    saveGameState('breakout', { paddleX, ballX, ballY, ballDX, ballDY, bricks, score, lives })
    toast.success('Game saved!')
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw bricks
    bricks.forEach(brick => {
      if (!brick.destroyed) {
        ctx.fillStyle = '#3b82f6'
        ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT)
        ctx.strokeStyle = '#1e40af'
        ctx.strokeRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT)
      }
    })

    // Draw paddle
    ctx.fillStyle = '#10b981'
    ctx.fillRect(paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT)

    // Draw ball
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(ballX, ballY, BALL_SIZE, 0, Math.PI * 2)
    ctx.fill()
  }, [bricks, paddleX, ballX, ballY])

  return (
    <Card className="bg-background/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Breakout</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>High: {highScore}</span>
            </div>
            <div>Score: {score}</div>
            <div>Lives: {lives}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseMove={handleMouseMove}
            className="border-2 border-border rounded-lg bg-muted/30 backdrop-blur-sm cursor-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            onClick={isPlaying ? pauseGame : startGame}
            className="bg-background/80 backdrop-blur-sm"
          >
            {isPlaying ? (
              isPaused ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              )
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
          {isPlaying && (
            <Button
              onClick={saveGame}
              variant="outline"
              className="bg-background/80 backdrop-blur-sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
          <Button
            onClick={startGame}
            variant="outline"
            className="bg-background/80 backdrop-blur-sm"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Move mouse to control paddle. Break all bricks to win!
        </p>
      </CardContent>
    </Card>
  )
}

