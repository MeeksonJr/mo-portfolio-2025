"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User, Mic, MicOff, Volume2, VolumeX } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function AIChatbotVoice() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hasAudioSupport, setHasAudioSupport] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Check for audio support
  useEffect(() => {
    setHasAudioSupport(
      'speechRecognition' in window || 'webkitSpeechRecognition' in window
    )
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInput(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/chat-enhanced", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to get response")
      }
      
      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text || "Sorry, I couldn't generate a response.",
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble right now. Please try again later.",
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      synthesisRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  // Auto-speak new AI responses
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content) {
      speakText(lastMessage.content)
    }
  }, [messages])

  const quickActions = [
    {
      label: "Tell me about your services",
      icon: MessageCircle,
    },
    {
      label: "What projects have you built?",
      icon: Bot,
    },
    {
      label: "How much do you charge?",
      icon: MessageCircle,
    },
  ]

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full shadow-2xl z-50 flex items-center justify-center hover:scale-105 transition-transform"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-[calc(100vw-2rem)] md:w-[420px] max-h-[calc(100vh-140px)] bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl z-40 flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Mo's AI Assistant</h3>
                    <p className="text-xs text-primary-foreground/90">Voice-enabled chat</p>
                  </div>
                </div>
                {messages.length > 0 && (
                  <button
                    onClick={() => {
                      setMessages([])
                      setInput("")
                      stopSpeaking()
                    }}
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs transition-colors backdrop-blur-sm flex items-center gap-1"
                  >
                    <X size={12} />
                    Reset
                  </button>
                )}
              </div>

              {/* Voice Controls */}
              {hasAudioSupport && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`px-3 py-1.5 rounded-full text-xs transition-colors backdrop-blur-sm flex items-center gap-1 ${
                      isListening 
                        ? 'bg-red-500/80 hover:bg-red-500' 
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    {isListening ? <MicOff size={12} /> : <Mic size={12} />}
                    {isListening ? 'Stop' : 'Voice'}
                  </button>
                  
                  <button
                    onClick={isSpeaking ? stopSpeaking : () => {
                      const lastMessage = messages[messages.length - 1]
                      if (lastMessage && lastMessage.role === 'assistant') {
                        speakText(lastMessage.content)
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs transition-colors backdrop-blur-sm flex items-center gap-1 ${
                      isSpeaking 
                        ? 'bg-blue-500/80 hover:bg-blue-500' 
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
                    {isSpeaking ? 'Stop' : 'Speak'}
                  </button>
                </div>
              )}

              {/* Quick Actions */}
              {messages.length === 0 && (
                <div className="flex gap-2 mt-4">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.label}
                        onClick={() => {
                          setInput(action.label)
                          setTimeout(() => {
                            const event = {
                              preventDefault: () => {},
                            } as any
                            handleFormSubmit(event)
                          }, 100)
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs transition-colors backdrop-blur-sm"
                      >
                        <Icon size={12} />
                        {action.label.split(" ")[0]}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="mx-auto mb-3 text-primary" size={32} />
                  <p className="text-sm mb-2 font-medium">👋 Hi! I'm Mo's AI assistant</p>
                  <p className="text-xs">
                    I can help you with:
                    <br />• Service pricing & quotes
                    <br />• Project details
                    <br />• Technical questions
                    {hasAudioSupport && (
                      <>
                        <br />• Voice conversations
                        <br />• Audio responses
                      </>
                    )}
                  </p>
                </div>
              )}

              {messages.slice(-10).map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <form onSubmit={handleFormSubmit} className="flex gap-2">
                <input
                  value={input || ""}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input?.trim()}
                  className="px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
