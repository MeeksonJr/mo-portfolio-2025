'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Settings,
  RefreshCw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  DollarSign,
  Clock,
} from 'lucide-react'
import { useChat } from '@ai-sdk/react'
import ReactMarkdown from 'react-markdown'
import TypingAnimation from '../typing-animation'
import type { Message } from '@/types'

export interface UnifiedChatbotProps {
  // Display mode
  variant?: 'floating' | 'inline' | 'embedded'
  
  // API configuration
  apiEndpoint?: string
  useAISDK?: boolean // Use @ai-sdk/react useChat hook
  
  // Features
  enableVoiceInput?: boolean
  enableVoiceOutput?: boolean
  enableMarkdown?: boolean
  enableTypingAnimation?: boolean
  enableModelSelection?: boolean
  enableSettings?: boolean
  enableQuickActions?: boolean
  enableAchievementTracking?: boolean
  
  // UI customization
  title?: string
  placeholder?: string
  initialMessages?: Message[]
  height?: string
  
  // Voice configuration
  defaultVoice?: string
  voiceOptions?: Array<{ name: string; description: string }>
  
  // Model configuration
  defaultModel?: string
  models?: Array<{ id: string; name: string; color?: string }>
  
  // Quick actions
  quickActions?: Array<{ label: string; icon: React.ComponentType<{ className?: string }>; action: () => void }>
  
  // Callbacks
  onMessageSent?: (message: string) => void
  onMessageReceived?: (message: string) => void
  onError?: (error: Error) => void
}

