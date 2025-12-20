'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  FileText,
  FolderGit2,
  Settings,
  Image,
  BarChart3,
  BookOpen,
  Briefcase,
  Package,
  Music,
  Globe,
  MessageSquare,
  Mail,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navGroups = [
  {
    label: 'Main',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/content', label: 'All Content', icon: FileText },
      { href: '/admin/content/blog', label: 'Blog Posts', icon: BookOpen },
      { href: '/admin/content/case-studies', label: 'Case Studies', icon: Briefcase },
      { href: '/admin/content/resources', label: 'Resources', icon: Package },
      { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
    ],
  },
  {
    label: 'Tools',
    items: [
      { href: '/admin/github', label: 'GitHub Repos', icon: FolderGit2 },
      { href: '/admin/ai', label: 'AI Tools', icon: Image },
      { href: '/admin/pages', label: 'Page CMS', icon: Globe },
      { href: '/admin/music', label: 'Music', icon: Music },
    ],
  },
  {
    label: 'Analytics & Settings',
    items: [
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export default function MobileAdminWrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close sheet when route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b bg-background px-4 py-3 flex items-center justify-between">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-lg">Admin Menu</h2>
              </div>
              <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {navGroups.map((group) => (
                  <div key={group.label}>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      {group.label}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-accent hover:text-accent-foreground'
                            )}
                            onClick={() => setOpen(false)}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Mobile Content */}
      <div className="p-4">{children}</div>
    </div>
  )
}

