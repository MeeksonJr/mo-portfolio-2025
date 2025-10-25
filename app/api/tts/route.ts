import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    console.log('🎤 TTS API called')
    
    // Parse the request body
    let body
    try {
      body = await request.json()
      console.log('📝 Request body parsed:', body)
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError)
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }
    
    const { text, voice = 'Kore' } = body
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    console.log('🎤 Gemini TTS Request:', { text: text.substring(0, 50) + '...', voice })

    // Check if API key is available
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      console.error('❌ No API key found')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    console.log('✅ API key found, length:', apiKey.length)

    // Initialize Google AI with API key
    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Use the correct Gemini TTS model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-preview-tts"
    })

    console.log('🔄 Calling Gemini TTS API...')

    // Generate content with TTS configuration
    const result = await model.generateContent({
      contents: [{ parts: [{ text: `Say: ${text}` }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voice,
            },
          },
        },
      },
    })
    
    console.log('✅ Gemini TTS API response received')
    const response = await result.response
    
    // Extract audio data
    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data
    
    if (!audioData) {
      console.error('❌ No audio data received from Gemini TTS')
      return NextResponse.json({ error: 'No audio data received' }, { status: 500 })
    }

    console.log('✅ Audio data received, length:', audioData.length)

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioData, 'base64')
    
    // Create WAV header for the PCM data (24kHz, 16-bit, mono)
    const sampleRate = 24000
    const channels = 1
    const bitsPerSample = 16
    const byteRate = sampleRate * channels * bitsPerSample / 8
    const blockAlign = channels * bitsPerSample / 8
    const dataSize = audioBuffer.length
    const fileSize = 36 + dataSize
    
    // WAV header
    const wavHeader = Buffer.alloc(44)
    wavHeader.write('RIFF', 0)
    wavHeader.writeUInt32LE(fileSize, 4)
    wavHeader.write('WAVE', 8)
    wavHeader.write('fmt ', 12)
    wavHeader.writeUInt32LE(16, 16) // fmt chunk size
    wavHeader.writeUInt16LE(1, 20)  // audio format (PCM)
    wavHeader.writeUInt16LE(channels, 22)
    wavHeader.writeUInt32LE(sampleRate, 24)
    wavHeader.writeUInt32LE(byteRate, 28)
    wavHeader.writeUInt16LE(blockAlign, 32)
    wavHeader.writeUInt16LE(bitsPerSample, 34)
    wavHeader.write('data', 36)
    wavHeader.writeUInt32LE(dataSize, 40)
    
    // Combine header and audio data
    const wavBuffer = Buffer.concat([wavHeader, audioBuffer])
    
    console.log('✅ Gemini TTS Audio generated:', wavBuffer.length, 'bytes for voice:', voice)
    
    return new NextResponse(wavBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': wavBuffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    })
    
  } catch (error: any) {
    console.error('Gemini TTS Error:', error)
    return NextResponse.json({ 
      error: 'Failed to process Gemini TTS request',
      details: error.message 
    }, { status: 500 })
  }
}
