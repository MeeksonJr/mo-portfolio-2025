'use client'

import { useState } from 'react'
import { Settings, X, RotateCcw, Palette, Type, Zap, Filter, BookOpen, Contrast } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import type { UserPreferences } from '@/lib/user-preferences'

export function UserPreferencesDialog() {
  const { preferences, updatePreferences, reset } = useUserPreferences()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const handleThemeChange = (value: string) => {
    const themeValue = value as 'light' | 'dark' | 'auto'
    updatePreferences({ theme: themeValue })
    setTheme(themeValue === 'auto' ? 'system' : themeValue)
    toast.success('Theme preference saved')
  }

  const handleFontSizeChange = (value: string) => {
    updatePreferences({ fontSize: value as UserPreferences['fontSize'] })
    toast.success('Font size preference saved')
  }

  const handleAnimationsChange = (value: string) => {
    updatePreferences({ animations: value as UserPreferences['animations'] })
    toast.success('Animation preference saved')
  }

  const handleContentFilterChange = (key: keyof UserPreferences['contentFilters'], value: boolean) => {
    updatePreferences({
      contentFilters: {
        ...preferences.contentFilters,
        [key]: value,
      },
    })
    toast.success('Content filter updated')
  }

  const handleReadingModeChange = (key: keyof UserPreferences['readingMode'], value: number | string) => {
    updatePreferences({
      readingMode: {
        ...preferences.readingMode,
        [key]: value,
      },
    })
    toast.success('Reading mode preference saved')
  }

  const handleReset = () => {
    reset()
    setTheme('system')
    toast.success('Preferences reset to defaults')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Settings className="h-4 w-4" />
          <span className="sr-only">User Preferences</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            User Preferences
          </DialogTitle>
          <DialogDescription>
            Customize your experience on this site. Your preferences are saved locally.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Preference */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-semibold">Theme</Label>
            </div>
            <RadioGroup value={preferences.theme} onValueChange={handleThemeChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light" className="cursor-pointer">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark" className="cursor-pointer">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auto" id="theme-auto" />
                <Label htmlFor="theme-auto" className="cursor-pointer">Auto (System)</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-semibold">Font Size</Label>
            </div>
            <RadioGroup value={preferences.fontSize} onValueChange={handleFontSizeChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="font-small" />
                <Label htmlFor="font-small" className="cursor-pointer text-sm">Small</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="font-medium" />
                <Label htmlFor="font-medium" className="cursor-pointer">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="font-large" />
                <Label htmlFor="font-large" className="cursor-pointer text-lg">Large</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="xlarge" id="font-xlarge" />
                <Label htmlFor="font-xlarge" className="cursor-pointer text-xl">Extra Large</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Animations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-semibold">Animations</Label>
            </div>
            <RadioGroup value={preferences.animations} onValueChange={handleAnimationsChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enabled" id="anim-enabled" />
                <Label htmlFor="anim-enabled" className="cursor-pointer">Enabled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reduced" id="anim-reduced" />
                <Label htmlFor="anim-reduced" className="cursor-pointer">Reduced Motion</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="disabled" id="anim-disabled" />
                <Label htmlFor="anim-disabled" className="cursor-pointer">Disabled</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-muted-foreground">
              Respects your system's "prefers-reduced-motion" setting when set to "Reduced Motion"
            </p>
          </div>

          <Separator />

          {/* High Contrast Mode */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Contrast className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-semibold">High Contrast Mode</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Increase contrast for better visibility (WCAG AAA compliant)
            </p>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast" className="cursor-pointer">
                  Enable High Contrast
                </Label>
                <p className="text-xs text-muted-foreground">
                  Improves readability for users with visual impairments
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={preferences.highContrast}
                onCheckedChange={(checked) => {
                  updatePreferences({ highContrast: checked })
                  toast.success(checked ? 'High contrast mode enabled' : 'High contrast mode disabled')
                }}
              />
            </div>
          </div>

          <Separator />

          {/* Content Filters */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-semibold">Content Filters</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Control which content types are shown by default
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="filter-projects" className="cursor-pointer">
                  Show Projects
                </Label>
                <Switch
                  id="filter-projects"
                  checked={preferences.contentFilters.showProjects}
                  onCheckedChange={(checked) => handleContentFilterChange('showProjects', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="filter-blog" className="cursor-pointer">
                  Show Blog Posts
                </Label>
                <Switch
                  id="filter-blog"
                  checked={preferences.contentFilters.showBlog}
                  onCheckedChange={(checked) => handleContentFilterChange('showBlog', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="filter-case-studies" className="cursor-pointer">
                  Show Case Studies
                </Label>
                <Switch
                  id="filter-case-studies"
                  checked={preferences.contentFilters.showCaseStudies}
                  onCheckedChange={(checked) => handleContentFilterChange('showCaseStudies', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="filter-resources" className="cursor-pointer">
                  Show Resources
                </Label>
                <Switch
                  id="filter-resources"
                  checked={preferences.contentFilters.showResources}
                  onCheckedChange={(checked) => handleContentFilterChange('showResources', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Reading Mode Defaults */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-semibold">Reading Mode Defaults</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Set default preferences for reading mode
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Default Font Size: {preferences.readingMode.defaultFontSize}px</Label>
                <Slider
                  value={[preferences.readingMode.defaultFontSize]}
                  onValueChange={([value]) => handleReadingModeChange('defaultFontSize', value)}
                  min={14}
                  max={24}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Default Content Width: {preferences.readingMode.defaultMaxWidth}rem</Label>
                <Slider
                  value={[preferences.readingMode.defaultMaxWidth]}
                  onValueChange={([value]) => handleReadingModeChange('defaultMaxWidth', value)}
                  min={50}
                  max={80}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Default Theme</Label>
                <RadioGroup
                  value={preferences.readingMode.defaultTheme}
                  onValueChange={(value) => handleReadingModeChange('defaultTheme', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="rm-theme-light" />
                    <Label htmlFor="rm-theme-light" className="cursor-pointer">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="rm-theme-dark" />
                    <Label htmlFor="rm-theme-dark" className="cursor-pointer">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="auto" id="rm-theme-auto" />
                    <Label htmlFor="rm-theme-auto" className="cursor-pointer">Auto</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reset Button */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

