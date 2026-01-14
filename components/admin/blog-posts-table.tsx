'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, Edit, Trash2, Eye, Calendar, FileText, CheckSquare, Square, Download, ExternalLink, RefreshCw } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
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
import ContentPreviewModal from '@/components/admin/content-preview-modal'
import BulkOperationsBar from '@/components/admin/bulk-operations-bar'
import { adminNotificationManager } from '@/lib/notifications/admin-notifications'
import { format } from 'date-fns'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  status: 'draft' | 'published' | 'scheduled'
  featured_image: string | null
  category: string | null
  tags: string[] | null
  published_at: string | null
  created_at: string
  updated_at: string
  views: number
}

interface BlogPostsTableProps {
  initialPosts: BlogPost[]
}

type ItemsPerPage = 12 | 24 | 48 | 96

export default function BlogPostsTable({ initialPosts }: BlogPostsTableProps) {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPage>(24)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [postToEdit, setPostToEdit] = useState<BlogPost | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [postToPreview, setPostToPreview] = useState<BlogPost | null>(null)
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [isBulkOperating, setIsBulkOperating] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Refetch posts from server
  const refetchPosts = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {}
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch('/api/admin/content/blog', {
        method: 'GET',
        headers,
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const result = await response.json()
      if (result.data) {
        setPosts(result.data)
      }
      
      // Also refresh server component data
      router.refresh()
    } catch (error) {
      console.error('Error refetching posts:', error)
      toast.error('Failed to refresh posts')
    } finally {
      setIsRefreshing(false)
    }
  }, [router])

  // Get unique categories
  const categories = useMemo(
    () =>
      Array.from(
        new Set(posts.map((post) => post.category).filter((cat): cat is string => Boolean(cat)))
      ).sort(),
    [posts]
  )

  // Filter posts
  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((post) => post.status === filterStatus)
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter((post) => post.category === filterCategory)
    }

    return filtered
  }, [posts, searchQuery, filterStatus, filterCategory])

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  // Select all on current page
  const allSelectedOnPage = paginatedPosts.length > 0 && paginatedPosts.every((post) => selectedPosts.has(post.id))
  const someSelectedOnPage = paginatedPosts.some((post) => selectedPosts.has(post.id))

  const handleSelectAll = () => {
    if (allSelectedOnPage) {
      // Deselect all on current page
      const newSelected = new Set(selectedPosts)
      paginatedPosts.forEach((post) => newSelected.delete(post.id))
      setSelectedPosts(newSelected)
    } else {
      // Select all on current page
      const newSelected = new Set(selectedPosts)
      paginatedPosts.forEach((post) => newSelected.add(post.id))
      setSelectedPosts(newSelected)
    }
  }

  const handleSelectPost = (postId: string) => {
    const newSelected = new Set(selectedPosts)
    if (newSelected.has(postId)) {
      newSelected.delete(postId)
    } else {
      newSelected.add(postId)
    }
    setSelectedPosts(newSelected)
  }

  const handleBulkDelete = async () => {
    if (selectedPosts.size === 0) return

    setIsBulkOperating(true)
    try {
      const response = await fetch('/api/admin/content/blog/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ids: Array.from(selectedPosts),
          action: 'delete',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete posts')
      }

      const count = selectedPosts.size
      // Refetch posts to get fresh data
      await refetchPosts()
      setSelectedPosts(new Set())
      setBulkDeleteDialogOpen(false)
      toast.success(`Deleted ${count} post(s) successfully`)
      adminNotificationManager.success(
        'Blog Posts Deleted',
        `${count} post(s) deleted successfully`
      )
    } catch (error) {
      console.error('Error deleting posts:', error)
      toast.error('Failed to delete posts. Please try again.')
      adminNotificationManager.error(
        'Delete Failed',
        'Failed to delete blog posts. Please try again.'
      )
    } finally {
      setIsBulkOperating(false)
    }
  }

  const handleBulkStatusChange = async (status: 'draft' | 'published' | 'scheduled') => {
    if (selectedPosts.size === 0) return

    setIsBulkOperating(true)
    try {
      const response = await fetch('/api/admin/content/blog/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ids: Array.from(selectedPosts),
          action: 'update_status',
          value: status,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update posts')
      }

      // Refetch posts to get fresh data
      await refetchPosts()
      setSelectedPosts(new Set())
      const count = selectedPosts.size
      toast.success(`Updated ${count} post(s) to ${status}`)
      adminNotificationManager.success(
        `Blog Posts Updated`,
        `${count} post(s) changed to ${status}`
      )
    } catch (error) {
      console.error('Error updating posts:', error)
      toast.error('Failed to update posts. Please try again.')
      adminNotificationManager.error(
        'Update Failed',
        'Failed to update blog posts. Please try again.'
      )
    } finally {
      setIsBulkOperating(false)
    }
  }

  const handleDelete = async () => {
    if (!postToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/content/blog/${postToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      // Refetch posts to get fresh data
      const deletedTitle = postToDelete.title
      setPostToDelete(null)
      setDeleteDialogOpen(false)
      await refetchPosts()
      toast.success('Post deleted successfully')
      adminNotificationManager.success(
        'Blog Post Deleted',
        `"${deletedTitle}" has been deleted`
      )
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post. Please try again.')
      adminNotificationManager.error(
        'Delete Failed',
        'Failed to delete blog post. Please try again.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (post: BlogPost) => {
    setPostToEdit(post)
    setEditModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      published: 'default',
      draft: 'secondary',
      scheduled: 'outline',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const handleExport = async (format: 'json' | 'csv' = 'json') => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {}
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const statusParam = filterStatus !== 'all' ? filterStatus : 'all'
      const url = `/api/admin/content/export?type=blog&format=${format}&status=${statusParam}`
      
      const response = await fetch(url, {
        credentials: 'include',
        headers,
      })

      if (!response.ok) {
        throw new Error('Failed to export posts')
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      
      const extension = format === 'csv' ? 'csv' : 'json'
      link.download = `blog-posts-export-${new Date().toISOString().split('T')[0]}.${extension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

      toast.success(`Exported ${filteredPosts.length} post(s) as ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Error exporting posts:', error)
      toast.error('Failed to export posts. Please try again.')
    }
  }

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      {/* Bulk Actions Bar */}
      <BulkOperationsBar
        selectedCount={selectedPosts.size}
        onClearSelection={() => setSelectedPosts(new Set())}
        onBulkDelete={() => setBulkDeleteDialogOpen(true)}
        onBulkStatusChange={(value) => handleBulkStatusChange(value as 'draft' | 'published' | 'scheduled')}
        statusOptions={[
          { value: 'published', label: 'Set to Published' },
          { value: 'draft', label: 'Set to Draft' },
          { value: 'scheduled', label: 'Set to Scheduled' },
        ]}
        isLoading={isBulkOperating}
      />

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between sticky top-0 z-10 bg-background pb-4 w-full">
        <div className="flex flex-1 gap-2 w-full sm:w-auto min-w-0">
          <div className="relative flex-1 max-w-sm min-w-0">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search posts..."
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
          {categories.length > 0 && (
            <Select value={filterCategory} onValueChange={(value) => {
              setFilterCategory(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-[140px] flex-shrink-0">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('json')}>
                <FileText className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            onClick={refetchPosts} 
            variant="outline" 
            className="flex-shrink-0"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setCreateModalOpen(true)} className="flex-shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allSelectedOnPage}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="min-w-[200px]">Title</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px]">Category</TableHead>
              <TableHead className="w-[150px]">Tags</TableHead>
              <TableHead className="w-[80px]">Views</TableHead>
              <TableHead className="w-[120px]">Published</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No blog posts found</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPosts.has(post.id)}
                      onCheckedChange={() => handleSelectPost(post.id)}
                      aria-label={`Select ${post.title}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-[300px]">
                    <div className="flex items-center gap-2 min-w-0">
                      {post.featured_image && (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-10 h-10 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{post.title}</div>
                        {post.excerpt && (
                          <div className="text-sm text-muted-foreground line-clamp-1 truncate">
                            {post.excerpt}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell>
                    {post.category ? (
                      <Badge variant="outline">{post.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {post.tags && post.tags.length > 0 ? (
                        post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs truncate max-w-full">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                      {post.tags && post.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      {post.views || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    {post.published_at ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(post.published_at), 'MMM d, yyyy')}
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
                          setPostToPreview(post)
                          setPreviewModalOpen(true)
                        }}
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPostToDelete(post)
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

      {/* Pagination */}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
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

      {/* Bulk Delete Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Posts</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedPosts.size} post(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isBulkOperating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isBulkOperating ? 'Deleting...' : `Delete ${selectedPosts.size} post(s)`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Modal */}
      <ContentCreationModal
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open)
          if (!open) {
            // Refetch after modal closes (in case content was saved)
            refetchPosts()
          }
        }}
        contentType="blog"
      />

      {/* Edit Modal */}
      {postToEdit && (
        <ContentCreationModal
          open={editModalOpen}
          onOpenChange={(open) => {
            setEditModalOpen(open)
            if (!open) {
              setPostToEdit(null)
              // Refetch after modal closes (in case content was updated)
              refetchPosts()
            }
          }}
          contentType="blog"
          initialData={postToEdit}
        />
      )}

      {/* Preview Modal */}
      {postToPreview && (
        <ContentPreviewModal
          open={previewModalOpen}
          onOpenChange={(open) => {
            setPreviewModalOpen(open)
            if (!open) setPostToPreview(null)
          }}
          contentType="blog"
          content={postToPreview}
        />
      )}
    </div>
  )
}

