'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Bookmark,
  BookOpen,
  TrendingUp,
  Clock,
  Download,
  Filter,
  X,
  Folder,
  CheckCircle2,
} from 'lucide-react'
import { getBookmarks, getBookmarksByType, type BookmarkType } from '@/lib/bookmarks'
import {
  getReadingList,
  getUnreadItems,
  getReadItems,
  getCategories,
} from '@/lib/reading-list'
import { getAchievementState } from '@/lib/achievements'
import { getExplorationProgress } from '@/lib/gamified-exploration'
import Link from 'next/link'
import Image from 'next/image'

export default function PersonalDashboard() {
  const [bookmarks, setBookmarks] = useState<ReturnType<typeof getBookmarks>>([])
  const [readingList, setReadingList] = useState<ReturnType<typeof getReadingList>>([])
  const [achievementState, setAchievementState] = useState<ReturnType<typeof getAchievementState>>({
    unlocked: [],
    progress: {},
    visitCount: 0,
    lastVisit: null,
    sessionStartTime: null,
  })
  const [explorationProgress, setExplorationProgress] = useState<ReturnType<typeof getExplorationProgress>>({
    pagesVisited: 0,
    featuresUsed: 0,
    contentViewed: 0,
    milestonesCompleted: 0,
  })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only access localStorage on client side
    setMounted(true)
    setBookmarks(getBookmarks())
    setReadingList(getReadingList())
    setAchievementState(getAchievementState())
    setExplorationProgress(getExplorationProgress())
  }, [])

  const categories = mounted ? getCategories() : []
  const unreadItems = mounted ? getUnreadItems() : []
  const readItems = mounted ? getReadItems() : []
  const filteredReadingList = selectedCategory
    ? readingList.filter((item) => item.category === selectedCategory)
    : readingList

  useEffect(() => {
    if (!mounted) return

    // Refresh data periodically
    const interval = setInterval(() => {
      setBookmarks(getBookmarks())
      setReadingList(getReadingList())
      setAchievementState(getAchievementState())
      setExplorationProgress(getExplorationProgress())
    }, 1000)

    return () => clearInterval(interval)
  }, [mounted])

  const bookmarkStats = {
    total: bookmarks.length,
    projects: mounted ? getBookmarksByType('project').length : 0,
    blog: mounted ? getBookmarksByType('blog').length : 0,
    resources: mounted ? getBookmarksByType('resource').length : 0,
    caseStudies: mounted ? getBookmarksByType('case-study').length : 0,
  }

  const readingStats = {
    total: readingList.length,
    unread: unreadItems.length,
    read: readItems.length,
    inProgress: readingList.filter((item) => item.progress > 0 && item.progress < 100).length,
  }

  const achievementProgress =
    achievementState.unlocked.length > 0
      ? (achievementState.unlocked.length / 30) * 100 // Assuming 30 total achievements
      : 0

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Personal Dashboard</h1>
        <p className="text-muted-foreground">
          Your portfolio exploration stats, bookmarks, and reading list
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pages Visited</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{explorationProgress.pagesVisited}</div>
            <p className="text-xs text-muted-foreground">Total pages explored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {achievementState.unlocked.length}
              <span className="text-sm text-muted-foreground">/30</span>
            </div>
            <Progress value={achievementProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookmarkStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {bookmarkStats.projects} projects, {bookmarkStats.blog} blog posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reading List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readingStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {readingStats.unread} unread, {readingStats.read} completed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookmarks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookmarks">
            <Bookmark className="h-4 w-4 mr-2" />
            Bookmarks ({bookmarkStats.total})
          </TabsTrigger>
          <TabsTrigger value="reading">
            <BookOpen className="h-4 w-4 mr-2" />
            Reading List ({readingStats.total})
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <TrendingUp className="h-4 w-4 mr-2" />
            Achievements ({achievementState.unlocked.length})
          </TabsTrigger>
          <TabsTrigger value="exploration">
            <Clock className="h-4 w-4 mr-2" />
            Exploration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookmarks" className="space-y-4">
          {bookmarks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No bookmarks yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start bookmarking your favorite content!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="hover:shadow-lg transition-shadow">
                  {bookmark.image && (
                    <div className="relative w-full h-32 overflow-hidden rounded-t-lg">
                      <Image
                        src={bookmark.image}
                        alt={bookmark.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{bookmark.title}</CardTitle>
                      <Badge variant="outline">{bookmark.type}</Badge>
                    </div>
                    {bookmark.description && (
                      <CardDescription className="line-clamp-2">
                        {bookmark.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={bookmark.url}>View</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reading" className="space-y-4">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                  {selectedCategory === category && (
                    <X className="h-3 w-3 ml-2" onClick={(e) => {
                      e.stopPropagation()
                      setSelectedCategory(null)
                    }} />
                  )}
                </Button>
              ))}
            </div>
          )}

          {filteredReadingList.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No items in reading list</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add content to your reading list to track your progress!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReadingList.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {item.image && (
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {item.progress === 100 && (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}
                            <Badge variant="outline">{item.type}</Badge>
                          </div>
                        </div>
                        <Progress value={item.progress} className="mb-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{Math.round(item.progress)}% complete</span>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={item.url}>Continue Reading</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Achievement Progress</CardTitle>
              <CardDescription>
                You've unlocked {achievementState.unlocked.length} out of 30 achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={achievementProgress} className="mb-4" />
              <Button asChild variant="outline">
                <Link href="/achievements">View All Achievements</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exploration" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Pages Visited</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{explorationProgress.pagesVisited}</div>
                <p className="text-sm text-muted-foreground mt-2">Total pages explored</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{explorationProgress.featuresUsed}</div>
                <p className="text-sm text-muted-foreground mt-2">Interactive features tried</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Viewed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{explorationProgress.contentViewed}</div>
                <p className="text-sm text-muted-foreground mt-2">Items viewed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visit Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{achievementState.visitCount}</div>
                <p className="text-sm text-muted-foreground mt-2">Total visits</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

