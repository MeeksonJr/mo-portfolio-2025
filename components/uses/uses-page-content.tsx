'use client'

import { motion } from 'framer-motion'
import {
  Laptop,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Smartphone,
  Code,
  Database,
  Cloud,
  Settings,
  Zap,
  Palette,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const hardware = [
  {
    category: 'Computer',
    items: [
      { name: 'Laptop', description: 'Primary development machine', icon: Laptop },
      { name: 'External Monitor', description: '27" 4K display for coding', icon: Monitor },
      { name: 'Mechanical Keyboard', description: 'Custom mechanical keyboard', icon: Keyboard },
      { name: 'Wireless Mouse', description: 'Ergonomic mouse for long sessions', icon: Mouse },
      { name: 'Headphones', description: 'Noise-cancelling headphones', icon: Headphones },
      { name: 'Phone', description: 'Mobile device for testing', icon: Smartphone },
    ],
  },
]

const software = [
  {
    category: 'Development',
    items: [
      { name: 'VS Code', description: 'Primary code editor', icon: Code },
      { name: 'Git', description: 'Version control', icon: Code },
      { name: 'Node.js', description: 'JavaScript runtime', icon: Code },
      { name: 'pnpm', description: 'Package manager', icon: Code },
    ],
  },
  {
    category: 'Design & Tools',
    items: [
      { name: 'Figma', description: 'UI/UX design', icon: Palette },
      { name: 'Chrome DevTools', description: 'Browser debugging', icon: Settings },
      { name: 'Postman', description: 'API testing', icon: Cloud },
    ],
  },
]

const browserExtensions = [
  { name: 'React Developer Tools', description: 'React component inspector' },
  { name: 'Vercel', description: 'Deployment insights' },
  { name: 'Wappalyzer', description: 'Tech stack detection' },
  { name: 'ColorZilla', description: 'Color picker' },
  { name: 'JSON Formatter', description: 'Format JSON responses' },
]

const keyboardShortcuts = [
  { keys: 'Cmd/Ctrl + K', action: 'Command Palette' },
  { keys: 'Cmd/Ctrl + P', action: 'Quick File Open' },
  { keys: 'Cmd/Ctrl + Shift + P', action: 'Command Palette' },
  { keys: 'Cmd/Ctrl + B', action: 'Toggle Sidebar' },
  { keys: 'Cmd/Ctrl + `', action: 'Toggle Terminal' },
  { keys: 'Alt + Click', action: 'Multi-cursor' },
  { keys: 'Cmd/Ctrl + D', action: 'Select Next Occurrence' },
  { keys: 'Shift + Alt + F', action: 'Format Document' },
]

const deskSetup = {
  description: 'A clean, minimal workspace focused on productivity and creativity.',
  features: [
    'Ergonomic chair for long coding sessions',
    'Dual monitor setup for increased productivity',
    'Mechanical keyboard for better typing experience',
    'Wireless peripherals for a clean desk',
    'Plants for a calming environment',
  ],
}

export default function UsesPageContent() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">What I Use</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          My hardware, software, tools, and setup. Everything I use to build and create.
        </p>
      </motion.div>

      {/* Hardware */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Laptop className="w-6 h-6 text-primary" />
          Hardware
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hardware[0].items.map((item, index) => {
            const Icon = item.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </motion.section>

      {/* Software */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Code className="w-6 h-6 text-primary" />
          Software & Tools
        </h2>
        <div className="space-y-8">
          {software.map((category, catIndex) => (
            <div key={catIndex}>
              <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-primary" />
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{item.description}</CardDescription>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Browser Extensions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          Browser Extensions
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {browserExtensions.map((ext, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{ext.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{ext.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Keyboard Shortcuts */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Keyboard className="w-6 h-6 text-primary" />
          Keyboard Shortcuts
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {keyboardShortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className="font-medium">{shortcut.action}</span>
                  <Badge variant="outline" className="font-mono">
                    {shortcut.keys}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Desk Setup */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Desk Setup
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>My Workspace</CardTitle>
            <CardDescription>{deskSetup.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {deskSetup.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  )
}

