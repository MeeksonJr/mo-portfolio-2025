'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, FolderKanban, BookOpen, Mail, Menu } from 'lucide-react'
import Link from 'next/link'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/about', icon: User, label: 'About' },
  { href: '/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/blog', icon: BookOpen, label: 'Blog' },
  { href: '/contact', icon: Mail, label: 'Contact' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show nav when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    // Only show on mobile
    const checkMobile = () => {
      const isMobile = window.innerWidth < 1024
      setIsVisible(isMobile)
    }

    checkMobile()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkMobile)
    }
  }, [lastScrollY])

  // Don't show on desktop
  if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-sm border-t border-border shadow-lg"
        >
          <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href === '/' && pathname === '/')
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

