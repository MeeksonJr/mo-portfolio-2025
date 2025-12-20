'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface EnhancedFiltersProps {
  filters: {
    category?: FilterOption[]
    tags?: FilterOption[]
    date?: FilterOption[]
    status?: FilterOption[]
  }
  activeFilters: Record<string, string[]>
  onFilterChange: (filterType: string, value: string) => void
  onClearFilters: () => void
  className?: string
}

export default function EnhancedFilters({
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
  className = '',
}: EnhancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const activeCount = Object.values(activeFilters).flat().length

  const handleToggle = (filterType: string, value: string) => {
    onFilterChange(filterType, value)
  }

  const isActive = (filterType: string, value: string) => {
    return activeFilters[filterType]?.includes(value) || false
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Category Filter */}
      {filters.category && filters.category.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              Category
              <ChevronDown className="h-4 w-4 ml-2" />
              {activeFilters.category && activeFilters.category.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {activeFilters.category.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {filters.category.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleToggle('category', option.value)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{option.label}</span>
                {isActive('category', option.value) && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
                {option.count !== undefined && (
                  <Badge variant="outline" className="ml-auto">
                    {option.count}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Tags Filter */}
      {filters.tags && filters.tags.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              Tags
              <ChevronDown className="h-4 w-4 ml-2" />
              {activeFilters.tags && activeFilters.tags.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {activeFilters.tags.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 max-h-64 overflow-y-auto">
            {filters.tags.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleToggle('tags', option.value)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{option.label}</span>
                {isActive('tags', option.value) && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
                {option.count !== undefined && (
                  <Badge variant="outline" className="ml-auto">
                    {option.count}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Date Filter */}
      {filters.date && filters.date.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              Date
              <ChevronDown className="h-4 w-4 ml-2" />
              {activeFilters.date && activeFilters.date.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {activeFilters.date.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {filters.date.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleToggle('date', option.value)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{option.label}</span>
                {isActive('date', option.value) && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Status Filter */}
      {filters.status && filters.status.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              Status
              <ChevronDown className="h-4 w-4 ml-2" />
              {activeFilters.status && activeFilters.status.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {activeFilters.status.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {filters.status.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleToggle('status', option.value)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{option.label}</span>
                {isActive('status', option.value) && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Active Filters Display */}
      {activeCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-9 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear ({activeCount})
          </Button>
        </motion.div>
      )}
    </div>
  )
}

