"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, Code, User, ChevronRight, Sparkles } from "lucide-react"
import { useVisitorProfile } from "@/components/personalization/visitor-profile-provider"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"

export function PersonaOnboarding() {
  const [open, setOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { profile, updateProfile } = useVisitorProfile()

  useEffect(() => {
    setIsClient(true)
    // Check if the user has already selected a persona or visited before
    const hasVisited = localStorage.getItem("hasVisitedBefore")
    const hasPersona = localStorage.getItem("userPersona")
    
    if (!hasVisited && !hasPersona) {
      // Small delay for dramatic effect on first load
      const timer = setTimeout(() => setOpen(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSelectPersona = (type: "recruiter" | "client" | "developer" | "general") => {
    localStorage.setItem("userPersona", type)
    localStorage.setItem("hasVisitedBefore", "true")
    
    // Update the visitor profile context
    updateProfile({ role: type })
    
    setOpen(false)

    // Route based on persona for a tailored experience
    switch (type) {
      case "recruiter":
        router.push("/resume")
        break
      case "client":
        router.push("/services")
        break
      case "developer":
        router.push("/code")
        break
      default:
        // Stay on home for general
        break
    }
  }

  if (!isClient) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="p-8 md:p-10 space-y-8">
          <div className="space-y-3 text-center">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            <DialogTitle className="text-3xl font-bold tracking-tight">Welcome.</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              To provide you with the most relevant experience, how would you describe your visit today?
            </DialogDescription>
          </div>

          <div className="grid gap-4">
            <PersonaCard 
              icon={Briefcase} 
              title="I'm a Recruiter / Hiring Manager" 
              description="Looking for my resume, experience, and candidate summary."
              onClick={() => handleSelectPersona("recruiter")}
              delay={0.1}
            />
            <PersonaCard 
              icon={User} 
              title="I'm a Potential Client / Founder" 
              description="Looking to hire a freelancer or view SaaS services and pricing."
              onClick={() => handleSelectPersona("client")}
              delay={0.2}
            />
            <PersonaCard 
              icon={Code} 
              title="I'm a Fellow Developer" 
              description="Looking to explore the architecture, code playgrounds, and tech stack."
              onClick={() => handleSelectPersona("developer")}
              delay={0.3}
            />
          </div>
          
          <div className="text-center pt-2">
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground text-sm"
              onClick={() => handleSelectPersona("general")}
            >
              Just browsing generally
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PersonaCard({ icon: Icon, title, description, onClick, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card 
        className="p-5 flex items-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all group relative overflow-hidden"
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-12 h-12 rounded-full bg-background border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-snug">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </Card>
    </motion.div>
  )
}
