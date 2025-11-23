'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, Edit, Trash2, Eye, Calendar, Briefcase } from 'lucide-react'
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

interface CaseStudy {
  id: string
  title: string
  slug: string
  description: string | null
  status: 'draft' | 'published' | 'scheduled'
  featured_image: string | null
  tech_stack: string[] | null
  published_at: string | null
  created_at: string
  updated_at: string
  views: number
}

interface CaseStudiesTableProps {
  initialCaseStudies: CaseStudy[]
}

type ItemsPerPage = 12 | 24 | 48 | 96

export default function CaseStudiesTable({ initialCaseStudies }: CaseStudiesTableProps) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(initialCaseStudies)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPage>(24)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [caseStudyToDelete, setCaseStudyToDelete] = useState<CaseStudy | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [caseStudyToEdit, setCaseStudyToEdit] = useState<CaseStudy | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // Filter case studies
  const filteredCaseStudies = useMemo(() => {
    let filtered = caseStudies

    if (searchQuery) {
      filtered = filtered.filter(
        (cs) =>
          cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cs.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cs.tech_stack?.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((cs) => cs.status === filterStatus)
    }

    return filtered
  }, [caseStudies, searchQuery, filterStatus])

  const totalPages = Math.ceil(filteredCaseStudies.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCaseStudies = filteredCaseStudies.slice(startIndex, endIndex)

  const handleDelete = async () => {
    if (!caseStudyToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/content/case-studies/${caseStudyToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete case study')
      }

      setCaseStudies(caseStudies.filter((cs) => cs.id !== caseStudyToDelete.id))
      setDeleteDialogOpen(false)
      setCaseStudyToDelete(null)
    } catch (error) {
      console.error('Error deleting case study:', error)
      alert('Failed to delete case study. Please try again.')
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
              placeholder="Search case studies..."
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
            New Case Study
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Title</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[180px]">Tech Stack</TableHead>
              <TableHead className="w-[80px]">Views</TableHead>
              <TableHead className="w-[120px]">Published</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCaseStudies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No case studies found</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCaseStudies.map((cs) => (
                <TableRow key={cs.id}>
                  <TableCell className="font-medium max-w-[300px]">
                    <div className="flex items-center gap-2 min-w-0">
                      {cs.featured_image && (
                        <img
                          src={cs.featured_image}
                          alt={cs.title}
                          className="w-10 h-10 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{cs.title}</div>
                        {cs.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1 truncate">
                            {cs.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(cs.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {cs.tech_stack && cs.tech_stack.length > 0 ? (
                        cs.tech_stack.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                      {cs.tech_stack && cs.tech_stack.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{cs.tech_stack.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      {cs.views || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    {cs.published_at ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(cs.published_at), 'MMM d, yyyy')}
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
                          setCaseStudyToEdit(cs)
                          setEditModalOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCaseStudyToDelete(cs)
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
            <AlertDialogTitle>Delete Case Study</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{caseStudyToDelete?.title}"? This action cannot be undone.
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
        contentType="case-study"
      />

      {caseStudyToEdit && (
        <ContentCreationModal
          open={editModalOpen}
          onOpenChange={(open) => {
            setEditModalOpen(open)
            if (!open) setCaseStudyToEdit(null)
          }}
          contentType="case-study"
          initialData={caseStudyToEdit}
        />
      )}
    </div>
  )
}

