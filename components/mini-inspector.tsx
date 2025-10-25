"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Lightbulb, Code, Palette, MessageCircle, Send, Bot, User } from "lucide-react"
import { useInspectMode } from "./inspect-mode-context"
import TypingAnimation from "./typing-animation"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function MiniInspector() {
  const { selectedElement, setSelectedElement, elementInfo } = useInspectMode()
  const [showChat, setShowChat] = useState(false)
  const [selectedModel, setSelectedModel] = useState("gemini")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!selectedElement || !elementInfo[selectedElement]) return null

  const info = elementInfo[selectedElement]

  const models = [
    { id: "gemini", name: "Gemini 2.0 Flash", color: "text-blue-400" },
    { id: "groq-llama", name: "Llama 3.1 70B", color: "text-green-400" },
    { id: "groq-mixtral", name: "Mixtral 8x7B", color: "text-purple-400" },
    { id: "groq-gemma", name: "Gemma 2 9B", color: "text-yellow-400" },
  ]

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return

    console.log("🔍 Inspector: Sending message:", userMessage)
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

    try {
      console.log("📡 Inspector: Making fetch request to /api/simple-inspector-chat")

      const response = await fetch("/api/simple-inspector-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          model: selectedModel,
          elementInfo: info,
          history: messages.slice(-3), // Send last 3 messages for context
        }),
      })

      console.log("📡 Inspector: Response received:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Inspector: Error response:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("✅ Inspector: Response data:", data)

      if (data.error) {
        throw new Error(data.error)
      }

      // Add assistant message
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || data.content || "I received your message but couldn't generate a response.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMsg])
      console.log("✅ Inspector: Message added successfully")
    } catch (err) {
      console.error("❌ Inspector: Error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")

      // Add error message to chat
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${err instanceof Error ? err.message : "Unknown error"}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("📝 Inspector: Form submitted with input:", input)
    sendMessage(input)
  }

  const handleModelChange = (modelId: string) => {
    console.log("🔄 Inspector: Model changed from", selectedModel, "to", modelId)
    setSelectedModel(modelId)
  }

  const handleClearChat = () => {
    console.log("🗑️ Inspector: Clearing chat")
    setMessages([])
    setError(null)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-4 md:right-4 md:left-auto md:top-20 md:bottom-4 md:w-96 bg-black border border-green-400 rounded-lg shadow-2xl z-50 flex flex-col max-h-[80vh]"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-green-400/30 bg-green-400/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="text-green-400" size={20} />
              <h3 className="font-semibold text-green-400">Element Inspector</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-1 rounded transition-colors ${
                  showChat ? "bg-green-400 text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                <MessageCircle size={16} />
              </button>
              <button
                onClick={() => setSelectedElement(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {!showChat ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">{info.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{info.description}</p>
              </div>

              <div className="border border-gray-700 rounded-lg p-3 bg-gray-900/50">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="text-blue-400" size={16} />
                  <span className="text-blue-400 font-medium text-sm">Technical Details</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{info.details}</p>
              </div>

              <div className="border border-gray-700 rounded-lg p-3 bg-gray-900/50">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="text-purple-400" size={16} />
                  <span className="text-purple-400 font-medium text-sm">Design Inspiration</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{info.inspiration}</p>
              </div>

              <div>
                <h5 className="text-green-400 font-medium text-sm mb-2">Technologies Used:</h5>
                <div className="flex flex-wrap gap-2">
                  {info.tech.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs border border-gray-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowChat(true)}
                className="w-full flex items-center justify-center gap-2 p-3 bg-green-400/10 border border-green-400/30 rounded hover:bg-green-400/20 transition-colors text-green-400"
              >
                <MessageCircle size={16} />
                Ask me about this element
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Model Selection */}
              <div className="p-3 border-b border-gray-700 bg-gray-900/30 flex-shrink-0">
                <div className="flex flex-wrap gap-1">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelChange(model.id)}
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
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">Direct chat with Mohamed</span>
                  <button
                    onClick={handleClearChat}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    Clear Chat
                  </button>
                </div>
              </div>

              {/* Chat Messages - Fixed scrolling */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0" style={{ maxHeight: "calc(100% - 120px)" }}>
                {messages.length === 0 && (
                  <div className="text-center text-gray-400 text-sm">
                    <p className="mb-2">👋 Hey! Ask me anything about this element!</p>
                    <p className="text-xs">I can explain the code, design decisions, and implementation details.</p>
                    <p className="text-xs mt-1 text-gray-500">I also have access to Mohamed's complete GitHub data!</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-900/50 border border-red-500 p-2 rounded text-red-200 text-xs">
                    <p className="font-semibold mb-1">Error:</p>
                    <p>{error}</p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot size={10} className="text-black" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] p-2 rounded-lg text-xs leading-relaxed ${
                        message.role === "user"
                          ? "bg-green-400 text-black"
                          : "bg-gray-800 text-white border border-gray-700"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <TypingAnimation text={message.content} speed={15} />
                      ) : (
                        message.content
                      )}
                    </div>

                    {message.role === "user" && (
                      <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User size={10} className="text-black" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={10} className="text-black" />
                    </div>
                    <div className="bg-gray-800 text-white border border-gray-700 p-2 rounded-lg text-xs">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700 flex-shrink-0">
                <div className="flex gap-2">
                  <input
                    value={input || ""}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about implementation details..."
                    className="flex-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:border-green-400 focus:outline-none"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input?.trim()}
                    className="px-2 py-1 bg-green-400 text-black rounded hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-gray-700 bg-gray-900/30 flex-shrink-0">
          <p className="text-xs text-gray-500 text-center">
            💡 This inspector showcases my attention to detail and technical depth
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
