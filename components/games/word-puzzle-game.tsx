'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, RotateCcw, Trophy } from 'lucide-react'
import { saveScore, getHighScore, saveGameState, loadGameState, clearGameState } from '@/lib/games/game-storage'
import { toast } from 'sonner'

interface WordPuzzleGameProps {
  musicEnabled: boolean
  musicVolume: number
}

const WORDS = [
  'REACT', 'NEXTJS', 'TYPESCRIPT', 'JAVASCRIPT', 'PYTHON',
  'NODEJS', 'MONGODB', 'POSTGRES', 'REDIS', 'DOCKER',
  'KUBERNETES', 'AWS', 'GITHUB', 'GITLAB', 'FIGMA',
  'TAILWIND', 'CSS', 'HTML', 'API', 'REST',
]

export default function WordPuzzleGame({ musicEnabled, musicVolume }: WordPuzzleGameProps) {
  const [selectedWord, setSelectedWord] = useState('')
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([])
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedLetters, setSelectedLetters] = useState<number[]>([])

  useEffect(() => {
    setHighScore(getHighScore('word-puzzle'))
    const saved = loadGameState('word-puzzle')
    if (saved) {
      setFoundWords(saved.foundWords || [])
      setScore(saved.score || 0)
      setTimeLeft(saved.timeLeft || 300)
      setShuffledLetters(saved.shuffledLetters || [])
    } else {
      startNewRound()
    }
  }, [])

  const startNewRound = useCallback(() => {
    const availableWords = WORDS.filter(w => !foundWords.includes(w))
    if (availableWords.length === 0) {
      toast.success('You found all words!')
      return
    }
    const word = availableWords[Math.floor(Math.random() * availableWords.length)]
    setSelectedWord(word)
    const letters = word.split('').sort(() => Math.random() - 0.5)
    setShuffledLetters(letters)
    setSelectedLetters([])
  }, [foundWords])

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            gameOver()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isPlaying, timeLeft])

  const handleLetterClick = (index: number) => {
    if (!isPlaying) return

    if (selectedLetters.includes(index)) {
      setSelectedLetters(prev => prev.filter(i => i !== index))
    } else {
      setSelectedLetters(prev => [...prev, index])
    }
  }

  const checkWord = () => {
    const word = selectedLetters.map(i => shuffledLetters[i]).join('')
    if (WORDS.includes(word) && !foundWords.includes(word)) {
      setFoundWords(prev => [...prev, word])
      setScore(prev => {
        const newScore = prev + word.length * 10
        if (newScore > highScore) {
          setHighScore(newScore)
        }
        return newScore
      })
      toast.success(`Found: ${word}!`)
      startNewRound()
    } else if (foundWords.includes(word)) {
      toast.error('Word already found!')
    } else {
      toast.error('Not a valid word!')
    }
    setSelectedLetters([])
  }

  const startGame = () => {
    setIsPlaying(true)
    setTimeLeft(300)
    setScore(0)
    setFoundWords([])
    startNewRound()
    clearGameState('word-puzzle')
  }

  const gameOver = () => {
    setIsPlaying(false)
    if (score > 0) {
      saveScore('word-puzzle', score)
      toast.success(`Game Over! Score: ${score}`)
    }
  }

  const saveGame = () => {
    saveGameState('word-puzzle', { foundWords, score, timeLeft, shuffledLetters })
    toast.success('Game saved!')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="bg-background/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Word Puzzle</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>High: {highScore}</span>
            </div>
            <div>Score: {score}</div>
            <div>Time: {formatTime(timeLeft)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Find words from the letters below</p>
          <div className="flex flex-wrap gap-2 justify-center min-h-[60px]">
            {selectedLetters.map(i => shuffledLetters[i]).join('') && (
              <div className="text-2xl font-bold bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                {selectedLetters.map(i => shuffledLetters[i]).join('')}
              </div>
            )}
          </div>
        </div>

        {/* Letter Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-w-md mx-auto">
          {shuffledLetters.map((letter, index) => (
            <button
              key={index}
              onClick={() => handleLetterClick(index)}
              disabled={!isPlaying}
              className={`aspect-square rounded-lg border-2 font-bold text-xl transition-all ${
                selectedLetters.includes(index)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background/80 backdrop-blur-sm border-border hover:bg-accent/50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Found Words */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Found Words ({foundWords.length}/{WORDS.length}):</h3>
          <div className="flex flex-wrap gap-2 min-h-[60px] p-2 bg-muted/30 backdrop-blur-sm rounded-lg">
            {foundWords.map((word, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/20 backdrop-blur-sm rounded-md text-sm font-medium"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 justify-center">
          {isPlaying && (
            <Button
              onClick={checkWord}
              disabled={selectedLetters.length === 0}
              className="bg-background/80 backdrop-blur-sm"
            >
              Check Word
            </Button>
          )}
          <Button
            onClick={isPlaying ? saveGame : startGame}
            variant="outline"
            className="bg-background/80 backdrop-blur-sm"
          >
            {isPlaying ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Game
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4 mr-2" />
                Start Game
              </>
            )}
          </Button>
          {isPlaying && (
            <Button
              onClick={gameOver}
              variant="outline"
              className="bg-background/80 backdrop-blur-sm"
            >
              End Game
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

