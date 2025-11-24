'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  FolderGit2,
  FileText,
  BookOpen,
  Menu,
  User,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { UserPreferencesDialog } from '@/components/preferences/user-preferences-dialog'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Projects', href: '/projects', icon: FolderGit2 },
  { name: 'Blog', href: '/blog', icon: FileText },
  { name: 'Case Studies', href: '/case-studies', icon: BookOpen },
  { name: 'Menu', href: '#', icon: Menu, isMenu: true },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  if (!isMobile) return null

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      {/* Bottom Navigation Bar */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border lg:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-around h-16 px-2 safe-area-bottom">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/' && pathname === '/')
            const Icon = item.icon

            if (item.isMenu) {
              return (
                <button
                  key={item.name}
                  onClick={handleMenuClick}
                  className={`flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-lg transition-colors ${
                    isMenuOpen
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label="Open menu"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.name}</span>
                </button>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label={item.name}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </motion.nav>

      {/* Expanded Menu Modal */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed bottom-16 left-0 right-0 z-50 bg-background border-t border-border rounded-t-2xl shadow-2xl lg:hidden max-h-[70vh] overflow-y-auto safe-area-bottom"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-4 space-y-2">
                {/* Quick Links */}
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                    Quick Links
                  </h3>
                  <Link
                    href="/about"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">About</span>
                  </Link>
                  <Link
                    href="/resources"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Resources</span>
                  </Link>
                  <Link
                    href="/testimonials"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Testimonials</span>
                  </Link>
                  <Link
                    href="/timeline"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FolderGit2 className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Timeline</span>
                  </Link>
                </div>

                {/* Settings */}
                <div className="pt-2 border-t border-border">
                  <UserPreferencesDialog>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Settings className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Settings</span>
                    </button>
                  </UserPreferencesDialog>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="h-16 lg:hidden" />
    </>
  )
}

