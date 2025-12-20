'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, ArrowRight, Sparkles, CheckCircle2, 
  Zap, Target, MessageCircle, FolderGit2,
  Briefcase, GraduationCap, Calculator, Play,
  User, Building2, GraduationCap as School, Code
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { usePersonalization } from '@/components/personalization/visitor-profile-provider'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: typeof Sparkles
  target?: string
  action?: () => void
  link?: string
  highlight?: string
}

// Get personalized welcome message based on visitor type
const getWelcomeMessage = (visitorType?: string) => {
  const messages: Record<string, { title: string; description: string }> = {
    recruiter: {
      title: 'Welcome, Recruiter! 👔',
      description: 'I\'m Mohamed Datt, a Full Stack Developer. This tour will show you the tools designed specifically for recruiters - Quick Assessment, Skills Matching, and One-Click Resume. Let\'s get started!',
    },
    company: {
      title: 'Welcome! 🏢',
      description: 'I\'m Mohamed Datt, a Full Stack Developer. Discover how I can help your company with ROI calculations, live project demos, and technical expertise. This tour will guide you through everything.',
    },
    agent: {
      title: 'Welcome, Agent! 🤝',
      description: 'I\'m Mohamed Datt, a Full Stack Developer. This tour highlights the Candidate Summary, Portfolio Comparison, and Agent Dashboard - all designed to make your job easier.',
    },
    student: {
      title: 'Welcome, Student! 🎓',
      description: 'I\'m Mohamed Datt, a Full Stack Developer. Explore my learning paths, code snippets library, and project implementations. This tour will show you how to learn from my portfolio.',
    },
    developer: {
      title: 'Welcome, Fellow Developer! 💻',
      description: 'I\'m Mohamed Datt, a Full Stack Developer. Check out my code playground, technical architecture, and open-source projects. This tour will show you the technical side of my portfolio.',
    },
    default: {
      title: 'Welcome to My Portfolio! 👋',
      description: 'I\'m Mohamed Datt, a Full Stack Developer. This interactive tour will show you around. You can skip anytime!',
    },
  }
  return messages[visitorType || 'default'] || messages.default
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to My Portfolio! 👋', // Will be overridden dynamically
    description: 'I\'m Mohamed Datt, a Full Stack Developer. This interactive tour will show you around. You can skip anytime!',
    icon: Sparkles,
  },
  {
    id: 'quick-assessment',
    title: 'Quick Assessment Dashboard 📊',
    description: 'Recruiters love this! Get a 30-second overview of my skills, experience, and projects. Perfect for quick evaluations.',
    icon: Target,
    link: '/assessment',
    highlight: 'assessment',
  },
  {
    id: 'skills-match',
    title: 'Skills Matching Tool 🎯',
    description: 'Input job requirements and see how my skills match. Get instant match percentage and detailed analysis.',
    icon: Target,
    link: '/skills-match',
    highlight: 'skills-match',
  },
  {
    id: 'roi-calculator',
    title: 'ROI Calculator 💰',
    description: 'Calculate the potential business impact of hiring me. See cost savings, efficiency improvements, and revenue impact.',
    icon: Calculator,
    link: '/roi-calculator',
    highlight: 'roi-calculator',
  },
  {
    id: 'live-demos',
    title: 'Live Project Demos 🚀',
    description: 'See my projects in action! Interactive live demos of real working applications, not just screenshots.',
    icon: Play,
    link: '/demos',
    highlight: 'demos',
  },
  {
    id: 'contact-hub',
    title: 'Universal Contact Hub 📞',
    description: 'Contact me through any channel you prefer - email, calendar booking, LinkedIn, GitHub, phone, or WhatsApp.',
    icon: MessageCircle,
    link: '/contact-hub',
    highlight: 'contact-hub',
  },
  {
    id: 'ai-assistant',
    title: 'AI Portfolio Assistant 🤖',
    description: 'Ask questions about my portfolio in natural language. Get instant answers powered by AI.',
    icon: Zap,
    link: '/portfolio-assistant',
    highlight: 'portfolio-assistant',
  },
  {
    id: 'resume',
    title: 'One-Click Resume Generator ⚡',
    description: 'Download my resume in multiple formats (ATS-friendly, creative, traditional) with one click. QR codes included!',
    icon: Briefcase,
    link: '/resume',
    highlight: 'resume',
  },
  {
    id: 'projects',
    title: 'Projects & Case Studies 📁',
    description: 'Explore my portfolio of projects, case studies, and technical implementations. Filter by technology or category.',
    icon: FolderGit2,
    link: '/projects',
    highlight: 'projects',
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🎉',
    description: 'You\'ve completed the tour! Feel free to explore. Don\'t forget to check out the achievements system and try the command palette (Ctrl+K).',
    icon: CheckCircle2,
  },
]

export default function InteractiveOnboarding() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)
  const { profile } = usePersonalization()

  // Get personalized welcome message
  const welcomeMessage = getWelcomeMessage(profile?.type)
  const personalizedSteps = ONBOARDING_STEPS.map((step, index) => {
    if (index === 0) {
      return {
        ...step,
        title: welcomeMessage.title,
        description: welcomeMessage.description,
      }
    }
    return step
  })

  useEffect(() => {
    // Check if user has seen onboarding before
    const seen = localStorage.getItem('onboarding_completed')
    if (seen) {
      setHasSeenOnboarding(true)
      return
    }

    // Show onboarding after a short delay for first-time visitors
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    setIsOpen(false)
    localStorage.setItem('onboarding_completed', 'true')
    
    // Unlock achievement
    if (typeof window !== 'undefined' && (window as any).unlockAchievement) {
      ;(window as any).unlockAchievement('complete-onboarding')
    }
  }

  const currentStepData = personalizedSteps[currentStep]
  const Icon = currentStepData.icon
  const progress = ((currentStep + 1) / personalizedSteps.length) * 100

  if (hasSeenOnboarding || !isOpen) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleSkip}
          />

          {/* Onboarding Card - Centered and fixed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md mx-4 tour-guide"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              willChange: 'transform',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="shadow-2xl border-2">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Step {currentStep + 1} of {personalizedSteps.length}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSkip}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Progress value={progress} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  {currentStepData.description}
                </CardDescription>

                {currentStepData.link && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Try it now:</span>
                      <Button asChild size="sm" variant="outline">
                        <Link href={currentStepData.link} onClick={handleComplete}>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Visit Page
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}

                {currentStepData.id === 'complete' && (
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Achievement Unlocked!</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You've completed the onboarding tour. Check your achievements page to see your progress!
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      className="flex-1"
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    className={currentStep > 0 ? 'flex-1' : 'w-full'}
                  >
                    {currentStep === personalizedSteps.length - 1 ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Complete Tour
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="w-full text-xs"
                >
                  Skip tour
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

