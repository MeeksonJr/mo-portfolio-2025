'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogOut, User, Search, Bell, Command } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'

const quickActions = [
  { label: 'Create Blog Post', href: '/admin/content/blog/new', shortcut: '⌘B' },
  { label: 'Browse GitHub Repos', href: '/admin/github', shortcut: '⌘G' },
  { label: 'AI Tools', href: '/admin/ai', shortcut: '⌘A' },
  { label: 'Analytics', href: '/admin/analytics', shortcut: '⌘⌥A' },
  { label: 'Settings', href: '/admin/settings', shortcut: '⌘,' },
]

export default function AdminHeader() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifications, setNotifications] = useState(0)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const runCommand = (href: string) => {
    setSearchOpen(false)
    router.push(href)
  }

  return (
    <>
      <header className="border-b border-border bg-card px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search admin... (⌘K)"
                className="pl-10 pr-4"
                onFocus={() => setSearchOpen(true)}
                readOnly
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setSearchOpen(true)}
            >
              <Command className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase() || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user?.email || 'Admin'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search admin panel..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            {quickActions.map((action) => (
              <CommandItem
                key={action.href}
                onSelect={() => runCommand(action.href)}
              >
                <span>{action.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {action.shortcut}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand('/admin')}>
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => runCommand('/admin/content')}>
              All Content
            </CommandItem>
            <CommandItem onSelect={() => runCommand('/admin/content/blog')}>
              Blog Posts
            </CommandItem>
            <CommandItem onSelect={() => runCommand('/admin/content/case-studies')}>
              Case Studies
            </CommandItem>
            <CommandItem onSelect={() => runCommand('/admin/github')}>
              GitHub Repos
            </CommandItem>
            <CommandItem onSelect={() => runCommand('/admin/analytics')}>
              Analytics
            </CommandItem>
            <CommandItem onSelect={() => runCommand('/admin/settings')}>
              Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

