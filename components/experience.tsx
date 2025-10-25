"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, ExternalLink, Award, DollarSign, Users, Code, Database, Zap } from "lucide-react"

interface ExperienceItem {
  title: string
  company: string
  period: string
  type: "internship" | "freelance" | "founder" | "personal"
  achievements: string[]
  tech: string[]
  projectLink?: string
  salePrice?: string
  icon: React.ComponentType<any>
}

const experiences: ExperienceItem[] = [
  {
    title: "Full Stack Developer",
    company: "Internship Program",
    period: "Sept 2024 – Dec 2024",
    type: "internship",
    achievements: [
      "Won 1st place out of 13 teams for Best Application",
      "Built full-stack web app integrating APIs (Hugging Face, Gemini, Google Cloud Vision)",
      "Focused on connecting front-end and back-end, handling auth and data persistence"
    ],
    tech: ["Next.js", "Social Media API", "Gemini API", "Google Cloud Vision", "Authentication", "Data Persistence"],
    icon: Award
  },
  {
    title: "Freelance Developer",
    company: "InterviewPrep AI",
    period: "2025",
    type: "freelance",
    achievements: [
      "Designed and built AI-powered interview preparation platform",
      "Integrated Gemini API for dynamic question generation and feedback",
      "Sold the site for $500 to a private buyer",
      "Continued maintenance and improvement support post-sale"
    ],
    tech: ["Next.js", "Gemini API", "AI Integration", "Interview System", "Supabase", "PayPal", "VAPI"],
    salePrice: "$500",
    icon: DollarSign
  },
  {
    title: "Founder / Developer",
    company: "EduSphere AI",
    period: "2024",
    type: "founder",
    achievements: [
      "Created AI-powered SaaS platform for students (K–University)",
      "Built subscription system with PayPal integration",
      "Developed dark dashboard UI with animations",
      "Implemented AI-powered assignment helper and calendar integration"
    ],
    tech: ["Next.js", "TailwindCSS", "Supabase", "Gemini AI", "Hugging Face", "PayPal", "Framer Motion"],
    projectLink: "https://github.com/MeeksonJr/edusphere-ai",
    icon: Users
  },
  {
    title: "Founder / Developer",
    company: "SnapFind App",
    period: "2024",
    type: "founder",
    achievements: [
      "Developed visual content recognition and analysis app",
      "Integrated Google Cloud Vision, Gemini API, and Hugging Face",
      "Used Neon PostgreSQL for database management",
      "Deployed on Vercel with fully configured environment variables"
    ],
    tech: ["Next.js", "Google Cloud Vision", "Gemini API", "Hugging Face", "Neon PostgreSQL", "Vercel"],
    projectLink: "https://github.com/MeeksonJr/snapfind-app",
    icon: Database
  },
  {
    title: "Personal Project",
    company: "myLife SaaS App",
    period: "2025",
    type: "personal",
    achievements: [
      "Built AI-driven health management app",
      "Users can upload/scan medical reports for AI-powered health analyses",
      "Implemented ingredient breakdowns, health scores, and warnings",
      "Developed medical data management system"
    ],
    tech: ["Next.js", "Supabase", "PayPal Sandbox", "Framer Motion", "Groq/Gemini APIs", "Health Analytics"],
    projectLink: "https://github.com/MeeksonJr/mylife-saas",
    icon: Zap
  },
  {
    title: "Portfolio Website",
    company: "Current Project",
    period: "2025",
    type: "personal",
    achievements: [
      "Creative life themed site with command-hub interface",
      "Embedded AI chatbot (Gemini 2.0 Flash) for personal questions",
      "GitHub API integration displaying repositories",
      "Transitioning to professional glass-style portfolio",
      "Showcasing services, pricing, and sold projects"
    ],
    tech: ["Next.js", "TypeScript", "TailwindCSS", "Gemini API", "GitHub API", "Framer Motion"],
    projectLink: "https://github.com/MeeksonJr/mo-portfolio-2025",
    icon: Code
  }
]

const typeConfig = {
  internship: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Internship" },
  freelance: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Freelance" },
  founder: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", label: "Founder" },
  personal: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", label: "Personal" }
}

export default function Experience() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent mb-4">
            Professional Experience
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            From internships to freelance projects, here's my journey in building innovative solutions and creating value through technology.
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="space-y-12">
          {experiences.map((exp, index) => {
            const IconComponent = exp.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Line */}
                {index < experiences.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-full bg-gradient-to-b from-primary to-primary/20 dark:from-primary/60 dark:to-primary/20" />
                )}

                <div className="flex items-start space-x-6">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                    {IconComponent && <IconComponent className="w-8 h-8 text-white" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {exp.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">{exp.company}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{exp.period}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeConfig[exp.type].color}`}>
                          {typeConfig[exp.type].label}
                        </span>
                        {exp.salePrice && (
                          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold">{exp.salePrice}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-primary" />
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start space-x-3 text-gray-700 dark:text-gray-300">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="leading-relaxed">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Code className="w-5 h-5 mr-2 text-primary" />
                        Technologies Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.tech.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Project Link */}
                    {exp.projectLink && (
                      <div className="flex justify-end">
                        <a
                          href={exp.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>View Project</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}