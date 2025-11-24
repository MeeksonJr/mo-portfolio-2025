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
} from 'lucide-react'

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
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
      // Close with Escape
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

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
            onSelect={() => runCommand(() => router.push('/resources'))}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Resources</span>
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
  )
}

