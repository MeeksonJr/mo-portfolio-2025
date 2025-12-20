'use client'

import { motion } from 'framer-motion'
import { GraduationCap, ChevronDown, Award } from 'lucide-react'
import { useState } from 'react'

const education = [
  {
    school: 'Old Dominion University',
    degree: 'B.S. in Computer Science',
    status: 'Currently enrolled',
    period: '2024 - Present',
    relevantCourses: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (C++)',
      'Computer Architecture',
      'Linear Algebra',
      'Discrete Mathematics',
      'Database Systems',
    ],
  },
  {
    school: 'Tidewater Community College',
    degree: 'A.S. in Computer Science',
    status: 'Graduated',
    period: '2022 - 2024',
    achievement: '1st Place Internship Winner (Fall 2024)',
    relevantCourses: ['Python Programming', 'Java Fundamentals', 'Web Development', 'Data Structures', 'Calculus I & II'],
  },
]

export default function CoursesSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <GraduationCap className="text-primary" size={20} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Education</h2>
        </div>
        <p className="text-sm md:text-base text-muted-foreground">Academic foundation and continuous learning</p>
      </div>

      {/* Education List - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {education.map((edu, idx) => {
          const isExpanded = expandedIndex === idx

          return (
            <motion.div
              key={edu.school}
              className="glass-enhanced rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -2 }}
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="text-primary" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold mb-1">{edu.school}</h3>
                    <p className="text-sm text-foreground/80 font-medium mb-1">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground">{edu.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-xs px-2 py-1 rounded-md font-medium ${
                      edu.status === 'Graduated'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {edu.status}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              {/* Achievement */}
              {edu.achievement && (
                <div className="mb-3 p-2 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Award className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-primary">{edu.achievement}</span>
                  </div>
                </div>
              )}

              {/* Expanded Courses */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-border/50"
                >
                  <h4 className="text-xs font-semibold mb-3">Relevant Courses</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {edu.relevantCourses.map((course, i) => (
                      <div
                        key={i}
                        className="text-xs px-2 py-1 bg-muted/50 rounded-md font-medium text-center"
                      >
                        {course}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

