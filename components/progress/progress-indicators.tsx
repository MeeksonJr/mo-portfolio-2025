'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  FileText,
  BookOpen,
  Target,
  TrendingUp,
} from 'lucide-react'
import { motion } from 'framer-motion'

interface Step {
  id: string
  label: string
  completed: boolean
}

interface ProgressExample {
  id: string
  title: string
  description: string
  type: 'linear' | 'circular' | 'steps'
  value: number
  max: number
  steps?: Step[]
}

const EXAMPLES: ProgressExample[] = [
  {
    id: 'form',
    title: 'Form Progress',
    description: 'Multi-step form completion',
    type: 'steps',
    value: 2,
    max: 5,
    steps: [
      { id: '1', label: 'Personal Info', completed: true },
      { id: '2', label: 'Contact Details', completed: true },
      { id: '3', label: 'Preferences', completed: false },
      { id: '4', label: 'Review', completed: false },
      { id: '5', label: 'Submit', completed: false },
    ],
  },
  {
    id: 'reading',
    title: 'Reading Progress',
    description: 'Article reading completion',
    type: 'linear',
    value: 65,
    max: 100,
  },
  {
    id: 'achievement',
    title: 'Achievement Progress',
    description: 'Unlocking achievements',
    type: 'circular',
    value: 7,
    max: 10,
  },
  {
    id: 'goal',
    title: 'Goal Tracking',
    description: 'Monthly project goal',
    type: 'linear',
    value: 75,
    max: 100,
  },
]

export default function ProgressIndicators() {
  const [selectedExample, setSelectedExample] = useState<ProgressExample>(EXAMPLES[0])

  const CircularProgress = ({ value, max }: { value: number; max: number }) => {
    const percentage = (value / max) * 100
    const radius = 50
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90" width="128" height="128">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted"
          />
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-primary"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">of {max}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Progress Indicators</h1>
        <p className="text-muted-foreground">
          Visual progress tracking for multi-step processes, goals, and achievements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Examples List */}
        <div className="space-y-4">
          {EXAMPLES.map((example) => (
            <Card
              key={example.id}
              className={`cursor-pointer transition-colors ${
                selectedExample.id === example.id
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedExample(example)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{example.title}</h3>
                    <p className="text-sm text-muted-foreground">{example.description}</p>
                  </div>
                  <Badge variant="secondary">{example.type}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Example Display */}
        <Card>
          <CardHeader>
            <CardTitle>{selectedExample.title}</CardTitle>
            <CardDescription>{selectedExample.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Linear Progress */}
            {selectedExample.type === 'linear' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedExample.value} / {selectedExample.max} (
                    {Math.round((selectedExample.value / selectedExample.max) * 100)}%)
                  </span>
                </div>
                <Progress
                  value={(selectedExample.value / selectedExample.max) * 100}
                  className="h-3"
                />
                <div className="flex items-center gap-2 mt-4">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {selectedExample.max - selectedExample.value} remaining
                  </span>
                </div>
              </div>
            )}

            {/* Circular Progress */}
            {selectedExample.type === 'circular' && (
              <div className="flex flex-col items-center space-y-4">
                <CircularProgress value={selectedExample.value} max={selectedExample.max} />
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {selectedExample.value} of {selectedExample.max} completed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((selectedExample.value / selectedExample.max) * 100)}% complete
                  </p>
                </div>
              </div>
            )}

            {/* Step Progress */}
            {selectedExample.type === 'steps' && selectedExample.steps && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">
                    Step {selectedExample.value} of {selectedExample.max}
                  </span>
                  <Badge variant="secondary">
                    {Math.round((selectedExample.value / selectedExample.max) * 100)}% Complete
                  </Badge>
                </div>
                <div className="space-y-3">
                  {selectedExample.steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        {step.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            step.completed ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                      {index < selectedExample.steps!.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </motion.div>
                  ))}
                </div>
                <Progress
                  value={(selectedExample.value / selectedExample.max) * 100}
                  className="h-2 mt-4"
                />
              </div>
            )}

            {/* Usage Example */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-semibold mb-2">Usage Example</p>
              <code className="text-xs text-muted-foreground">
                {`<Progress value={${selectedExample.value}} max={${selectedExample.max}} />`}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

