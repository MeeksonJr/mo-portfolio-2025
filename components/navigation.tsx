"use client"

import { motion } from "framer-motion"
import { Menu, X, Download, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Group navigation links
  const mainLinks = [
    { name: "About", href: "/about" },
    { name: "Work", href: "#projects" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ]

  const contentLinks = [
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Resources", href: "/resources" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Timeline", href: "/timeline" },
    { name: "Music", href: "/music" },
    { name: "Achievements", href: "/achievements" },
    { name: "Assessment", href: "/assessment" },
    { name: "Skills Match", href: "/skills-match" },
    { name: "ROI Calculator", href: "/roi-calculator" },
    { name: "Live Demos", href: "/demos" },
    { name: "Contact Hub", href: "/contact-hub" },
    { name: "AI Assistant", href: "/portfolio-assistant" },
    { name: "Business Card", href: "/card" },
    { name: "Analytics", href: "/analytics" },
    { name: "Calendar", href: "/calendar" },
    { name: "Code Snippets", href: "/code" },
    { name: "Project Timeline", href: "/projects-timeline" },
  ]

  const allLinks = [...mainLinks, ...contentLinks]

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
          <div className="hidden lg:flex items-center gap-6">
            {mainLinks.map((link) => {
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
              <DropdownMenuContent align="end" className="w-48">
                {contentLinks.map((link) => (
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
            <a
              href="#contact"
              className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Hire Me
            </a>
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
            className="lg:hidden mt-4 glass rounded-lg p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col gap-3">
              {allLinks.map((link) => {
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
              <div className="border-t border-border pt-3 mt-2 space-y-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-foreground/70">Theme</span>
                  <ThemeToggle />
                </div>
                <a
                  href="/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors py-2"
                >
                  <Download size={16} />
                  Resume
                </a>
                <a
                  href="#contact"
                  className="block text-center px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Hire Me
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
