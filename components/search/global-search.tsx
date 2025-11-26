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
  Code2,
  Layers,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { searchHubs, HUB_SEARCH_DATA, type Hub, type HubTab } from '@/lib/hub-search-data'

interface SearchResult {
  id: string
  type: 'blog' | 'project' | 'case-study' | 'resource' | 'hub' | 'hub-tab'
  title: string
  description: string | null
  url: string
  category?: string | null
  tags?: string[] | null
  date?: string | null
  hubId?: string
  tabValue?: string
}

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const router = useRouter()
  const debouncedQuery = useDebounce(query, 300)

  // Hub search results
  const hubResults = useMemo(() => {
    if (debouncedQuery.length >= 2) {
      return searchHubs(debouncedQuery)
    }
    return []
  }, [debouncedQuery])

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recent_searches')
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  // Generate autocomplete suggestions
  useEffect(() => {
    if (query.length >= 1 && query.length < 2) {
      // Show suggestions from recent searches, hub names, and common terms
      const hubNames = HUB_SEARCH_DATA.map(hub => hub.name.toLowerCase())
      const hubTabNames = HUB_SEARCH_DATA.flatMap(hub => 
        hub.tabs.map(tab => `${hub.name} ${tab.label}`.toLowerCase())
      )
      const commonTerms = ['react', 'next.js', 'typescript', 'javascript', 'node.js', 'supabase', 'tailwind', 'ai', 'portfolio', 'projects', 'blog']
      const allSuggestions = [...recentSearches, ...hubNames, ...hubTabNames, ...commonTerms]
      const filtered = allSuggestions
        .filter(term => term.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [query, recentSearches])

  // Perform search
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery)
    } else {
      setResults([])
      setIsSearching(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, selectedFilter, hubResults])

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true)
    try {
      // Search content (blog, projects, etc.) - only if filter is not 'hub'
      let contentResults: SearchResult[] = []
      if (selectedFilter !== 'hub') {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&type=${selectedFilter === 'all' ? 'all' : selectedFilter}`
        )
        const data = await response.json()
        contentResults = data.results || []
      }

      // Add hub results if filter is 'all' or 'hub'
      let hubSearchResults: SearchResult[] = []
      if (selectedFilter === 'all' || selectedFilter === 'hub') {
        hubSearchResults = hubResults.map(({ hub, tab, matchType }) => ({
          id: `hub-${hub.id}${tab ? `-${tab.value}` : ''}`,
          type: tab ? ('hub-tab' as const) : ('hub' as const),
          title: tab ? `${hub.name} - ${tab.label}` : hub.name,
          description: tab ? tab.description : hub.description,
          url: tab ? `${hub.url}?tab=${tab.value}` : hub.url,
          hubId: hub.id,
          tabValue: tab?.value,
        }))
      }

      setResults([...hubSearchResults, ...contentResults])

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

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    performSearch(suggestion)
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
    hub: Layers,
    'hub-tab': Code2,
  }

  const typeLabels = {
    blog: 'Blog',
    project: 'Project',
    'case-study': 'Case Study',
    resource: 'Resource',
    hub: 'Hub',
    'hub-tab': 'Hub Tab',
  }

  const groupedResults = useMemo(() => {
    const grouped: Record<string, SearchResult[]> = {}
    const hubGrouped: Record<string, SearchResult[]> = {}
    
    results.forEach(result => {
      // Group hub results by hub
      if (result.type === 'hub' || result.type === 'hub-tab') {
        const hubId = result.hubId || 'other'
        if (!hubGrouped[hubId]) {
          hubGrouped[hubId] = []
        }
        hubGrouped[hubId].push(result)
      } else {
        // Group other results by type
        if (!grouped[result.type]) {
          grouped[result.type] = []
        }
        grouped[result.type].push(result)
      }
    })

    // Add hub groups to main grouped object
    Object.keys(hubGrouped).forEach(hubId => {
      const hub = HUB_SEARCH_DATA.find(h => h.id === hubId)
      if (hub) {
        grouped[`hub-${hubId}`] = hubGrouped[hubId]
      }
    })

    return grouped
  }, [results])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search hubs, tabs, blog posts, projects, case studies, resources..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {/* Filters */}
        {query.length >= 2 && (
          <div className="px-2 py-1.5 border-b flex gap-1 flex-wrap">
            {['all', 'hub', 'blog', 'project', 'case-study', 'resource'].map(filter => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="h-7 text-xs"
              >
                {filter === 'all' ? 'All' : typeLabels[filter as keyof typeof typeLabels] || filter}
              </Button>
            ))}
          </div>
        )}

        {/* Autocomplete Suggestions */}
        {query.length >= 1 && query.length < 2 && suggestions.length > 0 && (
          <CommandGroup heading="Suggestions">
            {suggestions.map((suggestion, idx) => (
              <CommandItem
                key={idx}
                onSelect={() => handleSuggestionClick(suggestion)}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <span>{suggestion}</span>
              </CommandItem>
            ))}
          </CommandGroup>
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
                // Handle hub grouping
                if (type.startsWith('hub-')) {
                  const hubId = type.replace('hub-', '')
                  const hub = HUB_SEARCH_DATA.find(h => h.id === hubId)
                  if (!hub) return null

                  // Get all tabs for this hub
                  const allTabs = hub.tabs
                  const matchedTabIds = new Set(
                    items
                      .filter(item => item.type === 'hub-tab' && item.tabValue)
                      .map(item => item.tabValue!)
                  )
                  const hasHubMatch = items.some(item => item.type === 'hub')

                  return (
                    <CommandGroup key={type} heading={hub.name}>
                      {/* Hub main result (if matched) */}
                      {hasHubMatch && (
                        <CommandItem
                          key={`hub-${hub.id}`}
                          onSelect={() => handleSelect({
                            id: `hub-${hub.id}`,
                            type: 'hub',
                            title: hub.name,
                            description: hub.description,
                            url: hub.url,
                            hubId: hub.id,
                          })}
                          className="flex items-start gap-3 py-3"
                        >
                          <Layers className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{hub.name}</div>
                            {hub.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                {hub.description}
                              </div>
                            )}
                          </div>
                        </CommandItem>
                      )}
                      
                      {/* All tabs for quick navigation */}
                      {allTabs.map(tab => {
                        const isMatched = matchedTabIds.has(tab.value)
                        const TabIcon = tab.icon
                        return (
                          <CommandItem
                            key={`hub-${hub.id}-${tab.value}`}
                            onSelect={() => handleSelect({
                              id: `hub-${hub.id}-${tab.value}`,
                              type: 'hub-tab',
                              title: `${hub.name} - ${tab.label}`,
                              description: tab.description,
                              url: `${hub.url}?tab=${tab.value}`,
                              hubId: hub.id,
                              tabValue: tab.value,
                            })}
                            className={`flex items-start gap-3 py-3 ${!isMatched ? 'opacity-75' : ''}`}
                          >
                            <TabIcon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate flex items-center gap-2">
                                {tab.label}
                                {isMatched && (
                                  <Badge variant="secondary" className="text-xs h-4">
                                    Match
                                  </Badge>
                                )}
                              </div>
                              {tab.description && (
                                <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                  {tab.description}
                                </div>
                              )}
                            </div>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  )
                }

                // Handle other result types
                const Icon = typeIcons[type as keyof typeof typeIcons]
                const label = typeLabels[type as keyof typeof typeLabels]
                if (!Icon || !label) return null

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

