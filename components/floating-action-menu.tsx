'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Music, MessageCircle, X, Plus } from 'lucide-react'
import VoiceCommands from './voice-commands'
import MusicPlayerContent from './music-player-content'
import { AIChatbotContent } from './chatbot/chatbot-wrappers'

export default function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState<'voice' | 'music' | 'chat' | null>(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    if (isOpen) {
      setActiveFeature(null)
    }
  }

  const handleFeatureClick = (feature: 'voice' | 'music' | 'chat') => {
    setActiveFeature(feature)
    setIsOpen(false)
  }

  const closeFeature = () => {
    setActiveFeature(null)
  }

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      {/* Floating Action Button - Different position for mobile vs desktop */}
      <div className={`fixed ${isMobile ? 'bottom-20 right-4' : 'bottom-6 right-6'} z-50 ${isMobile ? 'lg:hidden' : 'hidden lg:block'}`}>
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Voice Commands Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: isMobile ? -60 : -80 }}
                exit={{ opacity: 0, scale: 0, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => handleFeatureClick('voice')}
                className="absolute bottom-16 right-0 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                aria-label="Voice Commands"
              >
                <Mic size={24} />
              </motion.button>

              {/* Music Player Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: isMobile ? -120 : -160 }}
                exit={{ opacity: 0, scale: 0, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => handleFeatureClick('music')}
                className="absolute bottom-16 right-0 w-14 h-14 rounded-full bg-purple-500 text-white shadow-lg flex items-center justify-center hover:bg-purple-600 transition-colors"
                aria-label="Music Player"
              >
                <Music size={24} />
              </motion.button>

              {/* Chatbot Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: isMobile ? -180 : -240 }}
                exit={{ opacity: 0, scale: 0, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => handleFeatureClick('chat')}
                className="absolute bottom-16 right-0 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="AI Chatbot"
              >
                <MessageCircle size={24} />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <motion.button
          onClick={toggleMenu}
          className={`${isMobile ? 'w-14 h-14' : 'w-16 h-16'} rounded-full shadow-2xl flex items-center justify-center transition-all ${
            isOpen
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={isMobile ? 24 : 28} /> : <Plus size={isMobile ? 24 : 28} />}
        </motion.button>
      </div>

      {/* Feature Modals */}
      <AnimatePresence>
        {activeFeature === 'voice' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeFeature}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Mic className="text-primary" size={24} />
                  Voice Commands
                </h2>
                <button
                  onClick={closeFeature}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              <VoiceCommands />
            </motion.div>
          </motion.div>
        )}

        {activeFeature === 'music' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
              // Don't stop music when closing menu - just close the modal
              closeFeature()
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Music className="text-purple-500" size={24} />
                  Music Player
                </h2>
                <button
                  onClick={closeFeature}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close (music will continue playing)"
                >
                  <X size={20} />
                </button>
              </div>
              <MusicPlayerContent />
            </motion.div>
          </motion.div>
        )}

        {activeFeature === 'chat' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-20 right-6 z-40 sm:top-24 md:top-28"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 w-[90vw] max-w-md max-h-[70vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageCircle className="text-blue-500" size={24} />
                  AI Chatbot
                </h2>
                <button
                  onClick={() => {
                    // Don't clear chat when closing - just close the modal
                    closeFeature()
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close (chat history will be saved)"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <AIChatbotContent />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

