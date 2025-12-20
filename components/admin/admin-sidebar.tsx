'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

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

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openGroups, setOpenGroups] = useState<string[]>(['Main', 'Content'])

  // Auto-expand groups based on current path
  useEffect(() => {
    const activeGroup = navGroups.find((group) =>
      group.items.some(
        (item) =>
          pathname === item.href || pathname?.startsWith(item.href + '/')
      )
    )
    if (activeGroup && !openGroups.includes(activeGroup.label)) {
      setOpenGroups([...openGroups, activeGroup.label])
    }
  }, [pathname])

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label)
        ? prev.filter((g) => g !== label)
        : [...prev, label]
    )
  }

  return (
    <aside
      className={cn(
        'bg-card border-r border-border min-h-screen transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/admin" className="text-xl font-bold text-primary">
            Admin
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navGroups.map((group) => {
          if (isCollapsed) {
            // Collapsed view - show only icons
            return (
              <div key={group.label} className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    pathname === item.href ||
                    pathname?.startsWith(item.href + '/')

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center justify-center p-3 rounded-lg transition-colors relative group',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                      title={item.label}
                    >
                      <Icon size={20} />
                      {!isCollapsed && (
                        <span className="font-medium ml-3">{item.label}</span>
                      )}
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )
          }

          // Expanded view - show groups with collapsible
          return (
            <Collapsible
              key={group.label}
              open={openGroups.includes(group.label)}
              onOpenChange={() => toggleGroup(group.label)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>{group.label}</span>
                  {openGroups.includes(group.label) ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-1 mt-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive =
                      pathname === item.href ||
                      pathname?.startsWith(item.href + '/')

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </nav>
    </aside>
  )
}

