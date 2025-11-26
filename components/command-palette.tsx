'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import {
  Home,
  FileText,
  Briefcase,
  FolderGit2,
  BookOpen,
  Wrench,
  Mail,
  Github,
  Download,
  Eye,
  MessageCircle,
  Settings,
  User,
  Search,
  ArrowRight,
  BarChart3,
  Target,
  Calculator,
  Play,
  Bot,
  CreditCard,
  Calendar,
  Code2,
  Activity,
  Sparkles,
  Layers,
  Users,
} from 'lucide-react'
import { GlobalSearch } from '@/components/search/global-search'

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Command Palette (Ctrl/Cmd + K)
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => {
          const newOpen = !open
          // Track achievement when command palette is opened (only on open, not close)
          if (newOpen && typeof window !== 'undefined' && (window as any).unlockAchievement) {
            ;(window as any).unlockAchievement('command-palette')
          }
          return newOpen
        })
      }
      // Global Search (Ctrl/Cmd + S)
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(true)
      }
      // Close with Escape
      if (e.key === 'Escape') {
        if (searchOpen) {
          setSearchOpen(false)
        } else if (open) {
          setOpen(false)
        }
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, searchOpen])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Quick Search */}
          <CommandGroup heading="Search">
            <CommandItem
              onSelect={() => {
                setOpen(false)
                setSearchOpen(true)
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Search All Content</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/'))}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/about'))}
          >
            <User className="mr-2 h-4 w-4" />
            <span>About</span>
            <CommandShortcut>⌘A</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => {
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            })}
          >
            <FolderGit2 className="mr-2 h-4 w-4" />
            <span>Projects</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/projects'))}
          >
            <FolderGit2 className="mr-2 h-4 w-4" />
            <span>All Projects</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => {
              document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
            })}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Services</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            })}
          >
            <Mail className="mr-2 h-4 w-4" />
            <span>Contact</span>
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Content Pages */}
        <CommandGroup heading="Content">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/blog'))}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>Blog</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/case-studies'))}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Case Studies</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/architecture'))}
          >
            <Layers className="mr-2 h-4 w-4" />
            <span>Technical Architecture</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/collaboration'))}
          >
            <Users className="mr-2 h-4 w-4" />
            <span>Team Collaboration</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/resources'))}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Resources</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/learning-paths'))}
          >
            <Target className="mr-2 h-4 w-4" />
            <span>Learning Paths</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/assessment'))}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Quick Assessment</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/skills-match'))}
          >
            <Target className="mr-2 h-4 w-4" />
            <span>Skills Matching Tool</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/roi-calculator'))}
          >
            <Calculator className="mr-2 h-4 w-4" />
            <span>ROI Calculator</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/demos'))}
          >
            <Play className="mr-2 h-4 w-4" />
            <span>Live Project Demos</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/contact-hub'))}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Universal Contact Hub</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/portfolio-assistant'))}
          >
            <Bot className="mr-2 h-4 w-4" />
            <span>AI Portfolio Assistant</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/card'))}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Virtual Business Card</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/analytics'))}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Portfolio Analytics</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/calendar'))}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>Book a Meeting</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/code'))}
          >
            <Code2 className="mr-2 h-4 w-4" />
            <span>Code Snippets Library</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/code-review'))}
          >
            <Code2 className="mr-2 h-4 w-4" />
            <span>Code Review Simulator</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/projects-timeline'))}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>Project Timeline</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/skills-tree'))}
          >
            <Target className="mr-2 h-4 w-4" />
            <span>Interactive Skill Tree</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/activity'))}
          >
            <Activity className="mr-2 h-4 w-4" />
            <span>Live Activity Feed</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/recommendations'))}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            <span>AI Recommendations</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Actions */}
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/resume'))}
          >
            <Download className="mr-2 h-4 w-4" />
            <span>View Resume</span>
            <CommandShortcut>⌘R</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => {
              const chatbotButton = document.querySelector('[data-chatbot-toggle]') as HTMLButtonElement
              if (chatbotButton) chatbotButton.click()
            })}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Open Chatbot</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => {
              window.open('https://github.com/MeeksonJr', '_blank')
            })}
          >
            <Github className="mr-2 h-4 w-4" />
            <span>View GitHub</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Admin (if logged in) */}
        <CommandGroup heading="Admin">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/admin'))}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Admin Dashboard</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>

    {/* Global Search Dialog */}
    <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}

