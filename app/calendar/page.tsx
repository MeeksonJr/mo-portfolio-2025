import { Metadata } from 'next'
import AvailabilityCalendar from '@/components/calendar/availability-calendar'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Book a Meeting | Mohamed Datt',
  description: 'Schedule a call, interview, or meeting. View available time slots and book directly. Timezone-aware scheduling with automatic confirmations.',
  type: 'website',
  tags: ['calendar', 'booking', 'meeting', 'interview', 'schedule', 'Mohamed Datt'],
})

export default function CalendarPage() {
  return <AvailabilityCalendar />
}

