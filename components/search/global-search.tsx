'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Search,
  FileText,
  FolderGit2,
  BookOpen,
  Wrench,
  Clock,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface SearchResult {
  id: string
  type: 'blog' | 'project' | 'case-study' | 'resource'
  title: string
  description: string | null
  url: string
  category?: string | null
  tags?: string[] | null
  date?: string | null
}

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const router = useRouter()
  const debouncedQuery = useDebounce(query, 300)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recent_searches')
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  // Perform search
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery)
    } else {
      setResults([])
      setIsSearching(false)
    }
  }, [debouncedQuery, selectedFilter])

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true)
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&type=${selectedFilter}`
      )
      const data = await response.json()
      setResults(data.results || [])

      // Save to recent searches
      if (searchQuery && !recentSearches.includes(searchQuery)) {
        const updated = [searchQuery, ...recentSearches].slice(0, 5)
        setRecentSearches(updated)
        localStorage.setItem('recent_searches', JSON.stringify(updated))
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelect = (result: SearchResult) => {
    // Save to recent searches
    if (query && !recentSearches.includes(query)) {
      const updated = [query, ...recentSearches].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('recent_searches', JSON.stringify(updated))
    }
    onOpenChange(false)
    router.push(result.url)
    setQuery('')
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recent_searches')
  }

  const typeIcons = {
    blog: FileText,
    project: FolderGit2,
    'case-study': BookOpen,
    resource: Wrench,
  }

  const typeLabels = {
    blog: 'Blog',
    project: 'Project',
    'case-study': 'Case Study',
    resource: 'Resource',
  }

  const groupedResults = useMemo(() => {
    const grouped: Record<string, SearchResult[]> = {}
    results.forEach(result => {
      if (!grouped[result.type]) {
        grouped[result.type] = []
      }
      grouped[result.type].push(result)
    })
    return grouped
  }, [results])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search blog posts, projects, case studies, resources..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {/* Filters */}
        {query.length >= 2 && (
          <div className="px-2 py-1.5 border-b flex gap-1">
            {['all', 'blog', 'project', 'case-study', 'resource'].map(filter => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="h-7 text-xs"
              >
                {filter === 'all' ? 'All' : typeLabels[filter as keyof typeof typeLabels]}
              </Button>
            ))}
          </div>
        )}

        {/* Search Results */}
        {query.length >= 2 ? (
          isSearching ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <>
              {Object.entries(groupedResults).map(([type, items]) => {
                const Icon = typeIcons[type as keyof typeof typeIcons]
                const label = typeLabels[type as keyof typeof typeLabels]
                return (
                  <CommandGroup key={type} heading={label}>
                    {items.map(result => (
                      <CommandItem
                        key={result.id}
                        onSelect={() => handleSelect(result)}
                        className="flex items-start gap-3 py-3"
                      >
                        <Icon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{result.title}</div>
                          {result.description && (
                            <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {result.description}
                            </div>
                          )}
                          {result.tags && result.tags.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {result.tags.slice(0, 3).map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs h-4">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )
              })}
            </>
          ) : (
            <CommandEmpty>
              No results found for &quot;{query}&quot;
            </CommandEmpty>
          )
        ) : (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <>
                <CommandGroup heading="Recent Searches">
                  {recentSearches.map((search, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => {
                        setQuery(search)
                        performSearch(search)
                      }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{search}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <div className="px-2 py-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="w-full justify-start text-xs text-muted-foreground"
                  >
                    <X className="h-3 w-3 mr-2" />
                    Clear recent searches
                  </Button>
                </div>
              </>
            )}

            {/* Empty State */}
            {recentSearches.length === 0 && (
              <div className="py-6 text-center">
                <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Start typing to search across all content
                </p>
              </div>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}

