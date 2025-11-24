import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'
import { callAI } from '@/lib/ai-providers'

type ImprovementType = 'improve' | 'shorten' | 'lengthen' | 'rewrite' | 'fix-grammar' | 'enhance'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if at least one AI provider is configured
    const hasGroq = !!process.env.GROQ_API_KEY
    const hasHuggingFace = !!(process.env.HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_TOKEN)
    const hasGemini = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY)

    if (!hasGroq && !hasHuggingFace && !hasGemini) {
      return NextResponse.json(
        { error: 'AI service not configured. Please set GROQ_API_KEY, HUGGINGFACE_API_KEY, or GEMINI_API_KEY' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { content, context, type = 'improve', tone, targetLength } = body

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Build prompt based on improvement type
    let systemPrompt = ''
    let userPrompt = ''

    switch (type as ImprovementType) {
      case 'improve':
        systemPrompt = 'You are a professional content editor. Improve the given content while maintaining its original meaning and tone. Make it more engaging, clear, and professional.'
        userPrompt = `Context: ${context || 'General content'}\n\nContent to improve:\n${content}`
        break

      case 'shorten':
        systemPrompt = 'You are a concise content editor. Condense the given content while preserving all key information and maintaining clarity.'
        userPrompt = `Context: ${context || 'General content'}\n\nContent to shorten:\n${content}\n\nTarget length: ${targetLength || '50% of original'}`
        break

      case 'lengthen':
        systemPrompt = 'You are a content expander. Elaborate on the given content with more details, examples, and explanations while maintaining the original message.'
        userPrompt = `Context: ${context || 'General content'}\n\nContent to expand:\n${content}\n\nTarget length: ${targetLength || '150% of original'}`
        break

      case 'rewrite':
        systemPrompt = `You are a professional writer. Rewrite the given content ${tone ? `in a ${tone} tone` : 'with improved clarity and engagement'}.`
        userPrompt = `Context: ${context || 'General content'}\n\nContent to rewrite:\n${content}`
        break

      case 'fix-grammar':
        systemPrompt = 'You are a grammar and style editor. Fix all grammatical errors, improve sentence structure, and ensure proper punctuation while keeping the original meaning intact.'
        userPrompt = `Content to fix:\n${content}`
        break

      case 'enhance':
        systemPrompt = 'You are a content enhancement specialist. Enhance the given content with better vocabulary, more engaging language, and improved flow while maintaining authenticity.'
        userPrompt = `Context: ${context || 'General content'}\n\nContent to enhance:\n${content}`
        break

      default:
        return NextResponse.json({ error: 'Invalid improvement type' }, { status: 400 })
    }

    // Call AI provider (Groq -> HuggingFace -> Gemini)
    try {
      const aiResponse = await callAI({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        maxTokens: 2000,
      })

      return NextResponse.json({
        original: content,
        improved: aiResponse.content,
        type,
        provider: aiResponse.provider,
        model: aiResponse.model,
      })
    } catch (error: any) {
      console.error('AI provider error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to improve content' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error in POST /api/admin/ai/improve-content:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

