'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ONBOARDING_STEPS,
  hasCompletedOnboarding,
  markOnboardingComplete,
  type OnboardingStep,
} from '@/lib/onboarding-steps'

interface GuidedTourProps {
  onComplete?: () => void
}

export default function GuidedTour({ onComplete }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if user has completed onboarding
    if (hasCompletedOnboarding()) {
      return
    }

    // Show tour after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true)
      updateTargetElement(0)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const updateTargetElement = (stepIndex: number) => {
    const step = ONBOARDING_STEPS[stepIndex]
    if (!step) return

    // Wait for DOM to be ready
    setTimeout(() => {
      let element: HTMLElement | null = null

      if (step.target === 'body') {
        element = document.body
      } else {
        element = document.querySelector(step.target) as HTMLElement
      }

      setTargetElement(element)
    }, 100)
  }

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      const next = currentStep + 1
      setCurrentStep(next)
      updateTargetElement(next)
    } else {
      completeTour()
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1
      setCurrentStep(prev)
      updateTargetElement(prev)
    }
  }

  const skipTour = () => {
    markOnboardingComplete()
    setIsVisible(false)
    if (onComplete) onComplete()
  }

  const completeTour = () => {
    markOnboardingComplete()
    setIsVisible(false)
    
    // Track achievement
    if (typeof window !== 'undefined' && (window as any).unlockAchievement) {
      ;(window as any).unlockAchievement('complete-onboarding')
    }
    
    if (onComplete) onComplete()
  }

  if (!isVisible || hasCompletedOnboarding()) {
    return null
  }

  const step = ONBOARDING_STEPS[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === ONBOARDING_STEPS.length - 1

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={nextStep}
          />

          {/* Tooltip */}
          {targetElement && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-[9999]"
              style={{
                top: targetElement === document.body
                  ? '50%'
                  : `${targetElement.getBoundingClientRect().bottom + window.scrollY + 20}px`,
                left: targetElement === document.body
                  ? '50%'
                  : `${targetElement.getBoundingClientRect().left + window.scrollX}px`,
                transform: targetElement === document.body ? 'translate(-50%, -50%)' : 'none',
              }}
            >
              <Card className="w-80 md:w-96 bg-background/95 backdrop-blur-md shadow-2xl border-2 border-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <div className="text-xs text-muted-foreground mt-1">
                        Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={skipTour}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{step.content}</p>

                  {step.action && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        step.action?.onClick()
                        nextStep()
                      }}
                    >
                      {step.action.label}
                    </Button>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={skipTour}
                      className="gap-2"
                    >
                      <SkipForward className="h-4 w-4" />
                      Skip Tour
                    </Button>

                    <div className="flex items-center gap-2">
                      {!isFirst && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={previousStep}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={isLast ? completeTour : nextStep}
                        className="gap-2"
                      >
                        {isLast ? 'Get Started' : 'Next'}
                        {!isLast && <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex gap-1">
                    {ONBOARDING_STEPS.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          index <= currentStep ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}

