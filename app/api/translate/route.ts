import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/ai-providers'
import type { Locale } from '@/lib/i18n/config'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLocale } = await request.json()

    if (!text || !targetLocale) {
      return NextResponse.json(
        { error: 'Text and target locale are required' },
        { status: 400 }
      )
    }

    const localeNames: Record<Locale, string> = {
      en: 'English',
      fr: 'French',
    }

    const prompt = `Translate the following text to ${localeNames[targetLocale as Locale] || targetLocale}. 
    Preserve the meaning, tone, and formatting. Only return the translated text, nothing else.

    Text to translate:
    ${text}`

    try {
      const aiResponse = await callAI({
        messages: [{ role: 'user', content: prompt }],
        maxTokens: 1000,
      })

      return NextResponse.json({
        translatedText: aiResponse.content.trim(),
        sourceLocale: 'en',
        targetLocale,
      })
    } catch (error) {
      console.error('Translation error:', error)
      return NextResponse.json(
        { 
          error: 'Failed to translate text',
          translatedText: text, // Return original text as fallback
          sourceLocale: 'en',
          targetLocale,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Failed to translate text' },
      { status: 500 }
    )
  }
}

