'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, RotateCcw, Trophy, Play } from 'lucide-react'
import { saveScore, getHighScore, saveGameState, loadGameState, clearGameState } from '@/lib/games/game-storage'
import { toast } from 'sonner'

interface MemoryGameProps {
  musicEnabled: boolean
  musicVolume: number
}

type Card = {
  id: number
  value: number
  flipped: boolean
  matched: boolean
}

const CARD_VALUES = [1, 2, 3, 4, 5, 6, 7, 8]

export default function MemoryGame({ musicEnabled, musicVolume }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [matchedPairs, setMatchedPairs] = useState(0)

  useEffect(() => {
    setHighScore(getHighScore('memory'))
  }, [])

  const initializeCards = useCallback(() => {
    const cardPairs = [...CARD_VALUES, ...CARD_VALUES]
    const shuffled = cardPairs
      .map((value, index) => ({ id: index, value, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlippedCards([])
    setMoves(0)
    setScore(0)
    setMatchedPairs(0)
    setIsPlaying(true)
  }, [])

  useEffect(() => {
    initializeCards()
  }, [initializeCards])

  const handleCardClick = (index: number) => {
    if (!isPlaying || cards[index].flipped || cards[index].matched || flippedCards.length >= 2) {
      return
    }

    const newCards = [...cards]
    newCards[index].flipped = true
    setCards(newCards)
    setFlippedCards([...flippedCards, index])

    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1)
      const firstCard = cards[flippedCards[0]]
      const secondCard = cards[index]

      if (firstCard.value === secondCard.value) {
        // Match found
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev]
            updated[flippedCards[0]].matched = true
            updated[index].matched = true
            return updated
          })
          setMatchedPairs(prev => {
            const newCount = prev + 1
            if (newCount === CARD_VALUES.length) {
              const finalScore = Math.max(0, 1000 - moves * 10)
              setScore(finalScore)
              if (finalScore > highScore) {
                setHighScore(finalScore)
                saveScore('memory', finalScore)
              }
              toast.success(`You won! Score: ${finalScore}`)
              setIsPlaying(false)
            }
            return newCount
          })
          setFlippedCards([])
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev]
            updated[flippedCards[0]].flipped = false
            updated[index].flipped = false
            return updated
          })
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const resetGame = () => {
    initializeCards()
    clearGameState('memory')
  }

  const saveGame = () => {
    saveGameState('memory', { cards, moves, score, matchedPairs })
    toast.success('Game saved!')
  }

  return (
    <Card className="bg-background/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Memory Game</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">High: {highScore}</span>
            </div>
            <div className="text-sm">Moves: {moves}</div>
            <div className="text-sm font-semibold">Score: {score}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Board */}
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={!isPlaying || card.matched}
              className={`aspect-square rounded-lg border-2 border-border flex items-center justify-center text-2xl font-bold transition-all ${
                card.flipped || card.matched
                  ? 'bg-primary/80 backdrop-blur-sm text-primary-foreground'
                  : 'bg-muted/60 backdrop-blur-sm hover:bg-muted/80'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {card.flipped || card.matched ? card.value : '?'}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            onClick={saveGame}
            variant="outline"
            className="bg-background/80 backdrop-blur-sm"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Game
          </Button>
          <Button
            onClick={resetGame}
            variant="outline"
            className="bg-background/80 backdrop-blur-sm"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Match all pairs to win! Pairs: {matchedPairs}/{CARD_VALUES.length}
        </p>
      </CardContent>
    </Card>
  )
}

