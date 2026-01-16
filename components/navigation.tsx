"use client"

import { motion } from "framer-motion"
import { Menu, X, Download, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserPreferencesDialog } from "@/components/preferences/user-preferences-dialog"
import LanguageSwitcher from "@/components/i18n/language-switcher"
import NotificationCenter from "@/components/notifications/notification-center"
import AvailabilityBadge from "@/components/availability-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { getContainerClasses } from "@/components/layout/page-container"

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Home page specific links (only show on home page) - Removed About, Work, Services per user request
  const homePageLinks = [
    { name: "Contact", href: "#contact" },
  ]

  // Content dropdown - Main content pages (consolidated)
  const contentLinks = [
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Resources", href: "/resources" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Timeline", href: "/timeline" },
    { name: "Music", href: "/music" },
    { name: "Games", href: "/games" },
    { name: "Achievements", href: "/achievements" },
  ]

  // Tools & Hubs dropdown - Interactive tools and utilities (consolidated)
  const toolsLinks = [
    { name: "Resume Hub", href: "/resume" },
    { name: "Code Hub", href: "/code" },
    { name: "Tools Hub", href: "/tools" },
    { name: "Insights Hub", href: "/insights" },
    { name: "Games", href: "/games" },
    { name: "AI Assistant", href: "/portfolio-assistant" },
    { name: "Live Demos", href: "/demos" },
  ]

  // For Recruiters (consolidated)
  const recruiterLinks = [
    { name: "For Recruiters", href: "/for-recruiters" },
    { name: "Portfolio Comparison", href: "/portfolio-comparison" },
    { name: "Agent Dashboard", href: "/agent-dashboard" },
  ]

  // All links for mobile menu
  const allLinks = [
    ...(isHomePage ? homePageLinks : []),
    ...contentLinks,
    ...toolsLinks,
    ...recruiterLinks,
  ]

  return (
    <motion.nav
      role="navigation"
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-lg py-3" : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={getContainerClasses('wide', 'default')}>
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl font-bold text-primary"
            aria-label="Mohamed Datt - Home"
          >
            Mohamed Datt
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1 justify-center max-w-4xl mx-4">
            {/* Home page specific links - only show on home page */}
            {isHomePage && homePageLinks.map((link) => {
              const isExternal = link.href.startsWith('#')
              const Component = isExternal ? 'a' : Link
              const props = isExternal ? { href: link.href } : { href: link.href }
              return (
                <Component
                  key={link.name}
                  {...props}
                  className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors whitespace-nowrap"
                >
                  {link.name}
                </Component>
              )
            })}
            
            {/* Content Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-1 outline-none whitespace-nowrap px-2">
                Content
                <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {contentLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link href={link.href} className="cursor-pointer" prefetch={true}>
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tools & Hubs Dropdown (consolidated) */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-1 outline-none whitespace-nowrap px-2">
                Tools
                <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {toolsLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link 
                      href={link.href} 
                      className="cursor-pointer" 
                      prefetch={true}
                    >
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* For Recruiters Dropdown (consolidated) */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-1 outline-none whitespace-nowrap px-2">
                Recruiters
                <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {recruiterLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link href={link.href} className="cursor-pointer" prefetch={true}>
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* CTA Buttons - Compact design */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
            <AvailabilityBadge variant="compact" className="hidden xl:flex" />
            <NotificationCenter />
            <div className="hidden xl:flex items-center gap-2">
              <LanguageSwitcher />
              <UserPreferencesDialog />
            </div>
            <ThemeToggle />
            <a
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 xl:px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              title="Download Resume"
            >
              <Download size={16} />
              <span className="hidden 2xl:inline">Resume</span>
            </a>
            {isHomePage ? (
              <a
                href="#contact"
                className="px-4 xl:px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Hire Me
              </a>
            ) : (
              <Link
                href="/#contact"
                className="px-4 xl:px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Contact
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden mt-4 glass rounded-lg p-4 max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col gap-4">
              {/* Home Page Links */}
              {isHomePage && (
                <>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Main
                  </div>
                  {homePageLinks.map((link) => {
                    const isExternal = link.href.startsWith('#')
                    const Component = isExternal ? 'a' : Link
                    const props = isExternal ? { href: link.href } : { href: link.href }
                    return (
                      <Component
                        key={link.name}
                        {...props}
                        className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Component>
                    )
                  })}
                </>
              )}

              {/* Content */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Content
                </div>
                {contentLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={true}
                    className="block text-sm font-medium text-foreground/70 hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Tools & Hubs */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Tools & Hubs
                </div>
                {toolsLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-sm font-medium text-foreground/70 hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* For Recruiters */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  For Recruiters
                </div>
                {recruiterLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-sm font-medium text-foreground/70 hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="border-t border-border pt-3 mt-2 space-y-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-foreground/70">Language</span>
                  <LanguageSwitcher />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-foreground/70">Preferences</span>
                  <UserPreferencesDialog />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-foreground/70">Theme</span>
                  <ThemeToggle />
                </div>
                <Link
                  href="/resume"
                  className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Download size={16} />
                  Resume
                </Link>
                {isHomePage ? (
                  <a
                    href="#contact"
                    className="block text-center px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Hire Me
                  </a>
                ) : (
                  <Link
                    href="/#contact"
                    className="block text-center px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
