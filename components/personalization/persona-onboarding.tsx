"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, Code, User, ChevronRight, Sparkles, Globe, GraduationCap } from "lucide-react"
import { usePersonalization } from "@/components/personalization/visitor-profile-provider"

export function PersonaOnboarding() {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { profile, updateProfile, showPersonaModal, setShowPersonaModal } = usePersonalization()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Prevent scrolling when the fullscreen modal is active
    if (showPersonaModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showPersonaModal])

  const handleSelectPersona = (type: "recruiter" | "client" | "developer" | "student" | "general") => {
    localStorage.setItem("userPersona", type)
    localStorage.setItem("hasVisitedBefore", "true")
    
    // Update the visitor profile context
    updateProfile()
    
    setShowPersonaModal(false)

    // Always route to the homepage so the user sees the dynamically redesigned persona homepage
    if (window.location.pathname !== "/") {
      router.push("/")
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (!isClient) return null

  return (
    <AnimatePresence>
      {showPersonaModal && (
        <motion.div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 text-zinc-50 overflow-y-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle Background Elements that aren't transparent but add texture */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
          </div>

          <div className="relative w-full max-w-5xl p-6 md:p-12 mb-12 mt-12 flex flex-col items-center">
            
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
              className="w-20 h-20 bg-zinc-900 border border-zinc-800 shadow-2xl rounded-3xl flex items-center justify-center mb-8"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-4 max-w-2xl mx-auto mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Tailor Your Experience</h1>
              <p className="text-lg text-zinc-400">
                Before you dive in, let me restructure the site to prioritize exactly what you're looking for.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
              <PersonaCard 
                icon={Briefcase} 
                title="Recruiter / Hiring" 
                description="Immediately highlights my resume, quick stats, and candidate summary."
                onClick={() => handleSelectPersona("recruiter")}
                color="border-blue-500/40 hover:border-blue-500"
                delay={0.3}
              />
              <PersonaCard 
                icon={User} 
                title="Client / Founder" 
                description="Showcases freelancing services, pricing, and case studies."
                onClick={() => handleSelectPersona("client")}
                color="border-purple-500/40 hover:border-purple-500"
                delay={0.4}
              />
              <PersonaCard 
                icon={Code} 
                title="Software Engineer" 
                description="Dives deep into architecture teardowns and technical metrics."
                onClick={() => handleSelectPersona("developer")}
                color="border-green-500/40 hover:border-green-500"
                delay={0.5}
              />
              <PersonaCard 
                icon={GraduationCap} 
                title="Student / Peer" 
                description="Focuses on learning resources, blog posts, and educational journeys."
                onClick={() => handleSelectPersona("student")}
                color="border-amber-500/40 hover:border-amber-500"
                delay={0.6}
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-16 text-center"
            >
              <button 
                onClick={() => handleSelectPersona("general")}
                className="group flex items-center justify-center gap-2 text-zinc-400 hover:text-white transition-colors px-6 py-3 rounded-full hover:bg-zinc-900"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">No thanks, just give me the general vibe.</span>
              </button>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PersonaCard({ icon: Icon, title, description, onClick, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <div 
        className={`h-full p-8 rounded-3xl border bg-zinc-900/80 cursor-pointer transition-all duration-300 group relative overflow-hidden flex flex-row items-center text-left ${color} hover:bg-zinc-800 hover:shadow-2xl hover:-translate-y-1 gap-6`}
        onClick={onClick}
      >
        <div className="w-16 h-16 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm">
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
        </div>
        
        <div className="shrink-0 overflow-hidden rounded-full p-2 bg-black border border-zinc-800 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <ChevronRight className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  )
}
