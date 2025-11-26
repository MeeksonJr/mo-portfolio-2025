'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Radio,
  Clock,
  Coffee,
  Code,
  BookOpen,
  Briefcase,
  Zap,
  Moon,
  Sun,
  Globe,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type ActivityStatus = 'available' | 'busy' | 'away' | 'offline'
type ActivityType = 'coding' | 'meeting' | 'learning' | 'designing' | 'writing' | 'resting'

interface Activity {
  status: ActivityStatus
  type: ActivityType
  message: string
  timezone: string
  currentTime: string
}

const ACTIVITY_TYPES: Record<ActivityType, { label: string; icon: React.ReactNode; color: string }> = {
  coding: { label: 'Coding', icon: <Code className="h-4 w-4" />, color: 'bg-green-500' },
  meeting: { label: 'In Meeting', icon: <Briefcase className="h-4 w-4" />, color: 'bg-blue-500' },
  learning: { label: 'Learning', icon: <BookOpen className="h-4 w-4" />, color: 'bg-purple-500' },
  designing: { label: 'Designing', icon: <Zap className="h-4 w-4" />, color: 'bg-yellow-500' },
  writing: { label: 'Writing', icon: <BookOpen className="h-4 w-4" />, color: 'bg-indigo-500' },
  resting: { label: 'Resting', icon: <Coffee className="h-4 w-4" />, color: 'bg-orange-500' },
}

const STATUS_COLORS: Record<ActivityStatus, string> = {
  available: 'bg-green-500',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
  offline: 'bg-gray-500',
}

export default function ActivityStatusIndicator() {
  const [activity, setActivity] = useState<Activity>({
    status: 'available',
    type: 'coding',
    message: 'Working on portfolio features',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    currentTime: new Date().toLocaleTimeString(),
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setActivity((prev) => ({
        ...prev,
        currentTime: new Date().toLocaleTimeString(),
      }))
    }, 60000)

    // Load saved activity from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('activity-status')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setActivity(parsed)
        } catch (error) {
          console.error('Error loading activity status:', error)
        }
      }
    }

    return () => clearInterval(interval)
  }, [])

  const handleStatusChange = (status: ActivityStatus) => {
    const updated = { ...activity, status }
    setActivity(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('activity-status', JSON.stringify(updated))
    }
  }

  const handleTypeChange = (type: ActivityType) => {
    const updated = { ...activity, type }
    setActivity(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('activity-status', JSON.stringify(updated))
    }
  }

  const handleMessageChange = (message: string) => {
    const updated = { ...activity, message }
    setActivity(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('activity-status', JSON.stringify(updated))
    }
  }

  const getStatusLabel = (status: ActivityStatus) => {
    switch (status) {
      case 'available':
        return 'Available'
      case 'busy':
        return 'Busy'
      case 'away':
        return 'Away'
      case 'offline':
        return 'Offline'
    }
  }

  const activityType = ACTIVITY_TYPES[activity.type]

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Activity Status</h1>
        <p className="text-muted-foreground">
          Show your current activity and availability status
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Display */}
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
            <CardDescription>Your current activity and availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className={`w-4 h-4 rounded-full ${STATUS_COLORS[activity.status]} animate-pulse`}
                />
                <div
                  className={`absolute inset-0 rounded-full ${STATUS_COLORS[activity.status]} opacity-50 animate-ping`}
                />
              </div>
              <div>
                <p className="font-semibold">{getStatusLabel(activity.status)}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.timezone} • {activity.currentTime}
                </p>
              </div>
            </div>

            {/* Activity Type */}
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className={`${activityType.color} text-white p-2 rounded-lg`}>
                {activityType.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{activityType.label}</p>
                <p className="text-sm text-muted-foreground">{activity.message}</p>
              </div>
            </div>

            {/* Embed Code */}
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-semibold mb-2">Embed Code</p>
              <code className="text-xs text-muted-foreground break-all">
                {`<iframe src="${typeof window !== 'undefined' ? window.location.origin : ''}/activity-status" width="300" height="150"></iframe>`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Status Editor */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Update Status</CardTitle>
                <CardDescription>Change your activity and availability</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Done' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Selection */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Availability Status</label>
              <div className="grid grid-cols-2 gap-2">
                {(['available', 'busy', 'away', 'offline'] as ActivityStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      activity.status === status
                        ? 'border-primary bg-primary/10'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${STATUS_COLORS[status]}`} />
                      <span className="text-sm font-medium">{getStatusLabel(status)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Type Selection */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Current Activity</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(ACTIVITY_TYPES).map(([type, config]) => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type as ActivityType)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      activity.type === type
                        ? 'border-primary bg-primary/10'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`${config.color} text-white p-1.5 rounded`}>
                        {config.icon}
                      </div>
                      <span className="text-sm font-medium">{config.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Message */}
            {isEditing && (
              <div>
                <label className="text-sm font-semibold mb-2 block">Custom Message</label>
                <textarea
                  value={activity.message}
                  onChange={(e) => handleMessageChange(e.target.value)}
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  placeholder="What are you working on?"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

