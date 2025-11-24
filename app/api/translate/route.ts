import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
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

    // In a real implementation, use Gemini AI for translation
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const localeNames: Record<Locale, string> = {
      en: 'English',
      fr: 'French',
    }

    const prompt = `Translate the following text to ${localeNames[targetLocale as Locale] || targetLocale}. 
    Preserve the meaning, tone, and formatting. Only return the translated text, nothing else.

    Text to translate:
    ${text}`

    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const translatedText = response.text()

      return NextResponse.json({
        translatedText,
        sourceLocale: 'en',
        targetLocale,
      })
    } catch (error) {
      // Fallback: return placeholder if API fails
      return NextResponse.json({
        translatedText: `[Translation to ${localeNames[targetLocale as Locale] || targetLocale} would appear here]`,
        sourceLocale: 'en',
        targetLocale,
        note: 'Translation API not fully configured',
      })
    }
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Failed to translate text' },
      { status: 500 }
    )
  }
}

