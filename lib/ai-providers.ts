/**
 * AI Provider Utility
 * Tries providers in order: Groq -> HuggingFace -> Gemini
 */

interface AIRequest {
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  maxTokens?: number
  temperature?: number
}

interface AIResponse {
  content: string
  provider: 'groq' | 'huggingface' | 'gemini'
  model: string
}

const GROQ_MODELS = [
  'llama-3.1-70b-versatile', // Primary - best quality
  'llama-3.1-8b-instant', // Fast fallback
  'mixtral-8x7b-32768', // Alternative
]

const HUGGINGFACE_MODELS = [
  'meta-llama/Meta-Llama-3.1-8B-Instruct',
  'mistralai/Mistral-7B-Instruct-v0.2',
  'google/gemma-7b-it',
]

const GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
]

/**
 * Try Groq API (Primary)
 */
async function tryGroq(request: AIRequest): Promise<AIResponse | null> {
  const groqApiKey = process.env.GROQ_API_KEY
  if (!groqApiKey) {
    return null
  }

  for (const modelName of GROQ_MODELS) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          messages: request.messages,
          max_tokens: request.maxTokens || 2000,
          temperature: request.temperature || 0.7,
        }),
      })

      if (!response.ok) {
        continue
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content

      if (content) {
        return {
          content: content.trim(),
          provider: 'groq',
          model: modelName,
        }
      }
    } catch (error) {
      console.error(`Groq ${modelName} failed:`, error)
      continue
    }
  }

  return null
}

/**
 * Try HuggingFace API (Secondary)
 */
async function tryHuggingFace(request: AIRequest): Promise<AIResponse | null> {
  const hfApiKey = process.env.HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_TOKEN
  if (!hfApiKey) {
    return null
  }

  for (const modelName of HUGGINGFACE_MODELS) {
    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${modelName}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${hfApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: request.messages.map(m => m.content).join('\n\n'),
            parameters: {
              max_new_tokens: request.maxTokens || 2000,
              temperature: request.temperature || 0.7,
              return_full_text: false,
            },
          }),
        }
      )

      if (!response.ok) {
        continue
      }

      const data = await response.json()
      let content = ''

      if (Array.isArray(data) && data[0]?.generated_text) {
        content = data[0].generated_text
      } else if (typeof data === 'string') {
        content = data
      } else if (data?.generated_text) {
        content = data.generated_text
      }

      if (content) {
        return {
          content: content.trim(),
          provider: 'huggingface',
          model: modelName,
        }
      }
    } catch (error) {
      console.error(`HuggingFace ${modelName} failed:`, error)
      continue
    }
  }

  return null
}

/**
 * Try Gemini API (Fallback)
 */
async function tryGemini(request: AIRequest): Promise<AIResponse | null> {
  const geminiApiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY

  if (!geminiApiKey) {
    return null
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(geminiApiKey)

    for (const modelName of GEMINI_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })

        // Convert messages to Gemini format
        const systemMessage = request.messages.find(m => m.role === 'system')
        const userMessages = request.messages.filter(m => m.role !== 'system')

        let prompt = ''
        if (systemMessage) {
          prompt = `${systemMessage.content}\n\n`
        }
        prompt += userMessages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n')

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: request.maxTokens || 2000,
            temperature: request.temperature || 0.7,
          },
        })

        const response = await result.response
        const content = response.text()

        if (content) {
          return {
            content: content.trim(),
            provider: 'gemini',
            model: modelName,
          }
        }
      } catch (error) {
        console.error(`Gemini ${modelName} failed:`, error)
        continue
      }
    }
  } catch (error) {
    console.error('Gemini import failed:', error)
    return null
  }

  return null
}

/**
 * Main function to call AI providers in order: Groq -> HuggingFace -> Gemini
 */
export async function callAI(request: AIRequest): Promise<AIResponse> {
  // Try Groq first (Primary)
  const groqResult = await tryGroq(request)
  if (groqResult) {
    console.log(`✅ Using Groq (${groqResult.model})`)
    return groqResult
  }

  // Try HuggingFace second (Secondary)
  const hfResult = await tryHuggingFace(request)
  if (hfResult) {
    console.log(`✅ Using HuggingFace (${hfResult.model})`)
    return hfResult
  }

  // Try Gemini last (Fallback)
  const geminiResult = await tryGemini(request)
  if (geminiResult) {
    console.log(`✅ Using Gemini (${geminiResult.model})`)
    return geminiResult
  }

  throw new Error('All AI providers failed. Please check your API keys.')
}

