'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { History, RotateCcw, Eye, Check, Loader2 } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Image from 'next/image'
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

interface ImageVersion {
  id: string
  image_url: string
  storage_path: string
  version: number
  replaced_at: string
  replaced_by: string | null
}

interface ImageVersionHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pageImageId: string
  currentImageUrl?: string
  onVersionRestore?: () => void
}

export default function ImageVersionHistoryDialog({
  open,
  onOpenChange,
  pageImageId,
  currentImageUrl,
  onVersionRestore,
}: ImageVersionHistoryDialogProps) {
  const [versions, setVersions] = useState<ImageVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<ImageVersion | null>(null)
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [previewVersion, setPreviewVersion] = useState<ImageVersion | null>(null)

  useEffect(() => {
    if (open && pageImageId) {
      fetchVersions()
    }
  }, [open, pageImageId])

  const fetchVersions = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch(`/api/admin/pages/image-versions?page_image_id=${pageImageId}`, {
        headers,
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch versions')
      }

      const data = await response.json()
      setVersions(data.versions || [])
    } catch (error) {
      console.error('Error fetching image versions:', error)
      toast.error('Failed to load version history')
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async () => {
    if (!selectedVersion) return

    setRestoring(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch('/api/admin/pages/restore-image-version', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          page_image_id: pageImageId,
          version_id: selectedVersion.id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to restore version')
      }

      toast.success('Image version restored successfully')
      setRestoreDialogOpen(false)
      setSelectedVersion(null)
      
      if (onVersionRestore) {
        onVersionRestore()
      }
      
      // Refresh versions list
      fetchVersions()
    } catch (error: any) {
      console.error('Error restoring version:', error)
      toast.error(error.message || 'Failed to restore version')
    } finally {
      setRestoring(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Image Version History
            </DialogTitle>
            <DialogDescription>
              View and restore previous versions of this image
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No version history available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Version */}
              {currentImageUrl && (
                <div className="md:col-span-2">
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Current</Badge>
                        <span className="text-sm text-muted-foreground">Active version</span>
                      </div>
                    </div>
                    <div className="relative aspect-video rounded overflow-hidden bg-background">
                      <Image
                        src={currentImageUrl}
                        alt="Current version"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Version History */}
              <ScrollArea className="md:col-span-2 max-h-[60vh]">
                <div className="space-y-3 pr-4">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        selectedVersion?.id === version.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Version {version.version}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(version.replaced_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {format(new Date(version.replaced_at), 'PPpp')}
                          </p>
                          <div className="relative aspect-video rounded overflow-hidden bg-muted mb-2 max-w-xs">
                            <Image
                              src={version.image_url}
                              alt={`Version ${version.version}`}
                              fill
                              className="object-contain cursor-pointer"
                              onClick={() => setPreviewVersion(version)}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewVersion(version)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setSelectedVersion(version)
                              setRestoreDialogOpen(true)
                            }}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restore
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      {previewVersion && (
        <Dialog open={!!previewVersion} onOpenChange={() => setPreviewVersion(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Version {previewVersion.version} Preview</DialogTitle>
            </DialogHeader>
            <div className="relative aspect-video rounded overflow-hidden bg-muted">
              <Image
                src={previewVersion.image_url}
                alt={`Version ${previewVersion.version}`}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Replaced {formatDistanceToNow(new Date(previewVersion.replaced_at), { addSuffix: true })}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Version {selectedVersion?.version}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore version {selectedVersion?.version} and save the current version
              to history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={restoring}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestore}
              disabled={restoring}
              className="bg-primary text-primary-foreground"
            >
              {restoring ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restore
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

