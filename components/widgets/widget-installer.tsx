'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, FolderKanban, Wrench, BarChart3, Activity, TrendingUp, Music, Plus, Share2, Check } from 'lucide-react'
import { isIOS } from '@/lib/pwa-utils'
import { toast } from 'sonner'

const widgets = [
  {
    id: 'blog',
    name: 'Latest Blog Posts',
    description: 'View the latest blog posts',
    url: '/widgets/blog',
    icon: BookOpen,
    color: 'text-blue-500',
  },
  {
    id: 'case-studies',
    name: 'Latest Case Studies',
    description: 'View recent case studies',
    url: '/widgets/case-studies',
    icon: FolderKanban,
    color: 'text-purple-500',
  },
  {
    id: 'projects',
    name: 'Featured Projects',
    description: 'Browse featured projects',
    url: '/widgets/projects',
    icon: Wrench,
    color: 'text-green-500',
  },
  {
    id: 'resources',
    name: 'Popular Resources',
    description: 'Most viewed resources',
    url: '/widgets/resources',
    icon: Wrench,
    color: 'text-orange-500',
  },
  {
    id: 'stats',
    name: 'Site Statistics',
    description: 'Portfolio statistics',
    url: '/widgets/stats',
    icon: BarChart3,
    color: 'text-red-500',
  },
  {
    id: 'activity',
    name: 'Recent Activity',
    description: 'Latest comments and interactions',
    url: '/widgets/activity',
    icon: Activity,
    color: 'text-cyan-500',
  },
  {
    id: 'popular',
    name: 'Popular Content',
    description: 'Most viewed content',
    url: '/widgets/popular',
    icon: TrendingUp,
    color: 'text-yellow-500',
  },
  {
    id: 'music',
    name: 'Music Player',
    description: 'Quick access to music player',
    url: '/widgets/music',
    icon: Music,
    color: 'text-pink-500',
  },
]

export default function WidgetInstaller() {
  const [isIOSDevice, setIsIOSDevice] = useState(false)
  const [installedWidgets, setInstalledWidgets] = useState<string[]>([])

  useEffect(() => {
    setIsIOSDevice(isIOS())
    // Check for installed widgets from localStorage
    const installed = localStorage.getItem('installed_widgets')
    if (installed) {
      try {
        setInstalledWidgets(JSON.parse(installed))
      } catch (e) {
        console.error('Error parsing installed widgets:', e)
      }
    }
  }, [])

  const handleInstallWidget = async (widget: typeof widgets[0]) => {
    if (!isIOSDevice) {
      toast.error('Widget installation is currently optimized for iOS devices')
      return
    }

    try {
      // Open the widget page in a new window for iOS "Add to Home Screen"
      const widgetUrl = `${window.location.origin}${widget.url}`
      
      // Show instructions
      toast.info(
        `To install ${widget.name}: 1) Tap Share button 2) Select "Add to Home Screen" 3) Customize the name 4) Tap "Add"`,
        { duration: 10000 }
      )

      // Track installation attempt
      const current = [...installedWidgets]
      if (!current.includes(widget.id)) {
        current.push(widget.id)
        setInstalledWidgets(current)
        localStorage.setItem('installed_widgets', JSON.stringify(current))
      }

      // Open widget page
      window.open(widgetUrl, '_blank')
    } catch (error) {
      console.error('Error installing widget:', error)
      toast.error('Failed to install widget')
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Install Widgets</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Add these widgets to your iOS home screen for quick access to portfolio content.
          All widgets connect to the database and update automatically.
        </p>
        {!isIOSDevice && (
          <div className="mt-4 p-4 bg-muted rounded-lg max-w-md mx-auto">
            <p className="text-sm text-muted-foreground">
              Widget installation is optimized for iOS devices. Android support coming soon.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget) => {
          const Icon = widget.icon
          const isInstalled = installedWidgets.includes(widget.id)
          
          return (
            <Card key={widget.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-6 w-6 ${widget.color}`} />
                  {isInstalled && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <CardTitle className="text-lg">{widget.name}</CardTitle>
                <CardDescription>{widget.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(widget.url, '_blank')}
                    className="flex-1"
                  >
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleInstallWidget(widget)}
                    className="flex-1"
                    disabled={isInstalled}
                  >
                    {isInstalled ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Installed
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-1" />
                        Install
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            How to Install on iOS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Tap the "Install" button on any widget above</li>
            <li>The widget page will open in a new tab</li>
            <li>Tap the Share button (square with arrow) at the bottom of Safari</li>
            <li>Scroll down and select "Add to Home Screen"</li>
            <li>Customize the widget name if desired</li>
            <li>Tap "Add" in the top right corner</li>
            <li>The widget will appear on your home screen</li>
            <li>Tap the widget icon to open it anytime</li>
          </ol>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">💡 Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Widgets automatically refresh every few minutes</li>
              <li>Long press the widget icon to see additional options</li>
              <li>Organize widgets into folders on your home screen</li>
              <li>All widgets connect to the live database for real-time data</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

