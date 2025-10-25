"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User, Settings, RefreshCw } from "lucide-react"
import { useChat } from "@ai-sdk/react"

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedModel, setSelectedModel] = useState("gemini")
  const [useDirectAPI, setUseDirectAPI] = useState(false)
  const [input, setInput] = useState("")

  console.log("🤖 Chatbot: Component rendered with model:", selectedModel, "Direct API:", useDirectAPI)

  const { messages, sendMessage, isLoading, error, reload, setMessages } = useChat({
    api: useDirectAPI ? "/api/chat-direct" : "/api/chat",
    body: {
      model: selectedModel,
    },
    headers: {
      "Content-Type": "application/json",
    },
    onResponse: async (response) => {
      console.log("📡 Chatbot: Received response:", response.status, response.statusText)
      console.log("📡 Chatbot: Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        console.error("❌ Chatbot: Response not OK:", response.status, response.statusText)
        try {
          const errorText = await response.text()
          console.error("❌ Chatbot: Error response body:", errorText)
        } catch (e) {
          console.error("❌ Chatbot: Could not read error response")
        }
      } else {
        console.log("✅ Chatbot: Response OK, processing stream...")
      }
    },
    onFinish: (message) => {
      console.log("✅ Chatbot: Message finished:", message.content.substring(0, 100) + "...")
      console.log("✅ Chatbot: Full message:", message)
    },
    onError: (error) => {
      console.error("❌ Chatbot: Error occurred:", error)
      console.error("❌ Chatbot: Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    },
  })

  // Log messages changes
  useEffect(() => {
    console.log("💬 Chatbot: Messages updated, count:", messages.length)
    if (messages.length > 0) {
      console.log("💬 Chatbot: Latest message:", messages[messages.length - 1])
    }
  }, [messages])

  const models = [
    { id: "gemini", name: "Gemini (Multi-Fallback)", color: "text-blue-400" },
    { id: "groq-llama", name: "Groq Models", color: "text-green-400" },
    { id: "groq-mixtral", name: "Groq Fallback", color: "text-purple-400" },
    { id: "groq-gemma", name: "Groq Backup", color: "text-yellow-400" },
  ]

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("📝 Chatbot: Form submitted with input:", input)
    console.log("🤖 Chatbot: Using model:", selectedModel, "Direct API:", useDirectAPI)
    console.log("💬 Chatbot: Current messages count:", messages.length)
    console.log("🔄 Chatbot: Is loading:", isLoading)

    if (!input.trim()) {
      console.log("⚠️ Chatbot: Empty input, not submitting")
      return
    }

    console.log("🚀 Chatbot: Calling sendMessage...")
    sendMessage({ role: "user", content: input })
    setInput("") // Clear input after submission
  }

  const handleModelChange = (modelId: string) => {
    console.log("🔄 Chatbot: Model changed from", selectedModel, "to", modelId)
    setSelectedModel(modelId)
  }

  const handleRetry = () => {
    console.log("🔄 Chatbot: Retrying last message")
    reload()
  }

  const handleClearChat = () => {
    console.log("🗑️ Chatbot: Clearing chat history")
    setMessages([])
  }

  const toggleDirectAPI = () => {
    console.log("🔄 Chatbot: Toggling Direct API from", useDirectAPI, "to", !useDirectAPI)
    setUseDirectAPI(!useDirectAPI)
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        data-chatbot-toggle
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-400 text-black rounded-full flex items-center justify-center shadow-lg hover:bg-green-300 transition-colors z-50"
        onClick={() => {
          console.log("🎯 Chatbot: Toggle clicked, isOpen:", !isOpen)
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
                    <h3 className="font-semibold text-white">Ask Mo Anything</h3>
                    <p className="text-xs text-gray-400">AI assistant trained on Mohamed's profile</p>
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

                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleDirectAPI}
                        className={`px-2 py-1 rounded text-xs transition-colors ${
                          useDirectAPI ? "bg-blue-400 text-black" : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                      >
                        {useDirectAPI ? "Direct API ON" : "Direct API OFF"}
                      </button>
                      <span className="text-xs text-gray-500">
                        {useDirectAPI ? "Using Google GenAI directly" : "Using AI SDK streaming"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 text-sm">
                  <p className="mb-2">👋 Hi! I'm Mohamed's AI assistant.</p>
                  <p>Ask me anything about his experience, projects, or skills!</p>
                  <p className="text-xs mt-2 text-gray-500">
                    Model: {selectedModel} | API: {useDirectAPI ? "Direct" : "Streaming"}
                  </p>
                  <p className="text-xs text-gray-600">Try asking: "Tell me about Mohamed's projects"</p>
                </div>
              )}

              {error && (
                <div className="bg-red-900/50 border border-red-500 p-3 rounded text-red-200 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">Error occurred:</p>
                    <div className="flex gap-2">
                      <button
                        onClick={toggleDirectAPI}
                        className="text-blue-300 hover:text-blue-100 transition-colors text-xs"
                        title="Try Different API"
                      >
                        Switch API
                      </button>
                      <button
                        onClick={handleRetry}
                        className="text-red-300 hover:text-red-100 transition-colors"
                        title="Retry"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </div>
                  <p>{error.message}</p>
                  <p className="text-xs mt-1 text-red-300">
                    Model: {selectedModel} | API: {useDirectAPI ? "Direct" : "Streaming"}
                  </p>
                  <p className="text-xs mt-1 text-red-400">Debug: Check console for detailed error logs</p>
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
                    {message.content}
                  </div>

                  {message.role === "user" && (
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User size={12} className="text-black" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={12} className="text-black" />
                  </div>
                  <div className="bg-gray-800 text-white border border-gray-700 p-3 rounded-lg text-sm">
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
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleFormSubmit} className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Mohamed's experience..."
                  className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:border-green-400 focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
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
