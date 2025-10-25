"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github, DollarSign, CheckCircle } from "lucide-react"

const projects = [
  {
    name: "InterviewPrep AI",
    description: "Mock interview platform with AI voice feedback and resume analysis",
    tech: ["Next.js", "Gemini AI", "Firebase", "PayPal"],
    status: "sold",
    saleInfo: {
      price: 500,
      buyer: "Private Client",
      notes: "Ongoing maintenance & feature updates contracted",
    },
    github: "https://github.com/MeeksonJr/interviewprep-ai",
    live: "https://interviewprep-ai.vercel.app",
  },
  {
    name: "EduSphere AI",
    description: "AI-powered student productivity suite with assignment assistant and blog generator",
    tech: ["Next.js", "Supabase", "Gemini", "TailwindCSS"],
    status: "live",
    github: "https://github.com/MeeksonJr/edusphere-ai",
    live: "https://edusphere-ai.vercel.app",
  },
  {
    name: "AI Content Generator",
    description: "Full SaaS platform for blog, email, and social content with analytics dashboard",
    tech: ["Next.js", "Supabase", "Gemini", "Hugging Face", "Recharts"],
    status: "live",
    github: "https://github.com/MeeksonJr/ai-content-generator",
    live: "https://ai-content-gen.vercel.app",
  },
  {
    name: "SnapFind",
    description: "Advanced image analysis tool using Gemini Vision and Hugging Face APIs",
    tech: ["Next.js", "Gemini Vision", "Hugging Face"],
    status: "beta",
    github: "https://github.com/MeeksonJr/snapfind",
  },
]

export default function ProjectsLight() {
  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Work</h2>
            <p className="text-muted-foreground text-lg">Live projects, sold products, and ongoing development</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 auto-rows-fr">
            {projects.map((project, idx) => (
              <motion.div
                key={project.name}
                className="glass rounded-2xl p-6 shadow-lg flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {/* Header - Fixed height */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold">{project.name}</h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                      project.status === "sold"
                        ? "bg-green-100 text-green-700"
                        : project.status === "live"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {project.status === "sold" ? "Sold ✓" : project.status === "live" ? "Live" : "Beta"}
                  </span>
                </div>

                {/* Description - Fixed height */}
                <p className="text-foreground/70 mb-4 text-sm min-h-[40px]">{project.description}</p>

                {/* Sold Info Box - Fixed height area */}
                <div className="mb-4 min-h-[80px]">
                  {project.status === "sold" && project.saleInfo && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="text-green-600" size={16} />
                        <span className="font-bold text-green-700">Sold for ${project.saleInfo.price}</span>
                      </div>
                      <p className="text-xs text-green-700">
                        <CheckCircle className="inline mr-1" size={12} />
                        {project.saleInfo.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Tech Stack - Flexible */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span key={tech} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links - Push to bottom */}
                <div className="flex gap-3 pt-4 mt-auto border-t border-border">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-foreground/70 hover:text-primary transition-colors"
                    >
                      <Github size={16} />
                      Code
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-foreground/70 hover:text-primary transition-colors"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
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