export default function UnifiedChatbot({
  variant = 'floating',
  apiEndpoint = '/api/simple-chat',
  useAISDK = false,
  enableVoiceInput = false,
  enableVoiceOutput = false,
  enableMarkdown = true,
  enableTypingAnimation = false,
  enableModelSelection = false,
  enableSettings = false,
  enableQuickActions = false,
  enableAchievementTracking = false,
  title = 'AI Assistant',
  placeholder = 'Type your message...',
  initialMessages = [],
  height = '600px',
  defaultVoice = 'Kore',
  voiceOptions = [],
  defaultModel = 'gemini',
  models = [
    { id: 'gemini', name: 'Gemini', color: 'text-blue-400' },
    { id: 'groq', name: 'Groq', color: 'text-green-400' },
  ],
  quickActions = [],
  onMessageSent,
  onMessageReceived,
  onError,
}: UnifiedChatbotProps) {
  const [isOpen, setIsOpen] = useState(variant === 'inline' || variant === 'embedded')
  const [showSettings, setShowSettings] = useState(false)
  const [selectedModel, setSelectedModel] = useState(defaultModel)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState(defaultVoice)
  const [customMessages, setCustomMessages] = useState<Message[]>(initialMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<HTMLAudioElement | SpeechSynthesisUtterance | null>(null)

  // Chat persistence key - unique per API endpoint
  const chatStorageKey = `chatbot_messages_${apiEndpoint}`

  // Load messages from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !useAISDK) {
      try {
        const saved = localStorage.getItem(chatStorageKey)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCustomMessages(parsed)
          }
        }
      } catch (error) {
        console.error('Failed to load chat from localStorage:', error)
      }
    }
  }, [chatStorageKey, useAISDK])

  // Save messages to localStorage whenever they change (only for custom messages)
  useEffect(() => {
    if (typeof window !== 'undefined' && !useAISDK && customMessages.length > 0) {
      try {
        localStorage.setItem(chatStorageKey, JSON.stringify(customMessages))
      } catch (error) {
        console.error('Failed to save chat to localStorage:', error)
      }
    }
  }, [customMessages, chatStorageKey, useAISDK])

  // AI SDK hook (for streaming) - only used when useAISDK is true
  // Using type assertion to handle API property compatibility
  const aiSDKChatConfig = useAISDK
    ? {
        api: apiEndpoint,
        body: {
          model: selectedModel,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        onError: (error: Error) => {
          setError(error.message)
          onError?.(error)
        },
        onFinish: (message: any) => {
          const content = typeof message === 'string' ? message : message?.content || ''
          onMessageReceived?.(content)
        },
      }
    : { api: '/api/placeholder' } // Dummy endpoint when not using AI SDK

  const aiSDKChatResult = useChat(aiSDKChatConfig as any)

  // Use AI SDK messages if enabled, otherwise use custom messages
  const messages = useAISDK
    ? (aiSDKChatResult.messages || []).map((msg: any) => ({
        id: msg.id || Date.now().toString(),
        role: (msg.role || 'assistant') as 'user' | 'assistant' | 'system',
        content: typeof msg === 'string' ? msg : msg.content || '',
        timestamp: new Date(),
      }))
    : customMessages
  const isLoadingState = useAISDK ? (aiSDKChatResult as any).isLoading || false : isLoading

  // Auto-scroll only within the chat container, not the entire page
  useEffect(() => {
    if (messagesEndRef.current) {
      // Find the scrollable container
      const scrollContainer = messagesEndRef.current.closest('[class*="overflow"], [class*="scroll"]') || 
                              messagesEndRef.current.parentElement
      if (scrollContainer) {
        const scrollHeight = scrollContainer.scrollHeight
        const clientHeight = scrollContainer.clientHeight
        // Only scroll if content exceeds container height
        if (scrollHeight > clientHeight) {
          scrollContainer.scrollTo({
            top: scrollHeight - clientHeight,
            behavior: 'smooth'
          })
        }
      }
    }
  }, [messages])

  // Voice input setup
  useEffect(() => {
    if (enableVoiceInput && typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event: any) => {
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
  }, [enableVoiceInput])

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

  const speakText = async (text: string) => {
    if (!enableVoiceOutput) return

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: selectedVoice }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const audioUrl = URL.createObjectURL(blob)
        const audio = new Audio(audioUrl)
        synthesisRef.current = audio

        audio.onplay = () => setIsSpeaking(true)
        audio.onended = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }

        await audio.play()
      }
    } catch (err) {
      console.error('TTS error:', err)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoadingState) return

    // Track achievement
    if (enableAchievementTracking && typeof window !== 'undefined' && (window as any).unlockAchievement) {
      ;(window as any).unlockAchievement('chat-ai')
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    onMessageSent?.(input)

    if (useAISDK) {
      // Use AI SDK
      ;(aiSDKChatResult as any).sendMessage({ role: 'user', content: input })
      setInput('')
      return
    } else {
      // Custom implementation
      setCustomMessages((prev) => [...prev, userMessage])
      setInput('')
      setIsLoading(true)
      setError(null)

      // Add typing indicator if enabled
      if (enableTypingAnimation) {
        const typingMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          isTyping: true,
        }
        setCustomMessages((prev) => [...prev, typingMsg])
      }

      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage.content,
            model: selectedModel,
            history: customMessages.slice(-5),
            messages: [...customMessages, userMessage],
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`)
        }

        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: data.text || data.content || 'Sorry, I could not generate a response.',
        }

        // Remove typing indicator and add response
        setCustomMessages((prev) => {
          const filtered = prev.filter((msg) => !msg.isTyping)
          return [...filtered, assistantMessage]
        })

        onMessageReceived?.(assistantMessage.content)

        // Speak response if voice output enabled
        if (enableVoiceOutput) {
          await speakText(assistantMessage.content)
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to get response')
        setError(error.message)
        onError?.(error)

        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: "Sorry, I'm having trouble right now. Please try again later.",
        }

        setCustomMessages((prev) => {
          const filtered = prev.filter((msg) => !msg.isTyping)
          return [...filtered, errorMessage]
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleRetry = () => {
    if (useAISDK) {
      ;(aiSDKChatResult as any).reload?.()
    } else {
      // Retry last message
      const lastUserMessage = [...customMessages].reverse().find((msg) => msg.role === 'user')
      if (lastUserMessage) {
        setInput(lastUserMessage.content)
        handleFormSubmit(new Event('submit') as any)
      }
    }
  }

  const handleClearChat = () => {
    if (useAISDK) {
      ;(aiSDKChatResult as any).setMessages?.([])
    } else {
      setCustomMessages([])
    }
  }

  const renderMessage = (message: Message) => {
    if (message.isTyping && enableTypingAnimation) {
      return <TypingAnimation text="Thinking..." />
    }

    const content = enableMarkdown ? (
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          code: ({ children }) => (
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded overflow-x-auto mb-2">{children}</pre>
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
    ) : (
      <p className="whitespace-pre-wrap">{message.content}</p>
    )

    return (
      <div
        className={`flex gap-3 ${
          message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            message.role === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {message.role === 'user' ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>
        <div
          className={`flex-1 rounded-lg p-3 ${
            message.role === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
          }`}
        >
          {content}
        </div>
      </div>
    )
  }

  const chatContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {enableSettings && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              aria-label="Toggle settings"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
          {variant === 'floating' && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              aria-label="Close chat"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
          {enableModelSelection && (
            <div>
              <label className="text-sm font-medium mb-2 block">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                aria-label="Select AI model"
                title="AI Model"
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {enableVoiceOutput && voiceOptions.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Voice</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                aria-label="Select voice"
                title="Voice Selection"
              >
                {voiceOptions.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} - {voice.description}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      {enableQuickActions && quickActions.length > 0 && messages.length === 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 gap-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.action}
                className="flex items-center gap-2 p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <action.icon className="w-4 h-4" />
                <span className="text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Start a conversation...</p>
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id}>{renderMessage(message)}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mb-2 p-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleFormSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          {enableVoiceInput && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-2 rounded-lg ${
                isListening
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoadingState}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoadingState}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingState ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        {isLoadingState && !useAISDK && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Thinking...</div>
        )}
      </form>
    </div>
  )

  // Render based on variant
  if (variant === 'inline' || variant === 'embedded') {
    return (
      <div className={variant === 'embedded' ? 'w-full' : ''} style={variant === 'embedded' ? { height } : undefined}>
        {chatContent}
      </div>
    )
  }

  // Floating variant
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] z-50 shadow-2xl rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            {chatContent}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  )
}

