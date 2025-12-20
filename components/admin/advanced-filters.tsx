'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Filter, X, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export interface AdvancedFilters {
  dateRange?: {
    from: Date | undefined
    to: Date | undefined
  }
  viewsRange?: {
    min: number | undefined
    max: number | undefined
  }
  tags?: string[]
  author?: string
  sortBy?: 'created_at' | 'updated_at' | 'published_at' | 'views' | 'title'
  sortOrder?: 'asc' | 'desc'
}

interface AdvancedFiltersProps {
  filters: AdvancedFilters
  onFiltersChange: (filters: AdvancedFilters) => void
  availableTags?: string[]
  availableAuthors?: string[]
  contentType?: 'blog' | 'case-study' | 'resource' | 'project'
}

export default function AdvancedFiltersComponent({
  filters,
  onFiltersChange,
  availableTags = [],
  availableAuthors = [],
  contentType,
}: AdvancedFiltersProps) {
  const [open, setOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<AdvancedFilters>(filters)
  const [tagInput, setTagInput] = useState('')

  const updateFilter = (key: keyof AdvancedFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
    setOpen(false)
  }

  const handleReset = () => {
    const resetFilters: AdvancedFilters = {}
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !localFilters.tags?.includes(tagInput.trim())) {
      updateFilter('tags', [...(localFilters.tags || []), tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    updateFilter('tags', localFilters.tags?.filter((t) => t !== tag) || [])
  }

  const activeFilterCount =
    (localFilters.dateRange?.from || localFilters.dateRange?.to ? 1 : 0) +
    (localFilters.viewsRange?.min || localFilters.viewsRange?.max ? 1 : 0) +
    (localFilters.tags?.length || 0) +
    (localFilters.author ? 1 : 0) +
    (localFilters.sortBy ? 1 : 0)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Advanced Filters</h3>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-7 text-xs"
              >
                Reset
              </Button>
            )}
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !localFilters.dateRange?.from && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.dateRange?.from ? (
                      format(localFilters.dateRange.from, 'MMM d, yyyy')
                    ) : (
                      <span>From</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateRange?.from}
                    onSelect={(date) =>
                      updateFilter('dateRange', {
                        ...localFilters.dateRange,
                        from: date,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !localFilters.dateRange?.to && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.dateRange?.to ? (
                      format(localFilters.dateRange.to, 'MMM d, yyyy')
                    ) : (
                      <span>To</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateRange?.to}
                    onSelect={(date) =>
                      updateFilter('dateRange', {
                        ...localFilters.dateRange,
                        to: date,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Views Range */}
          <div className="space-y-2">
            <Label>Views Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min views"
                value={localFilters.viewsRange?.min || ''}
                onChange={(e) =>
                  updateFilter('viewsRange', {
                    ...localFilters.viewsRange,
                    min: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Max views"
                value={localFilters.viewsRange?.max || ''}
                onChange={(e) =>
                  updateFilter('viewsRange', {
                    ...localFilters.viewsRange,
                    max: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>

          {/* Tags */}
          {availableTags.length > 0 && (
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag} size="sm">
                  Add
                </Button>
              </div>
              {localFilters.tags && localFilters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {localFilters.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Author */}
          {availableAuthors.length > 0 && (
            <div className="space-y-2">
              <Label>Author</Label>
              <Select
                value={localFilters.author || ''}
                onValueChange={(value) =>
                  updateFilter('author', value || undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All authors</SelectItem>
                  {availableAuthors.map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Sort */}
          <div className="space-y-2">
            <Label>Sort By</Label>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={localFilters.sortBy || ''}
                onValueChange={(value) =>
                  updateFilter('sortBy', value || undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Default</SelectItem>
                  <SelectItem value="created_at">Created Date</SelectItem>
                  <SelectItem value="updated_at">Updated Date</SelectItem>
                  <SelectItem value="published_at">Published Date</SelectItem>
                  <SelectItem value="views">Views</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={localFilters.sortOrder || 'desc'}
                onValueChange={(value) =>
                  updateFilter('sortOrder', (value as 'asc' | 'desc') || 'desc')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

