'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, RefreshCw, Eye, Lock, GitFork, Star, Grid3x3, List, LayoutGrid } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import ContentCreationModal from '@/components/admin/content-creation-modal'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  languages: Record<string, number> | null
  topics: string[]
  stars: number
  forks: number
  watchers: number
  open_issues: number
  is_private: boolean
  is_fork: boolean
  is_archived: boolean
  default_branch: string | null
  license: string | null
  created_at: string | null
  updated_at: string | null
  pushed_at: string | null
  last_synced_at: string
  readme_content: string | null
  content_created: boolean
}

interface GitHubReposBrowserProps {
  initialRepos: GitHubRepo[]
}

type ViewMode = 'grid' | 'list' | 'compact'
type ItemsPerPage = 12 | 24 | 48 | 96

export default function GitHubReposBrowser({ initialRepos }: GitHubReposBrowserProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>(initialRepos)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterVisibility, setFilterVisibility] = useState<string>('all')
  const [filterLanguage, setFilterLanguage] = useState<string>('all')
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [contentModalOpen, setContentModalOpen] = useState(false)
  const [contentModalRepo, setContentModalRepo] = useState<GitHubRepo | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPage>(24)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Get unique languages
  const languages = useMemo(
    () =>
      Array.from(
        new Set(repos.map((repo) => repo.language).filter((lang): lang is string => Boolean(lang)))
      ).sort(),
    [repos]
  )

  // Filter repos (memoized for performance)
  const filteredRepos = useMemo(() => {
    let filtered = repos

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          repo.topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Visibility filter
    if (filterVisibility === 'public') {
      filtered = filtered.filter((repo) => !repo.is_private)
    } else if (filterVisibility === 'private') {
      filtered = filtered.filter((repo) => repo.is_private)
    }

    // Language filter
    if (filterLanguage !== 'all') {
      filtered = filtered.filter((repo) => repo.language === filterLanguage)
    }

    return filtered
  }, [repos, searchQuery, filterVisibility, filterLanguage])

  // Pagination calculations
  const totalPages = Math.ceil(filteredRepos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRepos = filteredRepos.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterVisibility, filterLanguage])

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch('/api/admin/github/sync', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (response.ok && data.success) {
        setRepos(data.repos || [])
        setCurrentPage(1) // Reset to first page after sync
        // Show success message (you can add a toast here later)
        console.log(`✅ Synced ${data.synced || 0} repositories`)
      } else {
        console.error('Sync failed:', data.error)
        alert(`Failed to sync: ${data.error || 'Unknown error'}`)
      }
    } catch (error: any) {
      console.error('Failed to sync:', error)
      alert(`Failed to sync: ${error.message || 'Unknown error'}`)
    } finally {
      setIsSyncing(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of repos list
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('ellipsis')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handleCreateContent = (repo: GitHubRepo) => {
    setContentModalRepo(repo)
    setContentModalOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="glass rounded-lg p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterVisibility} onValueChange={(value) => value && setFilterVisibility(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Repos</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterLanguage} onValueChange={(value) => value && setFilterLanguage(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang || ''}>
                  {lang || 'Unknown'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSync} disabled={isSyncing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync
          </Button>
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredRepos.length)} of {filteredRepos.length} repositories
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'compact' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('compact')}
                className="h-8 px-3"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            {/* Items Per Page */}
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(parseInt(value) as ItemsPerPage)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
                <SelectItem value="96">96</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Repos Display */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : viewMode === 'list'
            ? 'space-y-3'
            : 'space-y-2'
        }
      >
        {paginatedRepos.map((repo) => (
          <div
            key={repo.id}
            className={`glass rounded-lg hover:shadow-lg transition-shadow cursor-pointer ${
              viewMode === 'compact'
                ? 'p-2'
                : viewMode === 'list'
                ? 'p-3'
                : 'p-4'
            }`}
            onClick={() => setSelectedRepo(repo)}
          >
            {viewMode === 'list' ? (
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4 w-full">
                <div className="flex items-center gap-3 flex-1 min-w-0 w-full lg:w-auto">
                  {repo.is_private ? (
                    <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">{repo.name}</h3>
                    {repo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{repo.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-3 text-sm text-muted-foreground flex-shrink-0 flex-wrap w-full lg:w-auto">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{repo.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    <span>{repo.forks}</span>
                  </div>
                  {repo.language && (
                    <Badge variant="outline" className="text-xs">
                      {repo.language}
                    </Badge>
                  )}
                  {repo.content_created && (
                    <Badge variant="secondary" className="text-xs">
                      Has Content
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  className="w-full lg:w-auto flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCreateContent(repo)
                  }}
                >
                  Create Content
                </Button>
              </div>
            ) : viewMode === 'compact' ? (
              <>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {repo.is_private ? (
                      <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <Eye className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    )}
                    <h3 className="font-semibold text-sm truncate">{repo.name}</h3>
                    {repo.content_created && (
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        Has Content
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>{repo.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    <span>{repo.forks}</span>
                  </div>
                  {repo.language && (
                    <Badge variant="outline" className="text-xs">
                      {repo.language}
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    className="ml-auto h-6 text-xs px-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCreateContent(repo)
                    }}
                  >
                    Create
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {repo.is_private ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <h3 className="font-semibold text-lg">{repo.name}</h3>
                  </div>
                  {repo.content_created && (
                    <Badge variant="secondary" className="text-xs">
                      Has Content
                    </Badge>
                  )}
                </div>

                {repo.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {repo.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{repo.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    <span>{repo.forks}</span>
                  </div>
                  {repo.language && (
                    <Badge variant="outline" className="text-xs">
                      {repo.language}
                    </Badge>
                  )}
                </div>

                {repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {repo.topics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{repo.topics.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <Button
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCreateContent(repo)
                  }}
                >
                  Create Content
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredRepos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No repositories found. Try adjusting your filters or sync from GitHub.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Repo Details Modal */}
      <Dialog open={!!selectedRepo} onOpenChange={() => setSelectedRepo(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRepo?.is_private ? (
                <Lock className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
              {selectedRepo?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedRepo && (
              <div className="space-y-4">
                {selectedRepo.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedRepo.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Stats</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        <span>{selectedRepo.stars} stars</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GitFork className="h-4 w-4" />
                        <span>{selectedRepo.forks} forks</span>
                      </div>
                      <div>Watchers: {selectedRepo.watchers}</div>
                      <div>Open Issues: {selectedRepo.open_issues}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Info</h4>
                    <div className="space-y-1 text-sm">
                      {selectedRepo.language && <div>Language: {selectedRepo.language}</div>}
                      {selectedRepo.license && <div>License: {selectedRepo.license}</div>}
                      <div>Default Branch: {selectedRepo.default_branch || 'main'}</div>
                      {selectedRepo.homepage && (
                        <div>
                          <a
                            href={selectedRepo.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Homepage
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedRepo.topics.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRepo.topics.map((topic) => (
                        <Badge key={topic} variant="outline">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => handleCreateContent(selectedRepo)}
                  >
                    Create Content from Repo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedRepo.html_url, '_blank')}
                  >
                    View on GitHub
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Content Creation Modal */}
      <ContentCreationModal
        open={contentModalOpen}
        onOpenChange={(open) => {
          setContentModalOpen(open)
          if (!open) {
            setContentModalRepo(null)
          }
        }}
        repo={contentModalRepo}
      />
    </div>
  )
}

