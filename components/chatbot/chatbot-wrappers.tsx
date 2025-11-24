/**
 * Wrapper components for backward compatibility
 * These use the unified chatbot with specific configurations
 */

import UnifiedChatbot, { UnifiedChatbotProps } from './unified-chatbot'
import { DollarSign, Sparkles, Clock } from 'lucide-react'

// Default voice options (from ai-chatbot-voice.tsx)
const defaultVoiceOptions = [
  { name: 'Kore', description: 'Firm' },
  { name: 'Zephyr', description: 'Bright' },
  { name: 'Puck', description: 'Upbeat' },
  { name: 'Charon', description: 'Informative' },
  { name: 'Fenrir', description: 'Excitable' },
  { name: 'Leda', description: 'Youthful' },
  { name: 'Orus', description: 'Firm' },
  { name: 'Aoede', description: 'Breezy' },
  { name: 'Callirrhoe', description: 'Easy-going' },
  { name: 'Autonoe', description: 'Bright' },
  { name: 'Enceladus', description: 'Breathy' },
  { name: 'Iapetus', description: 'Clear' },
  { name: 'Umbriel', description: 'Easy-going' },
  { name: 'Algieba', description: 'Smooth' },
  { name: 'Despina', description: 'Smooth' },
  { name: 'Erinome', description: 'Clear' },
  { name: 'Algenib', description: 'Gravelly' },
  { name: 'Rasalgethi', description: 'Informative' },
  { name: 'Laomedeia', description: 'Upbeat' },
  { name: 'Achernar', description: 'Soft' },
  { name: 'Alnilam', description: 'Firm' },
  { name: 'Schedar', description: 'Even' },
  { name: 'Gacrux', description: 'Mature' },
  { name: 'Pulcherrima', description: 'Forward' },
  { name: 'Achird', description: 'Friendly' },
  { name: 'Zubenelgenubi', description: 'Casual' },
  { name: 'Vindemiatrix', description: 'Gentle' },
  { name: 'Sadachbia', description: 'Lively' },
  { name: 'Sadaltager', description: 'Knowledgeable' },
  { name: 'Sulafat', description: 'Warm' },
]

/**
 * AIChatbot - Original chatbot with AI SDK and model selection
 */
export function AIChatbot() {
  return (
    <UnifiedChatbot
      variant="floating"
      useAISDK={true}
      apiEndpoint="/api/chat"
      enableModelSelection={true}
      enableSettings={true}
      enableMarkdown={true}
      title="AI Assistant"
      models={[
        { id: 'gemini', name: 'Gemini (Multi-Fallback)', color: 'text-blue-400' },
        { id: 'groq-llama', name: 'Groq Models', color: 'text-green-400' },
        { id: 'groq-mixtral', name: 'Groq Fallback', color: 'text-purple-400' },
        { id: 'groq-gemma', name: 'Groq Backup', color: 'text-yellow-400' },
      ]}
    />
  )
}

/**
 * AIChatbotSimple - Simple chatbot with typing animation
 */
export function AIChatbotSimple() {
  return (
    <UnifiedChatbot
      variant="floating"
      apiEndpoint="/api/simple-chat"
      enableModelSelection={true}
      enableSettings={true}
      enableTypingAnimation={true}
      enableMarkdown={false}
      title="AI Assistant"
      models={[
        { id: 'gemini', name: 'Gemini Direct', color: 'text-blue-400' },
        { id: 'groq', name: 'Groq Direct', color: 'text-green-400' },
      ]}
    />
  )
}

/**
 * AIChatbotEnhanced - Enhanced chatbot with quick actions and markdown
 */
export function AIChatbotEnhanced() {
  return (
    <UnifiedChatbot
      variant="floating"
      apiEndpoint="/api/chat-enhanced"
      enableMarkdown={true}
      enableQuickActions={true}
      enableAchievementTracking={true}
      title="AI Assistant"
      quickActions={[
        {
          label: 'Services & Pricing',
          icon: DollarSign,
          action: () => {
            const servicesSection = document.getElementById('services')
            if (servicesSection) {
              servicesSection.scrollIntoView({ behavior: 'smooth' })
            }
          },
        },
        {
          label: 'Request a Quote',
          icon: Sparkles,
          action: () => {
            const contactSection = document.getElementById('contact')
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' })
            }
          },
        },
        {
          label: 'View Projects',
          icon: Clock,
          action: () => {
            window.location.href = '/projects'
          },
        },
      ]}
    />
  )
}

/**
 * AIChatbotContent - Inline chatbot for content pages
 */
export function AIChatbotContent() {
  return (
    <UnifiedChatbot
      variant="inline"
      apiEndpoint="/api/chat-enhanced"
      enableMarkdown={true}
      height="500px"
      title="Ask me anything"
    />
  )
}

/**
 * AIChatbotVoice - Voice-enabled chatbot
 */
export function AIChatbotVoice() {
  return (
    <UnifiedChatbot
      variant="floating"
      apiEndpoint="/api/chat-enhanced"
      enableVoiceInput={true}
      enableVoiceOutput={true}
      enableMarkdown={true}
      enableAchievementTracking={true}
      title="AI Assistant (Voice)"
      voiceOptions={defaultVoiceOptions}
      defaultVoice="Kore"
    />
  )
}

// Export default for backward compatibility
export default AIChatbot

