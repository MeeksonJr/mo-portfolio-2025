'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Languages, Sparkles, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { locales, localeNames, localeFlags, type Locale } from '@/lib/i18n/config'

export default function AITranslationPanel() {
  const [sourceText, setSourceText] = useState('')
  const [targetLocale, setTargetLocale] = useState<Locale>('fr')
  const [translatedText, setTranslatedText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    setIsTranslating(true)
    try {
      // In a real implementation, this would call an AI translation API
      // For now, we'll simulate it
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          targetLocale,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTranslatedText(data.translatedText || 'Translation would appear here...')
      } else {
        // Fallback: show placeholder
        setTranslatedText('Translation would appear here... (API not configured)')
      }
    } catch (error) {
      setTranslatedText('Translation would appear here... (API not configured)')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-primary" />
          AI Translation Assistant
        </CardTitle>
        <CardDescription>
          Translate content using AI-powered translation. Supports multiple languages.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Source Text</label>
          <Textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            className="min-h-32"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Target Language</label>
          <div className="flex gap-2 flex-wrap">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => setTargetLocale(locale)}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  targetLocale === locale
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <span className="mr-2">{localeFlags[locale]}</span>
                <span className="text-sm">{localeNames[locale]}</span>
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleTranslate} disabled={!sourceText.trim() || isTranslating} className="w-full">
          <Sparkles className="w-4 h-4 mr-2" />
          {isTranslating ? 'Translating...' : 'Translate'}
        </Button>

        {translatedText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Translated Text</label>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-lg border border-border min-h-32">
              <p className="text-sm whitespace-pre-wrap">{translatedText}</p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

