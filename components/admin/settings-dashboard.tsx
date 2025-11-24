'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Github, Sparkles, FileText, Mail, Loader2, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface SettingsData {
  github_sync_enabled: boolean
  github_sync_frequency: string
  default_ai_model: string
  image_generation_model: string
  [key: string]: any
}

export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<SettingsData>({
    github_sync_enabled: true,
    github_sync_frequency: 'daily',
    default_ai_model: 'gemini',
    image_generation_model: 'stabilityai/stable-diffusion-xl-base-1.0',
  })
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch('/api/admin/settings', {
        method: 'GET',
        headers,
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        const settingsMap: Partial<SettingsData> = {}
        
        // Convert array of settings to object
        if (data.settings) {
          data.settings.forEach((setting: { key: string; value: any }) => {
            // Parse JSONB values
            if (typeof setting.value === 'string') {
              try {
                settingsMap[setting.key] = JSON.parse(setting.value)
              } catch {
                settingsMap[setting.key] = setting.value
              }
            } else {
              settingsMap[setting.key] = setting.value
            }
          })
        }

        // Merge with defaults to ensure all required properties exist
        setSettings({
          github_sync_enabled: settingsMap.github_sync_enabled ?? true,
          github_sync_frequency: settingsMap.github_sync_frequency ?? 'daily',
          default_ai_model: settingsMap.default_ai_model ?? 'gemini',
          image_generation_model: settingsMap.image_generation_model ?? 'stabilityai/stable-diffusion-xl-base-1.0',
          ...settingsMap,
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      // Convert settings object to array format
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value),
      }))

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({ settings: settingsArray }),
      })

      if (response.ok) {
        toast.success('Settings saved successfully!')
        setHasChanges(false)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save settings')
      }
    } catch (error: any) {
      console.error('Error saving settings:', error)
      toast.error(error.message || 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="general">
              <Settings className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="github">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Configuration
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="mr-2 h-4 w-4" />
              Content Defaults
            </TabsTrigger>
          </TabsList>

          {hasChanges && (
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic configuration for your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                General settings coming soon. This will include site name, description, and other basic configurations.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="github" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GitHub Integration</CardTitle>
              <CardDescription>
                Configure GitHub repository synchronization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="github-sync">Enable GitHub Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync GitHub repositories
                  </p>
                </div>
                <Switch
                  id="github-sync"
                  checked={settings.github_sync_enabled}
                  onCheckedChange={(checked) => updateSetting('github_sync_enabled', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sync-frequency">Sync Frequency</Label>
                <Select
                  value={settings.github_sync_frequency}
                  onValueChange={(value) => updateSetting('github_sync_frequency', value)}
                >
                  <SelectTrigger id="sync-frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">GitHub Token Status</p>
                <p className="text-sm text-muted-foreground">
                  {process.env.NEXT_PUBLIC_GITHUB_TOKEN ? (
                    <span className="text-green-600">✓ Configured</span>
                  ) : (
                    <span className="text-yellow-600">⚠ Not configured (check environment variables)</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>
                Configure AI models and generation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-ai-model">Default AI Model</Label>
                <Select
                  value={settings.default_ai_model}
                  onValueChange={(value) => updateSetting('default_ai_model', value)}
                >
                  <SelectTrigger id="default-ai-model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Gemini 2.0 Flash</SelectItem>
                    <SelectItem value="groq">Groq (Llama)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Default model for content generation
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-model">Image Generation Model</Label>
                <Select
                  value={settings.image_generation_model}
                  onValueChange={(value) => updateSetting('image_generation_model', value)}
                >
                  <SelectTrigger id="image-model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stabilityai/stable-diffusion-xl-base-1.0">
                      Stable Diffusion XL
                    </SelectItem>
                    <SelectItem value="stabilityai/stable-diffusion-2-1">
                      Stable Diffusion 2.1
                    </SelectItem>
                    <SelectItem value="SG161222/Realistic_Vision_V5.1_noVAE">
                      Realistic Vision V5.1
                    </SelectItem>
                    <SelectItem value="runwayml/stable-diffusion-v1-5">
                      Stable Diffusion v1.5
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Model used for AI image generation
                </p>
              </div>

              <div className="rounded-lg border p-4 bg-muted/50 space-y-2">
                <p className="text-sm font-medium">API Keys Status</p>
                <div className="space-y-1 text-sm">
                  <p className={process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'text-green-600' : 'text-yellow-600'}>
                    {process.env.NEXT_PUBLIC_GEMINI_API_KEY ? '✓' : '⚠'} Gemini API Key
                  </p>
                  <p className={process.env.NEXT_PUBLIC_GROQ_API_KEY ? 'text-green-600' : 'text-yellow-600'}>
                    {process.env.NEXT_PUBLIC_GROQ_API_KEY ? '✓' : '⚠'} Groq API Key
                  </p>
                  <p className={process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN ? 'text-green-600' : 'text-yellow-600'}>
                    {process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN ? '✓' : '⚠'} Hugging Face Token
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: API keys are configured via environment variables and cannot be changed here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Defaults</CardTitle>
              <CardDescription>
                Default settings for new content creation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Content default settings coming soon. This will include default categories, tags, and other content preferences.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

