import { createAdminClient } from '@/lib/supabase/server'

export interface AIGenerationLog {
  type: 'content' | 'image' | 'enhancement' | 'other'
  model: string
  prompt?: string
  result?: string
  metadata?: Record<string, any>
  tokens_used?: number
  cost?: number
  user_id?: string
}

/**
 * Log an AI generation to the database
 * Truncates long prompts and results to prevent database issues
 */
export async function logAIGeneration(data: AIGenerationLog): Promise<void> {
  try {
    const adminClient = createAdminClient()

    // Truncate prompt and result to prevent database issues
    // PostgreSQL TEXT can handle large values, but we'll limit to reasonable sizes
    const MAX_PROMPT_LENGTH = 5000
    const MAX_RESULT_LENGTH = 10000

    const logData = {
      type: data.type,
      model: data.model,
      prompt: data.prompt ? data.prompt.substring(0, MAX_PROMPT_LENGTH) : null,
      result: data.result ? data.result.substring(0, MAX_RESULT_LENGTH) : null,
      metadata: data.metadata || {},
      tokens_used: data.tokens_used || null,
      cost: data.cost || null,
      user_id: data.user_id || null,
    }

    const { error } = await adminClient
      .from('ai_generations')
      .insert(logData)

    if (error) {
      console.error('Failed to log AI generation:', error)
      // Don't throw - logging failures shouldn't break the main flow
    }
  } catch (error) {
    console.error('Error logging AI generation:', error)
    // Don't throw - logging failures shouldn't break the main flow
  }
}

/**
 * Calculate estimated cost for Groq API calls
 * Note: Groq pricing may vary, these are estimates
 */
export function estimateGroqCost(tokensUsed: number, model: string): number {
  // Rough estimates based on typical pricing (adjust as needed)
  const pricing: Record<string, { input: number; output: number }> = {
    'llama-3.3-70b-versatile': { input: 0.00000059, output: 0.00000079 }, // per token
    'llama-3.1-70b-versatile': { input: 0.00000059, output: 0.00000079 },
    'llama-3.1-8b-instant': { input: 0.00000005, output: 0.00000008 },
    'openai/gpt-oss-20b': { input: 0.0000002, output: 0.0000003 },
    'qwen/qwen3-32b': { input: 0.0000003, output: 0.0000004 },
  }

  const modelPricing = pricing[model] || { input: 0.0000001, output: 0.00000015 }
  
  // Rough estimate: 70% input, 30% output
  const inputTokens = Math.floor(tokensUsed * 0.7)
  const outputTokens = Math.floor(tokensUsed * 0.3)
  
  return (inputTokens * modelPricing.input) + (outputTokens * modelPricing.output)
}

/**
 * Calculate estimated cost for Hugging Face API calls
 * Note: Hugging Face pricing varies, this is a rough estimate
 */
export function estimateHuggingFaceCost(): number {
  // Hugging Face Inference API is typically free for public models
  // But if using Inference Endpoints, costs vary
  // For now, return 0 as most users use free tier
  return 0
}

