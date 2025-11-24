"use client"

import { motion } from "framer-motion"
import { Menu, X, Download, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserPreferencesDialog } from "@/components/preferences/user-preferences-dialog"
import LanguageSwitcher from "@/components/i18n/language-switcher"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

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

  // Home page specific links (only show on home page)
  const homePageLinks = [
    { name: "About", href: "/about" },
    { name: "Work", href: "#projects" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ]

  // Content dropdown - Main content pages
  const contentLinks = [
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Architecture", href: "/architecture" },
    { name: "Collaboration", href: "/collaboration" },
    { name: "Resources", href: "/resources" },
    { name: "Learning Paths", href: "/learning-paths" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Timeline", href: "/timeline" },
    { name: "Music", href: "/music" },
    { name: "Achievements", href: "/achievements" },
  ]

  // Tools dropdown - Interactive tools and utilities
  const toolsLinks = [
    { name: "AI Assistant", href: "/portfolio-assistant" },
    { name: "Project Analyzer", href: "/project-analyzer" },
    { name: "Code Playground", href: "/code-playground" },
    { name: "Portfolio Code", href: "/portfolio-code" },
    { name: "Skills Match", href: "/skills-match" },
    { name: "ROI Calculator", href: "/roi-calculator" },
    { name: "Assessment", href: "/assessment" },
    { name: "Resume Generator", href: "/resume" },
    { name: "Contact Hub", href: "/contact-hub" },
    { name: "Business Card", href: "/card" },
    { name: "Live Demos", href: "/demos" },
  ]

  // Analytics & Data dropdown - Data visualization and insights
  const analyticsLinks = [
    { name: "Analytics", href: "/analytics" },
    { name: "Activity Feed", href: "/activity" },
    { name: "Recommendations", href: "/recommendations" },
    { name: "Project Timeline", href: "/projects-timeline" },
    { name: "Skill Tree", href: "/skills-tree" },
  ]

  // Developer dropdown - Code and technical content
  const developerLinks = [
    { name: "Code Snippets", href: "/code" },
    { name: "Uses", href: "/uses" },
    { name: "Calendar", href: "/calendar" },
  ]

  // For Agents & Recruiters
  const agentLinks = [
    { name: "Candidate Summary", href: "/candidate-summary" },
    { name: "Portfolio Comparison", href: "/portfolio-comparison" },
    { name: "Agent Dashboard", href: "/agent-dashboard" },
  ]

  // All links for mobile menu
  const allLinks = [
    ...(isHomePage ? homePageLinks : []),
    ...contentLinks,
    ...toolsLinks,
    ...analyticsLinks,
    ...developerLinks,
    ...agentLinks,
  ]

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-lg py-3" : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary">
            Mohamed Datt
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Home page specific links - only show on home page */}
            {isHomePage && homePageLinks.map((link) => {
              const isExternal = link.href.startsWith('#')
              const Component = isExternal ? 'a' : Link
              const props = isExternal ? { href: link.href } : { href: link.href }
              return (
                <Component
                  key={link.name}
                  {...props}
                  className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
                >
                  {link.name}
                </Component>
              )
            })}
            
            {/* Content Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-1 outline-none">
                Content
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {contentLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link href={link.href} className="cursor-pointer">
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-1 outline-none">
                Tools
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {toolsLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link href={link.href} className="cursor-pointer">
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Analytics & Data Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-1 outline-none">
                Analytics
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {analyticsLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link href={link.href} className="cursor-pointer">
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Developer Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-1 outline-none">
                Developer
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {developerLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link href={link.href} className="cursor-pointer">
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Agents & Recruiters Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-1 outline-none">
                For Agents
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {agentLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link href={link.href} className="cursor-pointer">
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <UserPreferencesDialog />
            <ThemeToggle />
            <a
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              <Download size={16} />
              <span className="hidden xl:inline">Resume</span>
            </a>
            {isHomePage ? (
              <a
                href="#contact"
                className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Hire Me
              </a>
            ) : (
              <Link
                href="/#contact"
                className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
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
                    className="block text-sm font-medium text-foreground/70 hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Tools */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Tools
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

              {/* Analytics */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Analytics
                </div>
                {analyticsLinks.map((link) => (
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

              {/* Developer */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Developer
                </div>
                {developerLinks.map((link) => (
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
                  <span className="text-sm font-medium text-foreground/70">Preferences</span>
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
