'use client'

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
import PageContainer from '@/components/layout/page-container'
import { AnimatedSection } from '@/components/ui/animated-section'
import { SectionHeader } from '@/components/ui/section-header'
import { TYPOGRAPHY, SECTION_SPACING } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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
    <PageContainer width="standard" padding="default">
      <div className={SECTION_SPACING.paddingNormal}>
      {/* Header */}
      <SectionHeader
        title="What I Use"
        description="My hardware, software, tools, and setup. Everything I use to build and create."
        align="center"
        variant="large"
        spacing="large"
      />

      {/* Hardware */}
      <AnimatedSection variant="fade-up" delay={0.1} className={SECTION_SPACING.normal}>
        <SectionHeader
          title="Hardware"
          icon={Laptop}
          align="left"
          spacing="tight"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hardware[0].items.map((item, index) => {
            const Icon = item.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <CardTitle className={cn(TYPOGRAPHY.h5)}>{item.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className={cn(TYPOGRAPHY.bodySmall)}>{item.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </AnimatedSection>

      {/* Software */}
      <AnimatedSection variant="fade-up" delay={0.2} className={SECTION_SPACING.normal}>
        <SectionHeader
          title="Software & Tools"
          icon={Code}
          align="left"
          spacing="tight"
        />
        <div className="space-y-8">
          {software.map((category, catIndex) => (
            <div key={catIndex}>
              <h3 className={cn(TYPOGRAPHY.h4, "mb-4")}>{category.category}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-primary" />
                          <CardTitle className={cn(TYPOGRAPHY.h5)}>{item.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className={cn(TYPOGRAPHY.bodySmall)}>{item.description}</CardDescription>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Browser Extensions */}
      <AnimatedSection variant="fade-up" delay={0.3} className={SECTION_SPACING.normal}>
        <SectionHeader
          title="Browser Extensions"
          icon={Zap}
          align="left"
          spacing="tight"
        />
        <div className="grid md:grid-cols-2 gap-4">
          {browserExtensions.map((ext, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className={cn(TYPOGRAPHY.h5)}>{ext.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={cn(TYPOGRAPHY.bodySmall)}>{ext.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </AnimatedSection>

      {/* Keyboard Shortcuts */}
      <AnimatedSection variant="fade-up" delay={0.4} className={SECTION_SPACING.normal}>
        <SectionHeader
          title="Keyboard Shortcuts"
          icon={Keyboard}
          align="left"
          spacing="tight"
        />
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {keyboardShortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className={cn(TYPOGRAPHY.body, "font-medium")}>{shortcut.action}</span>
                  <Badge variant="outline" className={cn(TYPOGRAPHY.bodySmall, "font-mono")}>
                    {shortcut.keys}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Desk Setup */}
      <AnimatedSection variant="fade-up" delay={0.5} className={SECTION_SPACING.normal}>
        <SectionHeader
          title="Desk Setup"
          icon={Settings}
          align="left"
          spacing="tight"
        />
        <Card>
          <CardHeader>
            <CardTitle className={cn(TYPOGRAPHY.h4)}>My Workspace</CardTitle>
            <CardDescription className={cn(TYPOGRAPHY.body)}>{deskSetup.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {deskSetup.features.map((feature, index) => (
                <li key={index} className={cn(TYPOGRAPHY.body, "flex items-start gap-2")}>
                  <span className="text-primary mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </AnimatedSection>
      </div>
    </PageContainer>
  )
}

