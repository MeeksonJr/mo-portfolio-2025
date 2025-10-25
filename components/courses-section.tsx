"use client"

import { motion } from "framer-motion"
import { GraduationCap, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

const education = [
  {
    school: "Old Dominion University",
    degree: "B.S. in Computer Science",
    status: "Currently enrolled",
    period: "2024 - Present",
    relevantCourses: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming (C++)",
      "Computer Architecture",
      "Linear Algebra",
      "Discrete Mathematics",
      "Database Systems",
    ],
  },
  {
    school: "Tidewater Community College",
    degree: "A.S. in Computer Science",
    status: "Graduated",
    period: "2022 - 2024",
    achievement: "1st Place Internship Winner (Fall 2024)",
    relevantCourses: [
      "Python Programming",
      "Java Fundamentals",
      "Web Development",
      "Data Structures",
      "Calculus I & II",
    ],
  },
]

export default function CoursesSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section id="courses" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Education</h2>
            <p className="text-muted-foreground text-lg">Academic foundation and continuous learning</p>
          </div>

          <div className="space-y-6">
            {education.map((edu, idx) => (
              <motion.div
                key={edu.school}
                className="glass rounded-2xl overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{edu.school}</h3>
                        <p className="text-foreground/80 font-medium">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground mt-1">{edu.period}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        edu.status === "Graduated" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {edu.status}
                    </span>
                  </div>

                  {edu.achievement && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800 font-medium">🏆 {edu.achievement}</p>
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                    className="flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all"
                  >
                    Relevant Coursework
                    {expandedIndex === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {expandedIndex === idx && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-border"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="grid md:grid-cols-2 gap-2">
                        {edu.relevantCourses.map((course) => (
                          <div key={course} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>{course}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
