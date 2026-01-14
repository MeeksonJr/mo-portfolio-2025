'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, RotateCcw, Play, Pause, Trophy } from 'lucide-react'
import { saveScore, getHighScore, saveGameState, loadGameState, clearGameState } from '@/lib/games/game-storage'
import { toast } from 'sonner'

interface TetrisGameProps {
  musicEnabled: boolean
  musicVolume: number
}

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const CELL_SIZE = 20

type Cell = number | null
type Board = Cell[][]

const TETROMINOES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
]

export default function TetrisGame({ musicEnabled, musicVolume }: TetrisGameProps) {
  const [board, setBoard] = useState<Board>(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)))
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentPiece, setCurrentPiece] = useState<{ shape: number[][]; x: number; y: number; color: number } | null>(null)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setHighScore(getHighScore('tetris'))
  }, [])

  const getRandomPiece = () => {
    const shape = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)]
    return {
      shape,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2),
      y: 0,
      color: Math.floor(Math.random() * 7) + 1,
    }
  }

  const canPlace = (piece: typeof currentPiece, board: Board, dx = 0, dy = 0) => {
    if (!piece) return false
    const { shape, x, y } = piece
    const newX = x + dx
    const newY = y + dy

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const boardX = newX + col
          const boardY = newY + row
          if (
            boardX < 0 ||
            boardX >= BOARD_WIDTH ||
            boardY >= BOARD_HEIGHT ||
            (boardY >= 0 && board[boardY][boardX] !== null)
          ) {
            return false
          }
        }
      }
    }
    return true
  }

  const placePiece = useCallback(() => {
    if (!currentPiece) return

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row])
      const { shape, x, y, color } = currentPiece

      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const boardY = y + row
            const boardX = x + col
            if (boardY >= 0) {
              newBoard[boardY][boardX] = color
            }
          }
        }
      }

      // Check for completed lines
      let linesCleared = 0
      for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
        if (newBoard[row].every(cell => cell !== null)) {
          newBoard.splice(row, 1)
          newBoard.unshift(Array(BOARD_WIDTH).fill(null))
          linesCleared++
          row++
        }
      }

      if (linesCleared > 0) {
        setLines(prev => {
          const newLines = prev + linesCleared
          setLevel(Math.floor(newLines / 10) + 1)
          setScore(prev => {
            const points = [0, 40, 100, 300, 1200][linesCleared] * (level + 1)
            const newScore = prev + points
            if (newScore > highScore) {
              setHighScore(newScore)
            }
            return newScore
          })
          return newLines
        })
      }

      return newBoard
    })

    // Check game over
    const newPiece = getRandomPiece()
    if (!canPlace(newPiece, board)) {
      gameOver()
      return
    }
    setCurrentPiece(newPiece)
  }, [currentPiece, board, level, highScore])

  const movePiece = (dx: number, dy: number) => {
    if (!currentPiece || !isPlaying || isPaused) return

    if (canPlace(currentPiece, board, dx, dy)) {
      setCurrentPiece({ ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy })
    } else if (dy > 0) {
      placePiece()
    }
  }

  const rotatePiece = () => {
    if (!currentPiece || !isPlaying || isPaused) return

    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    )

    const rotatedPiece = { ...currentPiece, shape: rotated }
    if (canPlace(rotatedPiece, board)) {
      setCurrentPiece(rotatedPiece)
    }
  }

  useEffect(() => {
    if (isPlaying && !isPaused && currentPiece) {
      gameLoopRef.current = setInterval(() => {
        movePiece(0, 1)
      }, 1000 - level * 50)
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
  }, [isPlaying, isPaused, currentPiece, level])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isPlaying) return

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        movePiece(-1, 0)
        break
      case 'ArrowRight':
        e.preventDefault()
        movePiece(1, 0)
        break
      case 'ArrowDown':
        e.preventDefault()
        movePiece(0, 1)
        break
      case 'ArrowUp':
      case ' ':
        e.preventDefault()
        rotatePiece()
        break
    }
  }, [isPlaying, isPaused])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const startGame = () => {
    const newBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))
    setBoard(newBoard)
    setScore(0)
    setLevel(1)
    setLines(0)
    setIsPlaying(true)
    setIsPaused(false)
    setCurrentPiece(getRandomPiece())
    clearGameState('tetris')
  }

  const pauseGame = () => {
    setIsPaused(!isPaused)
  }

  const gameOver = () => {
    setIsPlaying(false)
    setIsPaused(false)
    if (score > 0) {
      saveScore('tetris', score, level)
      toast.success(`Game Over! Score: ${score}, Level: ${level}`)
    }
  }

  const saveGame = () => {
    saveGameState('tetris', { board, score, level, lines, currentPiece })
    toast.success('Game saved!')
  }

  return (
    <Card className="bg-background/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tetris</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>High: {highScore}</span>
            </div>
            <div>Score: {score}</div>
            <div>Level: {level}</div>
            <div>Lines: {lines}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div
            className="border-2 border-border rounded-lg bg-muted/30 backdrop-blur-sm grid"
            style={{
              width: BOARD_WIDTH * CELL_SIZE,
              height: BOARD_HEIGHT * CELL_SIZE,
              gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
            }}
          >
            {board.flat().map((cell, index) => (
              <div
                key={index}
                className={`border border-border/50 ${
                  cell !== null ? `bg-primary` : ''
                }`}
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
              />
            ))}
            {currentPiece &&
              currentPiece.shape.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  if (!cell) return null
                  const x = currentPiece.x + colIndex
                  const y = currentPiece.y + rowIndex
                  if (y < 0 || y >= BOARD_HEIGHT || x < 0 || x >= BOARD_WIDTH) return null
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="absolute bg-primary border border-border/50"
                      style={{
                        left: x * CELL_SIZE,
                        top: y * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                      }}
                    />
                  )
                })
              )}
          </div>
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
          Arrow keys to move, Up/Space to rotate
        </p>
      </CardContent>
    </Card>
  )
}

