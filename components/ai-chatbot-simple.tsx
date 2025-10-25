"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User, Settings, RefreshCw } from "lucide-react"
import TypingAnimation from "./typing-animation"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

export default function AIChatbotSimple() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedModel, setSelectedModel] = useState("gemini")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  console.log("🤖 Simple Chatbot: Component rendered")

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const models = [
    { id: "gemini", name: "Gemini Direct", color: "text-blue-400" },
    { id: "groq", name: "Groq Direct", color: "text-green-400" },
  ]

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return

    console.log("🚀 Simple Chatbot: Sending message:", userMessage)
    setIsLoading(true)
    setError(null)

    // Add user message immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")

    // Add typing indicator
    const typingMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isTyping: true,
    }

    setMessages((prev) => [...prev, typingMsg])

    try {
      console.log("📡 Simple Chatbot: Making fetch request to /api/simple-chat")

      const response = await fetch("/api/simple-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          model: selectedModel,
          history: messages.slice(-5), // Send last 5 messages for context
        }),
      })

      console.log("📡 Simple Chatbot: Response received:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Simple Chatbot: Error response:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("✅ Simple Chatbot: Response data:", data)

      if (data.error) {
        throw new Error(data.error)
      }

      // Remove typing indicator and add real response with typing animation
      setMessages((prev) => {
        const withoutTyping = prev.filter((msg) => !msg.isTyping)
        const assistantMsg: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: data.response || data.content || "I received your message but couldn't generate a response.",
          timestamp: new Date(),
        }
        return [...withoutTyping, assistantMsg]
      })

      console.log("✅ Simple Chatbot: Message added successfully")
    } catch (err) {
      console.error("❌ Simple Chatbot: Error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")

      // Remove typing indicator and add error message
      setMessages((prev) => {
        const withoutTyping = prev.filter((msg) => !msg.isTyping)
        const errorMsg: Message = {
          id: (Date.now() + 3).toString(),
          role: "assistant",
          content: `Sorry, I encountered an error: ${err instanceof Error ? err.message : "Unknown error"}`,
          timestamp: new Date(),
        }
        return [...withoutTyping, errorMsg]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("📝 Simple Chatbot: Form submitted with input:", input)
    sendMessage(input)
  }

  const handleClearChat = () => {
    console.log("🗑️ Simple Chatbot: Clearing chat")
    setMessages([])
    setError(null)
  }

  const handleRetry = () => {
    console.log("🔄 Simple Chatbot: Retrying last message")
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()
    if (lastUserMessage) {
      // Remove last assistant message if it was an error
      setMessages((prev) => prev.filter((m) => m.role === "user" || !m.content.includes("error")))
      sendMessage(lastUserMessage.content)
    }
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        data-chatbot-toggle
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-400 text-black rounded-full flex items-center justify-center shadow-lg hover:bg-green-300 transition-colors z-50"
        onClick={() => {
          console.log("🎯 Simple Chatbot: Toggle clicked, isOpen:", !isOpen)
          setIsOpen(!isOpen)
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-2 left-2 md:bottom-24 md:right-6 md:left-auto md:w-96 h-[70vh] md:h-[500px] bg-black border border-gray-700 rounded-lg shadow-2xl z-40 flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-900 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <Bot size={16} className="text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Chat with Mohamed</h3>
                    <p className="text-xs text-gray-400">Ask me about any of my GitHub repositories</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearChat}
                    className="text-gray-400 hover:text-white transition-colors text-xs"
                    title="Clear Chat"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Settings size={16} />
                  </button>
                </div>
              </div>

              {/* Model Selection */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    className="mt-3 pt-3 border-t border-gray-700 space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex flex-wrap gap-1">
                      {models.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            console.log("🔄 Simple Chatbot: Model changed to", model.id)
                            setSelectedModel(model.id)
                          }}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            selectedModel === model.id
                              ? "bg-green-400 text-black"
                              : "bg-gray-800 text-gray-400 hover:text-white"
                          }`}
                        >
                          {model.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 text-sm">
                  <p className="mb-2">👋 Hey! I'm Mohamed.</p>
                  <p className="mb-2">Ask me about ANY of my GitHub repositories!</p>
                  <p className="text-xs mt-2 text-gray-500">Model: {selectedModel}</p>
                  <div className="text-xs text-gray-600 mt-2 space-y-1">
                    <p>Try asking:</p>
                    <p>"Tell me about your EduSphere AI project"</p>
                    <p>"What's your most starred repository?"</p>
                    <p>"Show me your recent projects"</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-900/50 border border-red-500 p-3 rounded text-red-200 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">Error occurred:</p>
                    <button
                      onClick={handleRetry}
                      className="text-red-300 hover:text-red-100 transition-colors"
                      title="Retry"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                  <p>{error}</p>
                  <p className="text-xs mt-1 text-red-300">Model: {selectedModel}</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={12} className="text-black" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.role === "user"
                        ? "bg-green-400 text-black"
                        : "bg-gray-800 text-white border border-gray-700"
                    }`}
                  >
                    {message.isTyping ? (
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    ) : message.role === "assistant" ? (
                      <TypingAnimation text={message.content} speed={20} />
                    ) : (
                      message.content
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User size={12} className="text-black" />
                    </div>
                  )}
                </div>
              ))}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  value={input || ""}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about any repository..."
                  className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:border-green-400 focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input?.trim()}
                  className="px-3 py-2 bg-green-400 text-black rounded hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
