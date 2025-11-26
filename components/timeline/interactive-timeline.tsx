'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Calendar, MapPin, GraduationCap, Briefcase, Heart } from 'lucide-react'

interface TimelineEvent {
  year: string
  title: string
  location: string
  description: string
  icon: React.ReactNode
  color: string
  images?: string[]
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '2000s',
    title: 'Born in Guinea',
    location: 'Conakry, Guinea',
    description: 'Born and raised in Guinea, West Africa. Early years shaped by curiosity and resilience.',
    icon: <MapPin className="w-6 h-6" />,
    color: 'bg-blue-500',
  },
  {
    year: '2010s',
    title: 'Moved to New York City',
    location: 'New York, USA',
    description: 'Moved to NYC as a child. Faced early challenges with language barriers but learned English in just 3 months using cartoons like Dora. This experience taught resilience and adaptability.',
    icon: <Heart className="w-6 h-6" />,
    color: 'bg-green-500',
  },
  {
    year: '2022',
    title: 'Started College Journey',
    location: 'Norfolk, Virginia',
    description: 'Began A.S. in Computer Science at Tidewater Community College. Discovered passion for programming and web development.',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'bg-purple-500',
  },
  {
    year: '2024',
    title: 'Software Developer Intern',
    location: 'Product Manager Accelerator',
    description: 'Joined as Software Developer Intern. Won 1st place out of 13 teams for best final app. Gained real-world experience in full-stack development.',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'bg-orange-500',
  },
  {
    year: '2024',
    title: 'Graduated A.S.',
    location: 'Tidewater Community College',
    description: 'Completed Associate of Science in Computer Science. Built foundation in algorithms, data structures, and software engineering principles.',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'bg-indigo-500',
  },
  {
    year: '2025',
    title: 'B.S. in Computer Science',
    location: 'Old Dominion University',
    description: 'Currently pursuing Bachelor of Science in Computer Science. Continuing to grow as a developer and explore AI-powered solutions.',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'bg-pink-500',
  },
]

export default function InteractiveTimeline() {
  const [activeEvent, setActiveEvent] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const timelineProgress = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <div ref={containerRef} className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Journey
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            From Guinea to New York to Norfolk - A story of resilience and growth
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform md:-translate-x-1/2" />

          {/* Progress indicator */}
          <motion.div
            className="absolute left-8 md:left-1/2 top-0 w-1 bg-white dark:bg-gray-900 transform md:-translate-x-1/2 origin-top"
            style={{ scaleY: timelineProgress }}
          />

          {/* Timeline events */}
          <div className="space-y-16 md:space-y-24">
            {timelineEvents.map((event, index) => (
              <TimelineEventCard
                key={index}
                event={event}
                index={index}
                isActive={activeEvent === index}
                onActivate={() => setActiveEvent(activeEvent === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface TimelineEventCardProps {
  event: TimelineEvent
  index: number
  isActive: boolean
  onActivate: () => void
}

function TimelineEventCard({ event, index, isActive, onActivate }: TimelineEventCardProps) {
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex items-center ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      } flex-col md:flex-row`}
    >
      {/* Content Card */}
      <div
        className={`flex-1 ${
          isEven ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
        } text-center md:text-left mb-4 md:mb-0`}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
          onClick={onActivate}
        >
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-3 ${event.color} text-white`}>
            <Calendar className="w-4 h-4" />
            {event.year}
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            {event.title}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3 justify-center md:justify-start">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {event.description}
          </p>

          {/* Expanded content */}
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              {event.images && event.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {event.images.map((image, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={image}
                      alt={`${event.title} - Image ${imgIndex + 1}`}
                      className="rounded-lg w-full h-32 object-cover"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {milestone.description || 'This milestone represents an important moment in the journey. Explore the timeline to learn more about the progression and achievements.'}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Timeline marker */}
      <div className="relative z-10 flex-shrink-0">
        <motion.div
          whileHover={{ scale: 1.2 }}
          className={`w-16 h-16 rounded-full ${event.color} flex items-center justify-center text-white shadow-lg cursor-pointer border-4 border-white dark:border-gray-900`}
          onClick={onActivate}
        >
          {event.icon}
        </motion.div>
      </div>

      {/* Spacer for mobile */}
      <div className="flex-1 md:hidden" />
    </motion.div>
  )
}
