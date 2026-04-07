# Pagination Pattern for Admin Pages

This document outlines the reusable pagination pattern implemented in the GitHub Repos Browser. Use this pattern for other admin pages that display large lists of items.

## Features

1. **Pagination Controls** - Navigate through pages with Previous/Next and page numbers
2. **Items Per Page Selector** - Choose how many items to display (12, 24, 48, 96)
3. **View Mode Toggle** - Switch between Grid, List, and Compact views
4. **Summary Stats** - Shows current range and total count
5. **Smart Page Numbering** - Shows ellipsis for large page counts
6. **Auto-scroll to Top** - Scrolls to top when changing pages

## Implementation Pattern

### 1. State Management

```typescript
type ViewMode = 'grid' | 'list' | 'compact'
type ItemsPerPage = 12 | 24 | 48 | 96

const [currentPage, setCurrentPage] = useState(1)
const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPage>(24)
const [viewMode, setViewMode] = useState<ViewMode>('grid')
```

### 2. Filtering (Memoized)

```typescript
const filteredItems = useMemo(() => {
  let filtered = items
  
  // Apply filters (search, visibility, etc.)
  if (searchQuery) {
    filtered = filtered.filter(/* ... */)
  }
  
  return filtered
}, [items, searchQuery, /* other filter dependencies */])
```

### 3. Pagination Calculations

```typescript
const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
const startIndex = (currentPage - 1) * itemsPerPage
const endIndex = startIndex + itemsPerPage
const paginatedItems = filteredItems.slice(startIndex, endIndex)
```

### 4. Reset Page on Filter Change

```typescript
useEffect(() => {
  setCurrentPage(1)
}, [searchQuery, filterVisibility, /* other filters */])
```

### 5. Page Number Generation

```typescript
const getPageNumbers = () => {
  const pages: (number | 'ellipsis')[] = []
  const maxVisible = 7

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('ellipsis')
    
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (currentPage < totalPages - 2) pages.push('ellipsis')
    if (totalPages > 1) pages.push(totalPages)
  }

  return pages
}
```

### 6. Page Change Handler

```typescript
const handlePageChange = (page: number) => {
  setCurrentPage(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
```

## UI Components

### View Controls Section

```tsx
<div className="flex items-center justify-between flex-wrap gap-4">
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <span>
      Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
    </span>
  </div>
  
  <div className="flex items-center gap-2">
    {/* View Mode Toggle */}
    <div className="flex items-center gap-1 border rounded-lg p-1">
      <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} onClick={() => setViewMode('grid')}>
        <Grid3x3 className="h-4 w-4" />
      </Button>
      <Button variant={viewMode === 'list' ? 'default' : 'ghost'} onClick={() => setViewMode('list')}>
        <List className="h-4 w-4" />
      </Button>
      <Button variant={viewMode === 'compact' ? 'default' : 'ghost'} onClick={() => setViewMode('compact')}>
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>

    {/* Items Per Page */}
    <Select value={itemsPerPage.toString()} onValueChange={(value) => {
      setItemsPerPage(parseInt(value) as ItemsPerPage)
      setCurrentPage(1)
    }}>
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
```

### Pagination Component

```tsx
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
```

## View Modes

### Grid View (Default)
- Best for: Visual browsing, cards with images
- Layout: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Shows: Full card with description, stats, topics

### List View
- Best for: Quick scanning, many items
- Layout: `space-y-3` with horizontal flex
- Shows: Compact horizontal layout with key info

### Compact View
- Best for: Maximum density, overview
- Layout: `space-y-2` with minimal padding
- Shows: Minimal info, just essentials

## Required Imports

```typescript
import { useState, useEffect, useMemo } from 'react'
import { Grid3x3, List, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
```

## Best Practices

1. **Always memoize filtered results** - Use `useMemo` to prevent unnecessary recalculations
2. **Reset to page 1 on filter changes** - Use `useEffect` to reset pagination when filters change
3. **Scroll to top on page change** - Improves UX when navigating pages
4. **Show summary stats** - Always display current range and total count
5. **Handle empty states** - Show helpful message when no items match filters
6. **Disable pagination buttons** - Disable Previous/Next when at first/last page
7. **Use appropriate view modes** - Let users choose based on their needs

## Example Usage

See `components/admin/github-repos-browser.tsx` for a complete implementation example.

## Pages to Apply This Pattern

- [ ] Blog Posts Admin (`/admin/content/blog`)
- [ ] Case Studies Admin (`/admin/content/case-studies`)
- [ ] Resources Admin (`/admin/content/resources`)
- [ ] Projects Admin (`/admin/content/projects`)
- [ ] Analytics Admin (`/admin/analytics`)
- [ ] Any other list-based admin pages

