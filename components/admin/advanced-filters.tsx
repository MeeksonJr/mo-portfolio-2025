'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Filter,
  X,
  Calendar,
  Tag,
  CheckSquare,
  RotateCcw,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export interface FilterOption {
  id: string
  label: string
  value: string
}

export interface AdvancedFiltersProps {
  // Status filters
  statusOptions?: FilterOption[]
  statusFilter?: string[]
  onStatusFilterChange?: (statuses: string[]) => void

  // Date range filters
  dateFrom?: Date | null
  dateTo?: Date | null
  onDateFromChange?: (date: Date | null) => void
  onDateToChange?: (date: Date | null) => void

  // Category/Tag filters
  categoryOptions?: FilterOption[]
  categoryFilter?: string[]
  onCategoryFilterChange?: (categories: string[]) => void

  // Sort options
  sortOptions?: FilterOption[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void

  // Active filter count
  activeFilterCount?: number

  // Custom filters
  customFilters?: React.ReactNode

  // Presets
  presets?: Array<{
    label: string
    filters: {
      status?: string[]
      dateFrom?: Date
      dateTo?: Date
      category?: string[]
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }
  }>
  onPresetApply?: (preset: any) => void
}

export default function AdvancedFilters({
  statusOptions = [],
  statusFilter = [],
  onStatusFilterChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  categoryOptions = [],
  categoryFilter = [],
  onCategoryFilterChange,
  sortOptions = [],
  sortBy,
  sortOrder = 'desc',
  onSortChange,
  activeFilterCount = 0,
  customFilters,
  presets = [],
  onPresetApply,
}: AdvancedFiltersProps) {
  const [open, setOpen] = useState(false)

  const handleStatusToggle = (status: string) => {
    if (!onStatusFilterChange) return
    const newStatuses = statusFilter.includes(status)
      ? statusFilter.filter((s) => s !== status)
      : [...statusFilter, status]
    onStatusFilterChange(newStatuses)
  }

  const handleCategoryToggle = (category: string) => {
    if (!onCategoryFilterChange) return
    const newCategories = categoryFilter.includes(category)
      ? categoryFilter.filter((c) => c !== category)
      : [...categoryFilter, category]
    onCategoryFilterChange(newCategories)
  }

  const handleClearFilters = () => {
    onStatusFilterChange?.([])
    onDateFromChange?.(null)
    onDateToChange?.(null)
    onCategoryFilterChange?.([])
    onSortChange?.('updated_at', 'desc')
  }

  const handlePresetApply = (preset: any) => {
    if (preset.filters.status) {
      onStatusFilterChange?.(preset.filters.status)
    }
    if (preset.filters.dateFrom) {
      onDateFromChange?.(preset.filters.dateFrom)
    }
    if (preset.filters.dateTo) {
      onDateToChange?.(preset.filters.dateTo)
    }
    if (preset.filters.category) {
      onCategoryFilterChange?.(preset.filters.category)
    }
    if (preset.filters.sortBy) {
      onSortChange?.(
        preset.filters.sortBy,
        preset.filters.sortOrder || 'desc'
      )
    }
    onPresetApply?.(preset)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Advanced Filters</h3>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-7 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <Separator />

          {/* Presets */}
          {presets.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Presets</Label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handlePresetApply(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              <Separator />
            </div>
          )}

          {/* Status Filters */}
          {statusOptions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-medium flex items-center gap-2">
                <CheckSquare className="h-3 w-3" />
                Status
              </Label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <Badge
                    key={option.id}
                    variant={
                      statusFilter.includes(option.value)
                        ? 'default'
                        : 'outline'
                    }
                    className="cursor-pointer"
                    onClick={() => handleStatusToggle(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Date Range Filters */}
          {(onDateFromChange || onDateToChange) && (
            <div className="space-y-2">
              <Label className="text-xs font-medium flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Date Range
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">From</Label>
                  <Input
                    type="date"
                    value={
                      dateFrom
                        ? format(dateFrom, 'yyyy-MM-dd')
                        : ''
                    }
                    onChange={(e) => {
                      onDateFromChange?.(
                        e.target.value
                          ? new Date(e.target.value)
                          : null
                      )
                    }}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">To</Label>
                  <Input
                    type="date"
                    value={dateTo ? format(dateTo, 'yyyy-MM-dd') : ''}
                    onChange={(e) => {
                      onDateToChange?.(
                        e.target.value ? new Date(e.target.value) : null
                      )
                    }}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Category/Tag Filters */}
          {categoryOptions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-medium flex items-center gap-2">
                <Tag className="h-3 w-3" />
                Categories
              </Label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {categoryOptions.map((option) => (
                  <Badge
                    key={option.id}
                    variant={
                      categoryFilter.includes(option.value)
                        ? 'default'
                        : 'outline'
                    }
                    className="cursor-pointer"
                    onClick={() => handleCategoryToggle(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Sort Options */}
          {sortOptions.length > 0 && onSortChange && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">Sort By</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={sortBy || ''}
                  onValueChange={(value) =>
                    onSortChange(value, sortOrder || 'desc')
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={sortOrder}
                  onValueChange={(value: 'asc' | 'desc') =>
                    onSortChange(sortBy || '', value)
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Custom Filters */}
          {customFilters && (
            <>
              <Separator />
              {customFilters}
            </>
          )}

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <>
              <Separator />
              <div className="text-xs text-muted-foreground">
                {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
