'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface VoiceCommand {
  command: string
  action: () => void
  description: string
}

export default function VoiceCommands() {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const recognitionRef = useRef<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if browser supports Web Speech API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
      }

      recognition.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1]
        const text = lastResult[0].transcript
        setTranscript(text)

        if (lastResult.isFinal) {
          handleCommand(text.toLowerCase().trim())
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        
        switch (event.error) {
          case 'no-speech':
            setError('No speech detected. Please try again.')
            break
          case 'aborted':
            setError('Speech recognition was aborted.')
            break
          case 'network':
            setError('Network error. Please check your connection.')
            break
          case 'not-allowed':
            setError('Microphone permission denied. Please enable it in your browser settings.')
            break
          default:
            setError('An error occurred. Please try again.')
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } else {
      setIsSupported(false)
      setError('Your browser does not support voice commands.')
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const commands: VoiceCommand[] = [
    // Navigation
    {
      command: 'go home',
      action: () => router.push('/'),
      description: 'Navigate to home page',
    },
    {
      command: 'go to about',
      action: () => router.push('/about'),
      description: 'Navigate to about page',
    },
    {
      command: 'go to contact',
      action: () => {
        const contactSection = document.getElementById('contact')
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' })
        } else {
          router.push('/#contact')
        }
      },
      description: 'Scroll to contact section',
    },
    // Content Pages
    {
      command: 'go to projects',
      action: () => router.push('/projects'),
      description: 'Navigate to projects',
    },
    {
      command: 'go to blog',
      action: () => router.push('/blog'),
      description: 'Navigate to blog',
    },
    {
      command: 'go to case studies',
      action: () => router.push('/case-studies'),
      description: 'Navigate to case studies',
    },
    {
      command: 'go to resources',
      action: () => router.push('/resources'),
      description: 'Navigate to resources',
    },
    {
      command: 'go to learning paths',
      action: () => router.push('/learning-paths'),
      description: 'Navigate to learning paths',
    },
    {
      command: 'go to testimonials',
      action: () => router.push('/testimonials'),
      description: 'Navigate to testimonials',
    },
    {
      command: 'go to timeline',
      action: () => router.push('/timeline'),
      description: 'Navigate to timeline',
    },
    {
      command: 'go to music',
      action: () => router.push('/music'),
      description: 'Navigate to music player',
    },
    {
      command: 'go to achievements',
      action: () => router.push('/achievements'),
      description: 'Navigate to achievements',
    },
    // Tools
    {
      command: 'open ai assistant',
      action: () => router.push('/portfolio-assistant'),
      description: 'Open AI portfolio assistant',
    },
    {
      command: 'go to skills match',
      action: () => router.push('/skills-match'),
      description: 'Navigate to skills matching tool',
    },
    {
      command: 'go to roi calculator',
      action: () => router.push('/roi-calculator'),
      description: 'Navigate to ROI calculator',
    },
    {
      command: 'go to assessment',
      action: () => router.push('/assessment'),
      description: 'Navigate to assessment dashboard',
    },
    {
      command: 'go to resume',
      action: () => router.push('/resume'),
      description: 'Navigate to resume generator',
    },
    {
      command: 'go to contact hub',
      action: () => router.push('/contact-hub'),
      description: 'Navigate to contact hub',
    },
    {
      command: 'go to business card',
      action: () => router.push('/card'),
      description: 'Navigate to virtual business card',
    },
    {
      command: 'go to live demos',
      action: () => router.push('/demos'),
      description: 'Navigate to live project demos',
    },
    {
      command: 'go to demos',
      action: () => router.push('/demos'),
      description: 'Navigate to project demos',
    },
    {
      command: 'go to architecture',
      action: () => router.push('/architecture'),
      description: 'Navigate to technical architecture showcase',
    },
    {
      command: 'go to collaboration',
      action: () => router.push('/collaboration'),
      description: 'Navigate to team collaboration proof',
    },
    // Analytics & Data
    {
      command: 'go to analytics',
      action: () => router.push('/analytics'),
      description: 'Navigate to analytics dashboard',
    },
    {
      command: 'go to activity',
      action: () => router.push('/activity'),
      description: 'Navigate to activity feed',
    },
    {
      command: 'go to recommendations',
      action: () => router.push('/recommendations'),
      description: 'Navigate to content recommendations',
    },
    {
      command: 'go to project timeline',
      action: () => router.push('/projects-timeline'),
      description: 'Navigate to project timeline',
    },
    {
      command: 'go to skill tree',
      action: () => router.push('/skills-tree'),
      description: 'Navigate to skill tree',
    },
    // Developer Tools
    {
      command: 'go to code snippets',
      action: () => router.push('/code'),
      description: 'Navigate to code snippet library',
    },
    {
      command: 'go to uses',
      action: () => router.push('/uses'),
      description: 'Navigate to uses page',
    },
    {
      command: 'go to calendar',
      action: () => router.push('/calendar'),
      description: 'Navigate to availability calendar',
    },
    // Utilities
    {
      command: 'open command palette',
      action: () => {
        // Trigger Ctrl+K
        const event = new KeyboardEvent('keydown', {
          key: 'k',
          ctrlKey: true,
          bubbles: true,
        })
        document.dispatchEvent(event)
      },
      description: 'Open command palette',
    },
    // Natural language commands
    {
      command: 'tell me about',
      action: () => {
        // Open AI assistant with context
        router.push('/portfolio-assistant')
      },
      description: 'Ask about Mohamed (opens AI assistant)',
    },
    {
      command: 'what can you do',
      action: () => {
        router.push('/portfolio-assistant')
      },
      description: 'Learn about capabilities',
    },
    {
      command: 'show me projects',
      action: () => router.push('/projects'),
      description: 'Navigate to projects',
    },
    {
      command: 'show me blog',
      action: () => router.push('/blog'),
      description: 'Navigate to blog',
    },
    {
      command: 'download resume',
      action: () => {
        const link = document.createElement('a')
        link.href = '/resume'
        link.click()
      },
      description: 'Download resume',
    },
    {
      command: 'go to project analyzer',
      action: () => router.push('/project-analyzer'),
      description: 'Navigate to project analyzer',
    },
    {
      command: 'go to code playground',
      action: () => router.push('/code-playground'),
      description: 'Navigate to code playground',
    },
    {
      command: 'analyze project',
      action: () => router.push('/project-analyzer'),
      description: 'Open project analyzer',
    },
  ]

  const handleCommand = (text: string) => {
    // Try exact match first
    let matchedCommand = commands.find((cmd) => text === cmd.command)
    
    // If no exact match, try partial match
    if (!matchedCommand) {
      matchedCommand = commands.find((cmd) => text.includes(cmd.command))
    }
    
    // If still no match, try fuzzy matching for natural language
    if (!matchedCommand) {
      const lowerText = text.toLowerCase()
      
      // Natural language patterns
      if (lowerText.includes('tell me about') || lowerText.includes('who are you') || lowerText.includes('about you')) {
        matchedCommand = commands.find((cmd) => cmd.command === 'tell me about')
      } else if (lowerText.includes('projects') || lowerText.includes('show projects') || lowerText.includes('my work')) {
        matchedCommand = commands.find((cmd) => cmd.command === 'show me projects')
      } else if (lowerText.includes('blog') || lowerText.includes('articles') || lowerText.includes('posts')) {
        matchedCommand = commands.find((cmd) => cmd.command === 'show me blog')
      } else if (lowerText.includes('resume') || lowerText.includes('cv') || lowerText.includes('download resume')) {
        matchedCommand = commands.find((cmd) => cmd.command === 'download resume')
      } else if (lowerText.includes('analyze') && lowerText.includes('project')) {
        matchedCommand = commands.find((cmd) => cmd.command === 'analyze project')
      }
    }
    
    if (matchedCommand) {
      matchedCommand.action()
      setTranscript('')
      setIsOpen(false)
    } else {
      // If command not recognized, offer to send to AI assistant
      setError(`Command not recognized: "${text}". Say "tell me about" to ask questions, or try: ${commands.slice(0, 5).map(c => c.command).join(', ')}`)
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setError(null)
      setTranscript('')
      setIsOpen(true)
      try {
        recognitionRef.current.start()
      } catch (err) {
        console.error('Error starting recognition:', err)
        setError('Failed to start voice recognition.')
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setIsOpen(false)
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Voice Control Button */}
      <button
        onClick={toggleListening}
        className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-primary hover:bg-primary/90 text-primary-foreground'
        }`}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>

      {/* Voice Command Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass rounded-xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Volume2 className="text-primary" size={20} />
                <h3 className="font-semibold">Voice Commands</h3>
              </div>
              <button
                onClick={stopListening}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {isListening && (
              <motion.div
                className="mb-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="text-sm text-muted-foreground mb-2">Listening...</div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-8 bg-primary rounded-full"
                      animate={{
                        height: [8, 24, 8],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {transcript && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">You said:</div>
                <div className="text-sm font-mono">{transcript}</div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="text-sm text-red-500">{error}</div>
              </div>
            )}

            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                Available Commands:
              </div>
              {commands.map((cmd, index) => (
                <div
                  key={index}
                  className="text-xs p-2 bg-muted/50 rounded border border-border"
                >
                  <div className="font-mono text-primary">{cmd.command}</div>
                  <div className="text-muted-foreground mt-1">{cmd.description}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

