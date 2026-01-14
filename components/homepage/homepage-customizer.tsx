'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  GripVertical,
  Eye,
  EyeOff,
  Settings,
  RotateCcw,
  Save,
  X,
} from 'lucide-react'
import {
  getHomepageSections,
  saveHomepageSections,
  toggleSectionVisibility,
  reorderSections,
  resetHomepageLayout,
  type HomepageSection,
} from '@/lib/homepage-customization'
import { showSuccessToast, showInfoToast } from '@/lib/toast-helpers'
import { motion, Reorder } from 'framer-motion'

interface HomepageCustomizerProps {
  onClose?: () => void
}

export default function HomepageCustomizer({ onClose }: HomepageCustomizerProps) {
  const [sections, setSections] = useState<HomepageSection[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setSections(getHomepageSections())

    const handleUpdate = (event: CustomEvent<HomepageSection[]>) => {
      setSections(event.detail)
    }

    window.addEventListener('homepage-customization-updated', handleUpdate as EventListener)
    return () => {
      window.removeEventListener('homepage-customization-updated', handleUpdate as EventListener)
    }
  }, [])

  const handleToggleVisibility = (sectionId: string) => {
    toggleSectionVisibility(sectionId)
    const updated = getHomepageSections()
    setSections(updated)
    showInfoToast('Section visibility updated')
  }

  const handleReorder = (newOrder: HomepageSection[]) => {
    // Update order values based on new position
    const updated = newOrder.map((section, index) => ({
      ...section,
      order: index,
    }))
    setSections(updated)
  }

  const handleSave = () => {
    // Ensure order is correct before saving
    const orderedSections = sections.map((section, index) => ({
      ...section,
      order: index,
    }))
    reorderSections(orderedSections.map((s) => s.id))
    showSuccessToast('Homepage layout saved!')
    window.location.reload() // Reload to apply changes
  }

  const handleReset = () => {
    if (confirm('Reset homepage to default layout? This cannot be undone.')) {
      resetHomepageLayout()
      setSections(getHomepageSections())
      showInfoToast('Homepage reset to default')
      window.location.reload()
    }
  }

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl flex items-center justify-center"
        aria-label="Customize homepage"
        title="Customize homepage"
      >
        <Settings className="w-6 h-6" />
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-96 max-h-[80vh] bg-background/95 backdrop-blur-md border-2 border-border rounded-lg shadow-2xl overflow-hidden"
    >
      <Card className="border-0 shadow-none bg-background/95 backdrop-blur-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customize Homepage</CardTitle>
              <CardDescription>Reorder and show/hide sections</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(false)
                onClose?.()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
          <Reorder.Group
            axis="y"
            values={sections}
            onReorder={handleReorder}
            className="space-y-2"
          >
            {sections.map((section) => (
              <Reorder.Item
                key={section.id}
                value={section}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-move"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Label htmlFor={`toggle-${section.id}`} className="cursor-pointer">
                    {section.name}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleVisibility(section.id)}
                    title={section.visible ? 'Hide section' : 'Show section'}
                  >
                    {section.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Switch
                    id={`toggle-${section.id}`}
                    checked={section.visible}
                    onCheckedChange={() => handleToggleVisibility(section.id)}
                  />
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </CardContent>
        <div className="p-4 border-t flex gap-2">
          <Button onClick={handleSave} className="flex-1" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Layout
          </Button>
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

