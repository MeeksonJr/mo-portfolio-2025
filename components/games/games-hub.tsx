'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Gamepad2, 
  Trophy, 
  Music, 
  Volume2, 
  VolumeX,
  Save,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react'
import SnakeGame from './snake-game'
import TetrisGame from './tetris-game'
import MemoryGame from './memory-game'
import TicTacToeGame from './tic-tac-toe-game'
import BreakoutGame from './breakout-game'
import WordPuzzleGame from './word-puzzle-game'
import Leaderboard from './leaderboard'
import { toast } from 'sonner'

const GAME_TABS = [
  { value: 'snake', label: 'Snake', icon: Gamepad2, description: 'Classic snake game' },
  { value: 'tetris', label: 'Tetris', icon: Gamepad2, description: 'Block stacking puzzle' },
  { value: 'memory', label: 'Memory', icon: Gamepad2, description: 'Card matching game' },
  { value: 'tic-tac-toe', label: 'Tic-Tac-Toe', icon: Gamepad2, description: 'Classic 3x3 game' },
  { value: 'breakout', label: 'Breakout', icon: Gamepad2, description: 'Brick breaking game' },
  { value: 'word-puzzle', label: 'Word Puzzle', icon: Gamepad2, description: 'Word finding game' },
]

export default function GamesHub() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('snake')
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [musicVolume, setMusicVolume] = useState(0.3)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && GAME_TABS.some(t => t.value === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/games?tab=${value}`, { scroll: false })
  }

  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled)
    toast.success(`Music ${!musicEnabled ? 'enabled' : 'disabled'}`)
  }

  return (
    <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Gamepad2 className="h-8 w-8" />
            Games Hub
          </h1>
          <p className="text-muted-foreground">
            Play interactive games with score tracking, background music, and save functionality
          </p>
        </motion.div>

        {/* Music Controls */}
        <div className="mb-6 flex items-center gap-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMusic}
            className="bg-background/80 backdrop-blur-sm"
          >
            {musicEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <span className="text-sm text-muted-foreground">
            Background Music: {musicEnabled ? 'On' : 'Off'}
          </span>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b mb-6">
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList 
                className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 h-auto p-1 bg-muted/60 backdrop-blur-sm min-w-max"
                aria-label="Games navigation tabs"
              >
                {GAME_TABS.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.value
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 px-2 sm:px-3 data-[state=active]:bg-background/95 data-[state=active]:backdrop-blur-sm data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border/50 min-w-[80px] sm:min-w-[90px] transition-all"
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-center leading-tight">{tab.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>
          </div>

          {/* Game Content */}
          <AnimatePresence mode="wait">
            <TabsContent value="snake" className="mt-6">
              <SnakeGame musicEnabled={musicEnabled} musicVolume={musicVolume} />
            </TabsContent>
            <TabsContent value="tetris" className="mt-6">
              <TetrisGame musicEnabled={musicEnabled} musicVolume={musicVolume} />
            </TabsContent>
            <TabsContent value="memory" className="mt-6">
              <MemoryGame musicEnabled={musicEnabled} musicVolume={musicVolume} />
            </TabsContent>
            <TabsContent value="tic-tac-toe" className="mt-6">
              <TicTacToeGame musicEnabled={musicEnabled} musicVolume={musicVolume} />
            </TabsContent>
            <TabsContent value="breakout" className="mt-6">
              <BreakoutGame musicEnabled={musicEnabled} musicVolume={musicVolume} />
            </TabsContent>
            <TabsContent value="word-puzzle" className="mt-6">
              <WordPuzzleGame musicEnabled={musicEnabled} musicVolume={musicVolume} />
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* Leaderboard */}
        <div className="mt-12">
          <Leaderboard />
        </div>
      </div>
    </div>
  )
}

