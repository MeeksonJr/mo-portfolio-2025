'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, Edit, Trash2, Eye, Calendar, Package } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import ContentCreationModal from '@/components/admin/content-creation-modal'
import { format } from 'date-fns'

interface Resource {
  id: string
  title: string
  slug: string
  description: string | null
  url: string | null
  type: 'tool' | 'course' | 'book' | 'article' | 'video' | 'other'
  category: string | null
  tags: string[] | null
  status: 'draft' | 'published' | 'scheduled'
  featured_image: string | null
  published_at: string | null
  created_at: string
  views: number
}

interface ResourcesTableProps {
  initialResources: Resource[]
}

type ItemsPerPage = 12 | 24 | 48 | 96

export default function ResourcesTable({ initialResources }: ResourcesTableProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPage>(24)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [resourceToEdit, setResourceToEdit] = useState<Resource | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const filteredResources = useMemo(() => {
    let filtered = resources

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((r) => r.status === filterStatus)
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((r) => r.type === filterType)
    }

    return filtered
  }, [resources, searchQuery, filterStatus, filterType])

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedResources = filteredResources.slice(startIndex, endIndex)

  const handleDelete = async () => {
    if (!resourceToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/content/resources/${resourceToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete resource')
      }

      setResources(resources.filter((r) => r.id !== resourceToDelete.id))
      setDeleteDialogOpen(false)
      setResourceToDelete(null)
    } catch (error) {
      console.error('Error deleting resource:', error)
      alert('Failed to delete resource. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      published: 'default',
      draft: 'secondary',
      scheduled: 'outline',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between sticky top-0 z-10 bg-background pb-4 w-full">
        <div className="flex flex-1 gap-2 w-full sm:w-auto min-w-0">
          <div className="relative flex-1 max-w-sm min-w-0">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-8 w-full"
            />
          </div>
          <Select value={filterStatus} onValueChange={(value) => {
            setFilterStatus(value)
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-[140px] flex-shrink-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={(value) => {
            setFilterType(value)
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-[140px] flex-shrink-0">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="tool">Tool</SelectItem>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 flex-shrink-0">
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
              <SelectItem value="12">12/page</SelectItem>
              <SelectItem value="24">24/page</SelectItem>
              <SelectItem value="48">48/page</SelectItem>
              <SelectItem value="96">96/page</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setCreateModalOpen(true)} className="flex-shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            New Resource
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Title</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px]">Category</TableHead>
              <TableHead className="w-[80px]">Views</TableHead>
              <TableHead className="w-[120px]">Published</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No resources found</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium max-w-[300px]">
                    <div className="flex items-center gap-2 min-w-0">
                      {resource.featured_image && (
                        <img
                          src={resource.featured_image}
                          alt={resource.title}
                          className="w-10 h-10 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{resource.title}</div>
                        {resource.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1 truncate">
                            {resource.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{resource.type}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(resource.status)}</TableCell>
                  <TableCell>
                    {resource.category ? (
                      <Badge variant="outline">{resource.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      {resource.views || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    {resource.published_at ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(resource.published_at), 'MMM d, yyyy')}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setResourceToEdit(resource)
                          setEditModalOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setResourceToDelete(resource)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <PaginationItem key={page}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              return null
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{resourceToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ContentCreationModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        contentType="resource"
      />

      {resourceToEdit && (
        <ContentCreationModal
          open={editModalOpen}
          onOpenChange={(open) => {
            setEditModalOpen(open)
            if (!open) setResourceToEdit(null)
          }}
          contentType="resource"
          initialData={resourceToEdit}
        />
      )}
    </div>
  )
}

