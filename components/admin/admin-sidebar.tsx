'use client'

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
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/github', label: 'GitHub Repos', icon: FolderGit2 },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/content/blog', label: 'Blog Posts', icon: BookOpen },
  { href: '/admin/content/case-studies', label: 'Case Studies', icon: Briefcase },
  { href: '/admin/content/resources', label: 'Resources', icon: Package },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/admin/pages', label: 'Page CMS', icon: Globe },
  { href: '/admin/music', label: 'Music', icon: Music },
  { href: '/admin/ai', label: 'AI Tools', icon: Image },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-4">
      <div className="mb-8">
        <Link href="/admin" className="text-2xl font-bold text-primary">
          Admin
        </Link>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

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
      </nav>
    </aside>
  )
}

