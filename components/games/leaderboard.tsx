'use client'

import { useState, useEffect } from 'react'
import { Trophy, Medal, Award, Crown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { loadHighScore, type HighScoreData } from '@/lib/games/game-storage'

interface LeaderboardEntry {
  game: string
  score: number
  player: string
  date: string
}

interface LeaderboardProps {
  gameName?: string
}

const gameIcons = {
  snake: Trophy,
  tetris: Medal,
  memory: Award,
  'tic-tac-toe': Crown,
  breakout: Trophy,
  'word-puzzle': Award,
}

export default function Leaderboard({ gameName }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<Record<string, LeaderboardEntry[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = () => {
    const games = ['snake', 'tetris', 'memory', 'tic-tac-toe', 'breakout', 'word-puzzle']
    const allScores: Record<string, LeaderboardEntry[]> = {}

    games.forEach((game) => {
      const highScore = loadHighScore(game)
      if (highScore && highScore.score > 0) {
        if (!allScores[game]) {
          allScores[game] = []
        }
        allScores[game].push({
          game,
          score: highScore.score,
          player: highScore.player || 'You',
          date: highScore.date || new Date().toISOString(),
        })
      }
    })

    // Sort by score descending
    Object.keys(allScores).forEach((game) => {
      allScores[game].sort((a, b) => b.score - a.score)
    })

    setLeaderboard(allScores)
    setIsLoading(false)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-semibold w-6 text-center">{rank}</span>
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return 'Recently'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Loading scores...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const hasAnyScores = Object.values(leaderboard).some((scores) => scores.length > 0)

  if (!hasAnyScores) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Leaderboard
          </CardTitle>
          <CardDescription>No scores yet. Play games to set records!</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (gameName && leaderboard[gameName]) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {gameName.charAt(0).toUpperCase() + gameName.slice(1)} Leaderboard
          </CardTitle>
          <CardDescription>Your best scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard[gameName].slice(0, 10).map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(index + 1)}
                  <div>
                    <div className="font-semibold">{entry.player}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(entry.date)}</div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg font-bold">
                  {entry.score.toLocaleString()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Game Leaderboards
        </CardTitle>
        <CardDescription>Top scores across all games</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={Object.keys(leaderboard)[0] || 'snake'} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-4">
            {Object.keys(leaderboard).map((game) => {
              const Icon = gameIcons[game as keyof typeof gameIcons] || Trophy
              return (
                <TabsTrigger key={game} value={game} className="gap-1">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {game.charAt(0).toUpperCase() + game.slice(1).replace('-', ' ')}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {Object.entries(leaderboard).map(([game, scores]) => (
            <TabsContent key={game} value={game}>
              <div className="space-y-2">
                {scores.slice(0, 10).map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      {getRankIcon(index + 1)}
                      <div>
                        <div className="font-semibold">{entry.player}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(entry.date)}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {entry.score.toLocaleString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

