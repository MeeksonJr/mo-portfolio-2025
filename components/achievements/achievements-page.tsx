'use client'

import { useState, useEffect } from 'react'
import {
  getAllAchievementsWithProgress,
  getTotalPoints,
  getUnlockedAchievements,
  ACHIEVEMENTS,
} from '@/lib/achievements'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Trophy, Lock, CheckCircle2, TrendingUp } from 'lucide-react'
import AchievementBadge from './achievement-badge'

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState(
    getAllAchievementsWithProgress()
  )
  const [totalPoints, setTotalPoints] = useState(getTotalPoints())
  const [unlockedCount, setUnlockedCount] = useState(getUnlockedAchievements().length)

  useEffect(() => {
    const updateAchievements = () => {
      setAchievements(getAllAchievementsWithProgress())
      setTotalPoints(getTotalPoints())
      setUnlockedCount(getUnlockedAchievements().length)
    }

    // Update every second to catch real-time unlocks
    const interval = setInterval(updateAchievements, 1000)
    return () => clearInterval(interval)
  }, [])

  const unlockedAchievements = achievements.filter((a) =>
    getUnlockedAchievements().some((u) => u.id === a.id)
  )
  const lockedAchievements = achievements.filter(
    (a) => !getUnlockedAchievements().some((u) => u.id === a.id)
  )

  const achievementsByCategory = {
    exploration: achievements.filter((a) => a.category === 'exploration'),
    engagement: achievements.filter((a) => a.category === 'engagement'),
    social: achievements.filter((a) => a.category === 'social'),
    milestone: achievements.filter((a) => a.category === 'milestone'),
  }

  const completionPercentage = Math.round(
    (unlockedCount / ACHIEVEMENTS.length) * 100
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">
          Track your progress and unlock achievements as you explore
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints}</div>
            <p className="text-xs text-muted-foreground">Points earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unlocked</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {unlockedCount} / {ACHIEVEMENTS.length}
            </div>
            <p className="text-xs text-muted-foreground">{completionPercentage}% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <p className="text-xs text-muted-foreground">Completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locked</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ACHIEVEMENTS.length - unlockedCount}
            </div>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>
            {unlockedCount} of {ACHIEVEMENTS.length} achievements unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Achievements Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="exploration">Exploration</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="milestone">Milestone</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => {
              const unlocked = unlockedAchievements.some((u) => u.id === achievement.id)
              return (
                <Card key={achievement.id} className={unlocked ? '' : 'opacity-75'}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{achievement.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{achievement.title}</CardTitle>
                          <CardDescription>{achievement.description}</CardDescription>
                        </div>
                      </div>
                      {unlocked && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge variant="secondary">{achievement.rarity}</Badge>
                        <Badge variant="outline">{achievement.points} pts</Badge>
                      </div>
                      {achievement.progress && !unlocked && (
                        <div className="text-xs text-muted-foreground">
                          {achievement.progress.progress} / {achievement.progress.maxProgress}
                        </div>
                      )}
                    </div>
                    {achievement.progress && !unlocked && (
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${
                              (achievement.progress.progress /
                                achievement.progress.maxProgress) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryAchievements.map((achievement) => {
                const unlocked = unlockedAchievements.some((u) => u.id === achievement.id)
                return (
                  <Card key={achievement.id} className={unlocked ? '' : 'opacity-75'}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{achievement.icon}</span>
                          <div>
                            <CardTitle className="text-lg">{achievement.title}</CardTitle>
                            <CardDescription>{achievement.description}</CardDescription>
                          </div>
                        </div>
                        {unlocked && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge variant="secondary">{achievement.rarity}</Badge>
                          <Badge variant="outline">{achievement.points} pts</Badge>
                        </div>
                        {achievement.progress && !unlocked && (
                          <div className="text-xs text-muted-foreground">
                            {achievement.progress.progress} / {achievement.progress.maxProgress}
                          </div>
                        )}
                      </div>
                      {achievement.progress && !unlocked && (
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: `${
                                (achievement.progress.progress /
                                  achievement.progress.maxProgress) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

