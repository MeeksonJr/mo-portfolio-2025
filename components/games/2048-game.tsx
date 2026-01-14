'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, RotateCcw, Play, Pause, Trophy } from 'lucide-react'
import { saveScore, getHighScore, saveGameState, loadGameState, clearGameState } from '@/lib/games/game-storage'
import { toast } from 'sonner'

interface Game2048Props {
  musicEnabled: boolean
  musicVolume: number
}

const GRID_SIZE = 4
const CELL_SIZE = 80
const CELL_GAP = 10

export default function Game2048({ musicEnabled, musicVolume }: Game2048Props) {
  const [grid, setGrid] = useState<number[][]>([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setHighScore(getHighScore('2048'))
    const savedState = loadGameState('2048')
    if (savedState && savedState.grid) {
      setGrid(savedState.grid)
      setScore(savedState.score || 0)
      setIsPlaying(true)
    } else {
      initializeGame()
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

  const initializeGame = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0))
    addRandomTile(newGrid)
    addRandomTile(newGrid)
    setGrid(newGrid)
    setScore(0)
    setIsPlaying(true)
  }

  const addRandomTile = (grid: number[][]) => {
    const emptyCells: Array<[number, number]> = []
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) {
          emptyCells.push([i, j])
        }
      }
    }
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      grid[row][col] = Math.random() < 0.9 ? 2 : 4
    }
  }

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!isPlaying || isPaused) return

    setGrid(currentGrid => {
      const newGrid = currentGrid.map(row => [...row])
      let moved = false
      let newScore = score

      const rotate = (grid: number[][], times: number) => {
        let rotated = grid.map(row => [...row])
        for (let i = 0; i < times; i++) {
          rotated = rotated[0].map((_, i) => rotated.map(row => row[i]).reverse())
        }
        return rotated
      }

      let workingGrid = newGrid
      if (direction === 'right') workingGrid = rotate(workingGrid, 2)
      if (direction === 'up') workingGrid = rotate(workingGrid, 3)
      if (direction === 'down') workingGrid = rotate(workingGrid, 1)

      // Move and merge
      for (let i = 0; i < GRID_SIZE; i++) {
        const row = workingGrid[i].filter(cell => cell !== 0)
        const merged: number[] = []
        for (let j = 0; j < row.length; j++) {
          if (j < row.length - 1 && row[j] === row[j + 1]) {
            merged.push(row[j] * 2)
            newScore += row[j] * 2
            j++
            moved = true
          } else {
            merged.push(row[j])
          }
        }
        while (merged.length < GRID_SIZE) {
          merged.push(0)
        }
        if (JSON.stringify(workingGrid[i]) !== JSON.stringify(merged)) {
          moved = true
        }
        workingGrid[i] = merged
      }

      // Rotate back
      if (direction === 'right') workingGrid = rotate(workingGrid, 2)
      if (direction === 'up') workingGrid = rotate(workingGrid, 1)
      if (direction === 'down') workingGrid = rotate(workingGrid, 3)

      if (moved) {
        addRandomTile(workingGrid)
        setScore(newScore)
        
        // Check for win (2048)
        const hasWon = workingGrid.some(row => row.some(cell => cell === 2048))
        if (hasWon && !localStorage.getItem('2048-won')) {
          toast.success('You reached 2048! 🎉')
          localStorage.setItem('2048-won', 'true')
        }

        // Check for game over
        const canMove = workingGrid.some((row, i) => 
          row.some((cell, j) => {
            if (cell === 0) return true
            if (i < GRID_SIZE - 1 && workingGrid[i + 1][j] === cell) return true
            if (j < GRID_SIZE - 1 && workingGrid[i][j + 1] === cell) return true
            return false
          })
        )

        if (!canMove) {
          gameOver(newScore)
          return currentGrid
        }

        return workingGrid
      }

      return currentGrid
    })
  }, [isPlaying, isPaused, score])

  const gameOver = (finalScore: number) => {
    setIsPlaying(false)
    if (finalScore > 0) {
      saveScore('2048', finalScore)
      if (finalScore > highScore) {
        setHighScore(finalScore)
      }
      toast.success(`Game Over! Score: ${finalScore}`)
      
      // Track achievements
      if (typeof window !== 'undefined') {
        if (finalScore >= 2048 && (window as any).unlockAchievement) {
          ;(window as any).unlockAchievement('high-score')
        }
        
        const gamesPlayed = JSON.parse(localStorage.getItem('games_played') || '[]')
        if (!gamesPlayed.includes('2048')) {
          gamesPlayed.push('2048')
          localStorage.setItem('games_played', JSON.stringify(gamesPlayed))
          
          if (gamesPlayed.length >= 9 && (window as any).unlockAchievement) {
            ;(window as any).unlockAchievement('play-all-games')
          }
        }
      }
    }
  }

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isPlaying || isPaused) return

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        move('up')
        break
      case 'ArrowDown':
        e.preventDefault()
        move('down')
        break
      case 'ArrowLeft':
        e.preventDefault()
        move('left')
        break
      case 'ArrowRight':
        e.preventDefault()
        move('right')
        break
    }
  }, [isPlaying, isPaused, move])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const startGame = () => {
    initializeGame()
    clearGameState('2048')
  }

  const pauseGame = () => {
    setIsPaused(!isPaused)
  }

  const saveGame = () => {
    saveGameState('2048', { grid, score })
    toast.success('Game saved!')
  }

  const getCellColor = (value: number) => {
    const colors: Record<number, string> = {
      0: '#cdc1b4',
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    }
    return colors[value] || '#3c3a32'
  }

  const getTextColor = (value: number) => {
    return value <= 4 ? '#776e65' : '#f9f6f2'
  }

  return (
    <Card className="bg-background/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>2048</CardTitle>
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
          <div
            className="grid gap-2 p-4 rounded-lg bg-[#bbada0]"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            }}
          >
            {grid.flat().map((value, index) => {
              const row = Math.floor(index / GRID_SIZE)
              const col = index % GRID_SIZE
              return (
                <div
                  key={`${row}-${col}`}
                  className="flex items-center justify-center rounded font-bold text-2xl transition-all"
                  style={{
                    backgroundColor: getCellColor(value),
                    color: getTextColor(value),
                    minWidth: CELL_SIZE,
                    minHeight: CELL_SIZE,
                  }}
                >
                  {value !== 0 && value}
                </div>
              )
            })}
          </div>
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
          <p>Use Arrow Keys to move tiles. Combine tiles with the same number!</p>
        </div>
        {musicEnabled && (
          <audio ref={audioRef} src="/audio/game-music.mp3" loop />
        )}
      </CardContent>
    </Card>
  )
}

