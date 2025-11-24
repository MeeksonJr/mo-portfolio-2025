'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar as CalendarIcon, Clock, MapPin, Mail, 
  CheckCircle, XCircle, AlertCircle, Globe,
  Video, Phone, MessageCircle, ExternalLink, Briefcase
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import { resumeData } from '@/lib/resume-data'
import { toast } from 'sonner'
import { format, addDays, addHours, isSameDay, isBefore, startOfDay, setHours, setMinutes } from 'date-fns'

interface TimeSlot {
  time: Date
  available: boolean
  type?: 'call' | 'video' | 'interview' | 'consultation'
}

interface BookingForm {
  name: string
  email: string
  meetingType: string
  message: string
  selectedDate: Date | null
  selectedTime: Date | null
}

const TIMEZONE = 'America/New_York' // Eastern Time
const WORKING_HOURS = {
  start: 9, // 9 AM
  end: 17, // 5 PM
}
const SLOT_DURATION = 30 // minutes
const AVAILABLE_DAYS_AHEAD = 14

const MEETING_TYPES = [
  { value: 'interview', label: 'Job Interview', icon: Briefcase, color: 'text-blue-500' },
  { value: 'consultation', label: 'Consultation Call', icon: MessageCircle, color: 'text-purple-500' },
  { value: 'video', label: 'Video Call', icon: Video, color: 'text-green-500' },
  { value: 'phone', label: 'Phone Call', icon: Phone, color: 'text-orange-500' },
]

export default function AvailabilityCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [timezone, setTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: '',
    email: '',
    meetingType: 'consultation',
    message: '',
    selectedDate: null,
    selectedTime: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)

  const { personal } = resumeData

  // Generate available time slots for selected date
  useEffect(() => {
    if (!selectedDate) return

    const slots: TimeSlot[] = []
    const today = startOfDay(new Date())
    const selectedDay = startOfDay(selectedDate)

    // Only show slots for future dates
    if (isBefore(selectedDay, today)) {
      setAvailableSlots([])
      return
    }

    // Generate slots for the selected day
    for (let hour = WORKING_HOURS.start; hour < WORKING_HOURS.end; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_DURATION) {
        const slotTime = setMinutes(setHours(new Date(selectedDate), hour), minute)
        
        // Skip past times for today
        if (isSameDay(selectedDate, new Date()) && isBefore(slotTime, new Date())) {
          continue
        }

        slots.push({
          time: slotTime,
          available: true, // In a real app, check against actual calendar
          type: 'consultation',
        })
      }
    }

    setAvailableSlots(slots)
  }, [selectedDate])

  const handleSlotSelect = (slot: TimeSlot) => {
    setBookingForm(prev => ({
      ...prev,
      selectedDate: selectedDate || null,
      selectedTime: slot.time,
    }))
    setShowBookingForm(true)
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real implementation, this would:
      // 1. Send booking request to backend
      // 2. Create calendar event
      // 3. Send confirmation emails
      // 4. Update availability

      // For now, we'll use Cal.com integration or show a success message
      const calLink = `https://cal.com/mohameddatt/30min?date=${format(bookingForm.selectedTime!, 'yyyy-MM-dd')}&time=${format(bookingForm.selectedTime!, 'HH:mm')}`
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Booking request submitted! Redirecting to calendar...')
      
      // Open Cal.com with pre-filled details
      setTimeout(() => {
        window.open(calLink, '_blank')
      }, 1500)

      // Reset form
      setBookingForm({
        name: '',
        email: '',
        meetingType: 'consultation',
        message: '',
        selectedDate: null,
        selectedTime: null,
      })
      setShowBookingForm(false)
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDateDescription = (date: Date | undefined) => {
    if (!date) return 'Select a date'
    const today = new Date()
    const tomorrow = addDays(today, 1)
    
    if (isSameDay(date, today)) return 'Today'
    if (isSameDay(date, tomorrow)) return 'Tomorrow'
    return format(date, 'EEEE, MMMM d')
  }

  const disabledDates = (date: Date) => {
    // Disable past dates
    if (isBefore(date, startOfDay(new Date()))) return true
    // Disable dates too far in the future
    if (isBefore(addDays(new Date(), AVAILABLE_DAYS_AHEAD + 1), date)) return true
    // Disable weekends (optional - can be made configurable)
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday or Saturday
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <CalendarIcon className="h-10 w-10 text-primary" />
              Book a Meeting
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Schedule a call, interview, or consultation. Pick a time that works for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Select Date & Time
                  </CardTitle>
                  <CardDescription>
                    {getDateDescription(selectedDate)} • {timezone}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Calendar Component */}
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={disabledDates}
                      className="rounded-md border"
                    />
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Available Time Slots
                      </h3>
                      {availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                          {availableSlots.map((slot, idx) => (
                            <Button
                              key={idx}
                              variant={bookingForm.selectedTime?.getTime() === slot.time.getTime() ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleSlotSelect(slot)}
                              className="h-10"
                            >
                              {format(slot.time, 'h:mm a')}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No available slots for this date</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Booking Form */}
              {showBookingForm && bookingForm.selectedTime && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Confirm Booking</CardTitle>
                      <CardDescription>
                        {format(bookingForm.selectedTime!, 'EEEE, MMMM d, yyyy')} at {format(bookingForm.selectedTime!, 'h:mm a')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleBookingSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input
                            id="name"
                            value={bookingForm.name}
                            onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={bookingForm.email}
                            onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                            required
                            placeholder="john@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="meetingType">Meeting Type</Label>
                          <Select
                            value={bookingForm.meetingType}
                            onValueChange={(value) => setBookingForm(prev => ({ ...prev, meetingType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {MEETING_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message (Optional)</Label>
                          <Textarea
                            id="message"
                            value={bookingForm.message}
                            onChange={(e) => setBookingForm(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Tell me about what you'd like to discuss..."
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button type="submit" disabled={isSubmitting} className="flex-1">
                            {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowBookingForm(false)
                              setBookingForm(prev => ({ ...prev, selectedTime: null }))
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>

            {/* Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Meeting Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Duration</p>
                      <p className="text-sm text-muted-foreground">30 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Timezone</p>
                      <p className="text-sm text-muted-foreground">{timezone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Video className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Format</p>
                      <p className="text-sm text-muted-foreground">Video call (link provided)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Meeting Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Meeting Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {MEETING_TYPES.map((type) => {
                    const Icon = type.icon
                    return (
                      <div key={type.value} className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 ${type.color}`} />
                        <span className="text-sm">{type.label}</span>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Alternative Booking */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    Alternative Booking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Prefer to book directly? Use the link below:
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <a href="https://cal.com/mohameddatt/30min" target="_blank" rel="noopener noreferrer">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Open Cal.com
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <a href={`mailto:${personal.email}`} className="hover:underline">
                        {personal.email}
                      </a>
                    </div>
                    <p className="text-muted-foreground">
                      If you need to reschedule or have questions, feel free to reach out.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      <FooterLight />
    </>
  )
}

