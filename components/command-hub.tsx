"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, User, MessageCircle, Github, Mail, FileText, Eye, Gamepad2 } from "lucide-react"
import { useInspectMode } from "./inspect-mode-context"

export default function CommandHub() {
  const [isOpen, setIsOpen] = useState(false)
  const { isInspectMode, toggleInspectMode } = useInspectMode()

  const commands = [
    {
      icon: User,
      label: "Bio",
      action: () => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
        setIsOpen(false)
      },
    },
    {
      icon: FileText,
      label: "Resume",
      action: () => {
        const link = document.createElement("a")
        link.href = "/resume-Mohamed-Datt-Full Stack Developer-2025.pdf"
        link.download = "Mohamed-Datt-Resume-2025.pdf"
        link.click()
        setIsOpen(false)
      },
    },
    {
      icon: Eye,
      label: "Inspect",
      action: () => {
        toggleInspectMode()
        setIsOpen(false)
      },
      isActive: isInspectMode,
    },
    {
      icon: MessageCircle,
      label: "Chatbot",
      action: () => {
        const chatbotButton = document.querySelector("[data-chatbot-toggle]") as HTMLButtonElement
        if (chatbotButton) chatbotButton.click()
        setIsOpen(false)
      },
    },
    {
      icon: Github,
      label: "GitHub",
      action: () => {
        window.open("https://github.com/MeeksonJr", "_blank")
        setIsOpen(false)
      },
    },
    {
      icon: Mail,
      label: "Contact",
      action: () => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
        setIsOpen(false)
      },
    },
    {
      icon: Gamepad2,
      label: "Games",
      action: () => {
        window.location.href = "/games"
        setIsOpen(false)
      },
    },
  ]

  return (
    <>
      {/* Backdrop when open - positioned behind command buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Command Buttons - positioned above backdrop */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            {commands.map((command, index) => {
              // Calculate position in a perfect circle
              const angle = (index * 360) / commands.length - 90 // Start from top
              const radius = 100 // Distance from center
              const x = Math.cos((angle * Math.PI) / 180) * radius
              const y = Math.sin((angle * Math.PI) / 180) * radius

              return (
                <motion.div
                  key={command.label}
                  className="absolute"
                  style={{
                    left: x - 20, // Center the button (40px width / 2)
                    top: y - 20, // Center the button (40px height / 2)
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0,
                    x: 0,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                >
                  <motion.button
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg transition-colors relative group ${
                      command.isActive ? "bg-green-400 text-black" : "bg-white text-black hover:bg-gray-200"
                    }`}
                    onClick={command.action}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={command.label}
                    aria-pressed={command.isActive ? 'true' : 'false'}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        command.action()
                      }
                    }}
                  >
                    <command.icon size={16} className="md:hidden" aria-hidden="true" />
                    <command.icon size={18} className="hidden md:block" aria-hidden="true" />

                    {/* Tooltip */}
                    <div 
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-gray-600 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-10"
                      role="tooltip"
                      aria-hidden="true"
                    >
                      {command.label}
                    </div>
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Button - positioned above everything */}
      <motion.button
        className="fixed w-10 h-10 md:w-12 md:h-12 bg-green-400 text-black rounded-full flex items-center justify-center shadow-lg hover:bg-green-300 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors z-50"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          top: isOpen ? "50%" : "1rem",
          right: isOpen ? "50%" : "1rem",
          x: isOpen ? "50%" : "0%",
          y: isOpen ? "-50%" : "0%",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          top: isOpen ? "50%" : "1rem",
          right: isOpen ? "50%" : "1rem",
        }}
        aria-label={isOpen ? "Close command menu" : "Open command menu"}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(!isOpen)
          } else if (e.key === 'Escape' && isOpen) {
            e.preventDefault()
            setIsOpen(false)
          }
        }}
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}>
          <Terminal size={16} className="md:hidden" aria-hidden="true" />
          <Terminal size={20} className="hidden md:block" aria-hidden="true" />
        </motion.div>
      </motion.button>
    </>
  )
}
