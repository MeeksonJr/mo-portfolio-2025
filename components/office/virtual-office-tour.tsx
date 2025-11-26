'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Laptop,
  Coffee,
  Book,
  Lightbulb,
  Wifi,
  Zap,
  X,
  Info,
} from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Hotspot {
  id: string
  x: number // Percentage from left
  y: number // Percentage from top
  title: string
  description: string
  icon: React.ReactNode
  equipment?: {
    name: string
    model?: string
    specs?: string[]
  }
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'monitor',
    x: 30,
    y: 25,
    title: 'Primary Monitor',
    description: '27" 4K display for coding and design work',
    icon: <Monitor className="h-5 w-5" />,
    equipment: {
      name: 'LG UltraFine 27"',
      specs: ['4K UHD', 'IPS Panel', 'USB-C'],
    },
  },
  {
    id: 'laptop',
    x: 50,
    y: 60,
    title: 'Development Laptop',
    description: 'Main workstation for all development tasks',
    icon: <Laptop className="h-5 w-5" />,
    equipment: {
      name: 'MacBook Pro',
      specs: ['M1 Pro', '16GB RAM', '1TB SSD'],
    },
  },
  {
    id: 'keyboard',
    x: 45,
    y: 75,
    title: 'Mechanical Keyboard',
    description: 'Custom mechanical keyboard for comfortable typing',
    icon: <Keyboard className="h-5 w-5" />,
    equipment: {
      name: 'Custom Mechanical',
      specs: ['Cherry MX', 'RGB Backlight', 'Ergonomic'],
    },
  },
  {
    id: 'mouse',
    x: 60,
    y: 75,
    title: 'Wireless Mouse',
    description: 'Precision mouse for design and development',
    icon: <Mouse className="h-5 w-5" />,
    equipment: {
      name: 'Logitech MX Master',
      specs: ['Wireless', 'Multi-device', 'Precision'],
    },
  },
  {
    id: 'headphones',
    x: 70,
    y: 30,
    title: 'Studio Headphones',
    description: 'High-quality headphones for focused work',
    icon: <Headphones className="h-5 w-5" />,
    equipment: {
      name: 'Audio-Technica',
      specs: ['Studio Quality', 'Noise Cancelling', 'Comfortable'],
    },
  },
  {
    id: 'coffee',
    x: 80,
    y: 50,
    title: 'Coffee Setup',
    description: 'Essential fuel for long coding sessions',
    icon: <Coffee className="h-5 w-5" />,
  },
  {
    id: 'books',
    x: 20,
    y: 70,
    title: 'Tech Books',
    description: 'Reference books and learning resources',
    icon: <Book className="h-5 w-5" />,
  },
  {
    id: 'lighting',
    x: 15,
    y: 40,
    title: 'Desk Lighting',
    description: 'Adjustable lighting for optimal work environment',
    icon: <Lightbulb className="h-5 w-5" />,
  },
]

export default function VirtualOfficeTour() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [viewMode, setViewMode] = useState<'360' | 'interactive'>('interactive')

  // Placeholder for 360° image - in production, this would be a real 360° image
  const image360Url = '/images/office-360.jpg' // Placeholder path

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Virtual Office Tour</h1>
        <p className="text-muted-foreground">
          Explore my workspace setup and development environment
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={viewMode === 'interactive' ? 'default' : 'outline'}
          onClick={() => setViewMode('interactive')}
        >
          Interactive Tour
        </Button>
        <Button
          variant={viewMode === '360' ? 'default' : 'outline'}
          onClick={() => setViewMode('360')}
        >
          360° View
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>
                Click on hotspots to learn more about my setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === '360' ? (
                <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
                  {/* Placeholder for 360° viewer */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">
                        360° image viewer coming soon
                      </p>
                      <p className="text-sm text-muted-foreground">
                        In production, this would use a 360° image viewer library
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg overflow-hidden">
                  {/* Workspace Image Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <Monitor className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Workspace image placeholder
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Click hotspots to explore
                      </p>
                    </div>
                  </div>

                  {/* Interactive Hotspots */}
                  {HOTSPOTS.map((hotspot) => (
                    <motion.button
                      key={hotspot.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedHotspot(hotspot)}
                      className="absolute z-10 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                      // eslint-disable-next-line react/forbid-dom-props
                      style={{
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      title={hotspot.title}
                      aria-label={hotspot.title}
                    >
                      {hotspot.icon}
                    </motion.button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Setup Details */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Setup Details</CardTitle>
              <CardDescription>Complete list of equipment and tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HOTSPOTS.filter((h) => h.equipment).map((hotspot) => (
                  <div
                    key={hotspot.id}
                    className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                    onClick={() => setSelectedHotspot(hotspot)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {hotspot.icon}
                      <div>
                        <h4 className="font-semibold">{hotspot.equipment?.name}</h4>
                        <p className="text-sm text-muted-foreground">{hotspot.title}</p>
                      </div>
                    </div>
                    {hotspot.equipment?.specs && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {hotspot.equipment.specs.map((spec) => (
                          <Badge key={spec} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Hotspot Details */}
        <div className="lg:col-span-1">
          <AnimatePresence>
            {selectedHotspot ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedHotspot.icon}
                        <CardTitle>{selectedHotspot.title}</CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedHotspot(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{selectedHotspot.description}</p>

                    {selectedHotspot.equipment && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">Equipment Details</span>
                        </div>
                        <div className="pl-6 space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Model:</span>{' '}
                            {selectedHotspot.equipment.name}
                          </p>
                          {selectedHotspot.equipment.model && (
                            <p className="text-sm">
                              <span className="font-medium">Variant:</span>{' '}
                              {selectedHotspot.equipment.model}
                            </p>
                          )}
                          {selectedHotspot.equipment.specs && (
                            <div className="mt-2">
                              <p className="text-sm font-medium mb-1">Specifications:</p>
                              <ul className="list-disc list-inside space-y-1">
                                {selectedHotspot.equipment.specs.map((spec) => (
                                  <li key={spec} className="text-sm text-muted-foreground">
                                    {spec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Explore the Workspace</CardTitle>
                  <CardDescription>
                    Click on any hotspot to learn more about my setup
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {HOTSPOTS.map((hotspot) => (
                      <button
                        key={hotspot.id}
                        onClick={() => setSelectedHotspot(hotspot)}
                        className="w-full p-3 text-left border rounded-lg hover:border-primary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {hotspot.icon}
                          <div>
                            <p className="font-semibold">{hotspot.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {hotspot.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

