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
import { adminNotificationManager } from '@/lib/notifications/admin-notifications'
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

interface ContentVersion {
  id: string
  content: string
  metadata: any
  version: number
  change_note: string | null
  created_at: string
  created_by: string | null
}

interface VersionHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pageContentId: string
  currentVersion: number
  onVersionRestore?: () => void
}

export default function VersionHistoryDialog({
  open,
  onOpenChange,
  pageContentId,
  currentVersion,
  onVersionRestore,
}: VersionHistoryDialogProps) {
  const [versions, setVersions] = useState<ContentVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null)
  const [compareVersion, setCompareVersion] = useState<ContentVersion | null>(null)
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)
  const [restoring, setRestoring] = useState(false)

  useEffect(() => {
    if (open && pageContentId) {
      fetchVersions()
    }
  }, [open, pageContentId])

  const fetchVersions = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch(`/api/admin/pages/versions?page_content_id=${pageContentId}`, {
        headers,
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch versions')
      }

      const data = await response.json()
      setVersions(data.versions || [])
    } catch (error) {
      console.error('Error fetching versions:', error)
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
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch('/api/admin/pages/restore-version', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          page_content_id: pageContentId,
          version_id: selectedVersion.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to restore version')
      }

      toast.success(`Version ${selectedVersion.version} restored successfully`)
      adminNotificationManager.success(
        'Version Restored',
        `Content restored to version ${selectedVersion.version}`
      )
      setRestoreDialogOpen(false)
      setSelectedVersion(null)
      onVersionRestore?.()
      fetchVersions()
    } catch (error) {
      console.error('Error restoring version:', error)
      toast.error('Failed to restore version')
      adminNotificationManager.error(
        'Restore Failed',
        'Failed to restore version. Please try again.'
      )
    } finally {
      setRestoring(false)
    }
  }

  const getDiff = (oldContent: string, newContent: string) => {
    const oldLines = oldContent.split('\n')
    const newLines = newContent.split('\n')
    const maxLines = Math.max(oldLines.length, newLines.length)
    const diff: Array<{ type: 'added' | 'removed' | 'unchanged'; line: string }> = []

    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i] || ''
      const newLine = newLines[i] || ''

      if (oldLine === newLine) {
        diff.push({ type: 'unchanged', line: newLine || oldLine })
      } else {
        if (oldLine) {
          diff.push({ type: 'removed', line: oldLine })
        }
        if (newLine) {
          diff.push({ type: 'added', line: newLine })
        }
      }
    }

    return diff
  }

  const diff = selectedVersion && compareVersion
    ? getDiff(compareVersion.content, selectedVersion.content)
    : null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History
            </DialogTitle>
            <DialogDescription>
              View and restore previous versions of this content
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No version history available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Version List */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold mb-2">Versions</h3>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 pr-4">
                    {versions.map((version) => (
                      <div
                        key={version.id}
                        className={`
                          p-3 rounded-lg border cursor-pointer transition-colors
                          ${selectedVersion?.id === version.id
                            ? 'bg-primary/10 border-primary'
                            : 'bg-card hover:bg-accent'
                          }
                          ${version.version === currentVersion ? 'ring-2 ring-primary' : ''}
                        `}
                        onClick={() => setSelectedVersion(version)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={version.version === currentVersion ? 'default' : 'secondary'}>
                                v{version.version}
                              </Badge>
                              {version.version === currentVersion && (
                                <Badge variant="outline" className="text-xs">
                                  Current
                                </Badge>
                              )}
                            </div>
                            {version.change_note && (
                              <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                                {version.change_note}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(version.created_at), 'MMM d, yyyy HH:mm')}
                            </p>
                          </div>
                          {version.version === currentVersion && (
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Version Details */}
              <div className="space-y-4">
                {selectedVersion ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">
                        Version {selectedVersion.version} Details
                      </h3>
                      <div className="flex gap-2">
                        {selectedVersion.version !== currentVersion && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRestoreDialogOpen(true)}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restore
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCompareVersion(selectedVersion)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {compareVersion?.id === selectedVersion.id ? 'Stop Compare' : 'Compare'}
                        </Button>
                      </div>
                    </div>

                    <ScrollArea className="h-[400px] border rounded-lg p-4">
                      {compareVersion && compareVersion.id !== selectedVersion.id ? (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
                              Comparing v{compareVersion.version} → v{selectedVersion.version}
                            </h4>
                            {diff && (
                              <div className="space-y-1 font-mono text-xs">
                                {diff.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className={`
                                      p-1 rounded
                                      ${item.type === 'added' ? 'bg-green-500/20' : ''}
                                      ${item.type === 'removed' ? 'bg-red-500/20 line-through' : ''}
                                    `}
                                  >
                                    {item.type === 'added' && <span className="text-green-600">+ </span>}
                                    {item.type === 'removed' && <span className="text-red-600">- </span>}
                                    {item.line}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedVersion.change_note && (
                            <div className="mb-4">
                              <h4 className="text-xs font-semibold mb-1">Change Note</h4>
                              <p className="text-sm text-muted-foreground">{selectedVersion.change_note}</p>
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-semibold mb-2">Content</h4>
                            <pre className="text-xs whitespace-pre-wrap break-words bg-muted p-3 rounded">
                              {selectedVersion.content}
                            </pre>
                          </div>
                          {selectedVersion.metadata && Object.keys(selectedVersion.metadata).length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold mb-2">Metadata</h4>
                              <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                                {JSON.stringify(selectedVersion.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </ScrollArea>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                    <div className="text-center">
                      <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a version to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Version {selectedVersion?.version}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore the content to version {selectedVersion?.version}. The current version will be saved to history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestore}
              disabled={restoring}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
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

