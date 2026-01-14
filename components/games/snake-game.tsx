'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, RotateCcw, Play, Pause, Trophy } from 'lucide-react'
import { saveScore, getHighScore, saveGameState, loadGameState, clearGameState } from '@/lib/games/game-storage'
import { toast } from 'sonner'

interface SnakeGameProps {
  musicEnabled: boolean
  musicVolume: number
}

type Direction = 'up' | 'down' | 'left' | 'right'
type Position = { x: number; y: number }

const GRID_SIZE = 20
const CELL_SIZE = 20

export default function SnakeGame({ musicEnabled, musicVolume }: SnakeGameProps) {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Direction>('right')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setHighScore(getHighScore('snake'))
    const savedState = loadGameState('snake')
    if (savedState) {
      setSnake(savedState.snake)
      setFood(savedState.food)
      setDirection(savedState.direction)
      setScore(savedState.score)
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

  const generateFood = useCallback((): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [snake])

  const moveSnake = useCallback(() => {
    if (!isPlaying || isPaused) return

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] }

      switch (direction) {
        case 'up':
          head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE
          break
        case 'down':
          head.y = (head.y + 1) % GRID_SIZE
          break
        case 'left':
          head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE
          break
        case 'right':
          head.x = (head.x + 1) % GRID_SIZE
          break
      }

      // Check collision with self
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver()
        return prevSnake
      }

      const newSnake = [head, ...prevSnake]

      // Check if food eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10
          if (newScore > highScore) {
            setHighScore(newScore)
          }
          return newScore
        })
        setFood(generateFood())
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, isPlaying, isPaused, generateFood, highScore])

  useEffect(() => {
    if (isPlaying && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, 150)
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
        gameLoopRef.current = null
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [isPlaying, isPaused, moveSnake])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isPlaying) return

    const keyMap: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
    }

    const newDirection = keyMap[e.key]
    if (newDirection) {
      e.preventDefault()
      setDirection(prev => {
        // Prevent reversing into self
        if (
          (prev === 'up' && newDirection === 'down') ||
          (prev === 'down' && newDirection === 'up') ||
          (prev === 'left' && newDirection === 'right') ||
          (prev === 'right' && newDirection === 'left')
        ) {
          return prev
        }
        return newDirection
      })
    }
  }, [isPlaying])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const startGame = () => {
    setIsPlaying(true)
    setIsPaused(false)
    setSnake([{ x: 10, y: 10 }])
    setFood(generateFood())
    setDirection('right')
    setScore(0)
    clearGameState('snake')
  }

  const pauseGame = () => {
    setIsPaused(!isPaused)
  }

  const gameOver = () => {
    setIsPlaying(false)
    setIsPaused(false)
    if (score > 0) {
      saveScore('snake', score)
      toast.success(`Game Over! Score: ${score}`)
    }
  }

  const saveGame = () => {
    saveGameState('snake', { snake, food, direction, score })
    toast.success('Game saved!')
  }

  const handleSaveScore = () => {
    if (score > 0) {
      saveScore('snake', score)
      toast.success('Score saved!')
    }
  }

  return (
    <Card className="bg-background/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Snake Game</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">High: {highScore}</span>
            </div>
            <div className="text-sm font-semibold">Score: {score}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Canvas */}
        <div className="flex justify-center">
          <div
            className="border-2 border-border rounded-lg bg-muted/30 backdrop-blur-sm"
            style={{
              width: GRID_SIZE * CELL_SIZE,
              height: GRID_SIZE * CELL_SIZE,
              position: 'relative',
            }}
          >
            {/* Food */}
            <div
              className="absolute bg-red-500 rounded-full"
              style={{
                left: food.x * CELL_SIZE,
                top: food.y * CELL_SIZE,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
              }}
            />
            {/* Snake */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className={`absolute rounded-sm ${
                  index === 0 ? 'bg-green-500' : 'bg-green-600'
                }`}
                style={{
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
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
              Save Game
            </Button>
          )}
          <Button
            onClick={handleSaveScore}
            variant="outline"
            className="bg-background/80 backdrop-blur-sm"
            disabled={score === 0}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Save Score
          </Button>
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
          Use arrow keys or WASD to control the snake
        </p>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src="/audio/game-music.mp3"
          preload="auto"
          style={{ display: 'none' }}
        />
      </CardContent>
    </Card>
  )
}

