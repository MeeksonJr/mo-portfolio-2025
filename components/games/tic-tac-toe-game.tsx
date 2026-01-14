'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, RotateCcw, Trophy, X, Circle } from 'lucide-react'
import { saveScore, getHighScore, saveGameState, loadGameState, clearGameState } from '@/lib/games/game-storage'
import { toast } from 'sonner'

interface TicTacToeGameProps {
  musicEnabled: boolean
  musicVolume: number
}

type Player = 'X' | 'O' | null
type Board = Player[]

export default function TicTacToeGame({ musicEnabled, musicVolume }: TicTacToeGameProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [xWins, setXWins] = useState(0)
  const [oWins, setOWins] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [winner, setWinner] = useState<Player | 'draw' | null>(null)

  useEffect(() => {
    const saved = loadGameState('tic-tac-toe')
    if (saved) {
      setBoard(saved.board)
      setCurrentPlayer(saved.currentPlayer)
      setXWins(saved.xWins || 0)
      setOWins(saved.oWins || 0)
    }
  }, [])

  const checkWinner = (board: Board): Player | 'draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ]

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as Player
      }
    }

    if (board.every(cell => cell !== null)) {
      return 'draw'
    }

    return null
  }

  const handleClick = (index: number) => {
    if (board[index] || isGameOver) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const gameWinner = checkWinner(newBoard)
    if (gameWinner) {
      setIsGameOver(true)
      setWinner(gameWinner)
      if (gameWinner === 'X') {
        setXWins(prev => {
          const newWins = prev + 1
          saveScore('tic-tac-toe', newWins, undefined, { type: 'win', player: 'X' })
          return newWins
        })
      } else if (gameWinner === 'O') {
        setOWins(prev => {
          const newWins = prev + 1
          saveScore('tic-tac-toe', newWins, undefined, { type: 'win', player: 'O' })
          return newWins
        })
      }
      toast.success(gameWinner === 'draw' ? 'Draw!' : `${gameWinner} wins!`)
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
    setIsGameOver(false)
    setWinner(null)
    clearGameState('tic-tac-toe')
  }

  const saveGame = () => {
    saveGameState('tic-tac-toe', { board, currentPlayer, xWins, oWins })
    toast.success('Game saved!')
  }

  return (
    <Card className="bg-background/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tic-Tac-Toe</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-blue-500" />
              <span>X: {xWins}</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-red-500" />
              <span>O: {oWins}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          {isGameOver ? (
            <p className="text-lg font-semibold">
              {winner === 'draw' ? "It's a draw!" : `Player ${winner} wins!`}
            </p>
          ) : (
            <p className="text-lg font-semibold">Current Player: {currentPlayer}</p>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={isGameOver || cell !== null}
              className="aspect-square bg-background/80 backdrop-blur-sm border-2 border-border rounded-lg flex items-center justify-center text-4xl font-bold hover:bg-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cell === 'X' && <X className="h-8 w-8 text-blue-500" />}
              {cell === 'O' && <Circle className="h-8 w-8 text-red-500" />}
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
            New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

