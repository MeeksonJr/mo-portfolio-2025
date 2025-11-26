'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { getShortcutsByCategory, HUB_TAB_SHORTCUTS } from '@/lib/keyboard-shortcuts'
import { usePathname } from 'next/navigation'
import { Keyboard, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const shortcuts = getShortcutsByCategory()

  // Detect current hub
  const currentHub = pathname?.startsWith('/code')
    ? 'code'
    : pathname?.startsWith('/resume')
    ? 'resume'
    : pathname?.startsWith('/tools')
    ? 'tools'
    : pathname?.startsWith('/insights')
    ? 'insights'
    : pathname?.startsWith('/about')
    ? 'about'
    : null

  const hubShortcuts = currentHub
    ? Object.entries(HUB_TAB_SHORTCUTS[currentHub] || {}).map(([key, action]) => ({
        key,
        action,
        description: `Navigate to ${key.split(' ').pop()} tab in ${currentHub} hub`,
      }))
    : []

  useEffect(() => {
    const handleShowShortcuts = () => {
      setOpen(true)
    }

    window.addEventListener('show-keyboard-shortcuts', handleShowShortcuts)

    return () => {
      window.removeEventListener('show-keyboard-shortcuts', handleShowShortcuts)
    }
  }, [])

  const formatKey = (key: string) => {
    const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
    return key
      .replace(/Ctrl/g, isMac ? '⌘' : 'Ctrl')
      .replace(/Cmd/g, isMac ? '⌘' : 'Ctrl')
      .replace(/Meta/g, isMac ? '⌘' : 'Ctrl')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Navigate and interact with the portfolio using keyboard shortcuts
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="hubs">Hubs</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6 mt-4">
            {/* Global Shortcuts */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                Global Shortcuts
              </h3>
              <div className="space-y-2">
                {shortcuts.global.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {formatKey(shortcut.key)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Shortcuts */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                Navigation
              </h3>
              <div className="space-y-2">
                {shortcuts.navigation.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {formatKey(shortcut.key)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Hub Shortcuts */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                Hubs
              </h3>
              <div className="space-y-2">
                {shortcuts.hubs.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {formatKey(shortcut.key)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Hub Tab Shortcuts (if on a hub page) */}
            {currentHub && hubShortcuts.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                  {currentHub.charAt(0).toUpperCase() + currentHub.slice(1)} Hub Tabs
                </h3>
                <div className="space-y-2">
                  {hubShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {formatKey(shortcut.key)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Shortcuts */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                Actions
              </h3>
              <div className="space-y-2">
                {shortcuts.actions.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {formatKey(shortcut.key)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="navigation" className="space-y-2 mt-4">
            {shortcuts.navigation.map((shortcut) => (
              <div
                key={shortcut.key}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm">{shortcut.description}</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {formatKey(shortcut.key)}
                </Badge>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="hubs" className="space-y-2 mt-4">
            {shortcuts.hubs.map((shortcut) => (
              <div
                key={shortcut.key}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm">{shortcut.description}</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {formatKey(shortcut.key)}
                </Badge>
              </div>
            ))}
            {currentHub && hubShortcuts.length > 0 && (
              <>
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                    {currentHub.charAt(0).toUpperCase() + currentHub.slice(1)} Hub Tabs
                  </h4>
                  {hubShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors mb-2"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {formatKey(shortcut.key)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="actions" className="space-y-2 mt-4">
            {shortcuts.actions.map((shortcut) => (
              <div
                key={shortcut.key}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm">{shortcut.description}</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {formatKey(shortcut.key)}
                </Badge>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">?</kbd> anytime to view shortcuts
          </p>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

