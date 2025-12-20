'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, X, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface BulkOperationsBarProps {
  selectedCount: number
  onClearSelection: () => void
  onBulkDelete?: () => void
  onBulkStatusChange?: (status: string) => void
  statusOptions?: Array<{ value: string; label: string }>
  isLoading?: boolean
  customActions?: React.ReactNode
}

export default function BulkOperationsBar({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  onBulkStatusChange,
  statusOptions = [
    { value: 'published', label: 'Set to Published' },
    { value: 'draft', label: 'Set to Draft' },
    { value: 'scheduled', label: 'Set to Scheduled' },
  ],
  isLoading = false,
  customActions,
}: BulkOperationsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="text-sm font-medium">
          {selectedCount} selected
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={isLoading}
          className="h-8"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {customActions}
        {onBulkStatusChange && statusOptions.length > 0 && (
          <Select
            value=""
            onValueChange={onBulkStatusChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {onBulkDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            disabled={isLoading}
            className="h-8"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete Selected
          </Button>
        )}
      </div>
    </div>
  )
}
