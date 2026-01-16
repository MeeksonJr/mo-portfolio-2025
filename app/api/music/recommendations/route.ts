import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const revalidate = 0
export const dynamic = 'force-dynamic'

// POST - Get AI music recommendations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userQuery, currentSongs, mood, genre } = body

    // Get available songs for recommendations
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { data: allSongs } = await supabase
      .from('songs')
      .select('id, title, artist, album, genre, description')
      .eq('status', 'approved')
      .limit(100)

    if (!allSongs || allSongs.length === 0) {
      return NextResponse.json({
        recommendations: [],
        message: 'No songs available for recommendations',
      })
    }

    // Use Groq AI for recommendations
    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      // Fallback: Simple genre-based recommendations
      const recommended = allSongs
        .filter((song) => !currentSongs?.includes(song.id))
        .filter((song) => genre ? song.genre === genre : true)
        .slice(0, 10)
        .map((song) => ({ ...song, reason: `Based on ${song.genre || 'your'} preferences` }))

      return NextResponse.json({
        recommendations: recommended,
        message: 'Recommendations based on genre',
      })
    }

    // Build prompt for AI
    const songsList = allSongs.map((s) => `${s.title} by ${s.artist || 'Unknown'} (${s.genre || 'Unknown genre'})`).join('\n')
    const currentSongsList = currentSongs 
      ? allSongs.filter(s => currentSongs.includes(s.id)).map(s => `${s.title} by ${s.artist || 'Unknown'}`).join(', ')
      : 'None'

    let prompt = `You are a music recommendation AI. Based on the following information, recommend 5-10 songs from the available library.

Available Songs:
${songsList}

${currentSongsList !== 'None' ? `User is currently listening to: ${currentSongsList}` : ''}
${userQuery ? `User's request: "${userQuery}"` : ''}
${mood ? `Mood preference: ${mood}` : ''}
${genre ? `Genre preference: ${genre}` : ''}

Recommend songs that match the user's preferences, mood, and request. Return ONLY a JSON array of song titles (exact matches from the list above). Format: ["Song Title 1", "Song Title 2", ...]

IMPORTANT: Return ONLY the JSON array, no explanations, no markdown.`

    // Try Groq models
    const GROQ_MODELS = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
    ]

    let recommendations: any[] = []
    let lastError = null

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
            messages: [
              {
                role: 'system',
                content: 'You are a music recommendation assistant. Always respond with ONLY valid JSON arrays.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Groq API error: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        const text = data.choices?.[0]?.message?.content

        if (!text) {
          throw new Error('No content in Groq response')
        }

        // Parse JSON array from response
        let songTitles: string[] = []
        try {
          // Try to extract JSON array (using [\s\S] instead of . with s flag for compatibility)
          const jsonMatch = text.match(/\[[\s\S]*?\]/)
          if (jsonMatch) {
            songTitles = JSON.parse(jsonMatch[0])
          } else {
            songTitles = JSON.parse(text)
          }
        } catch (parseError) {
          // Fallback: extract song titles from text
          const lines = text.split('\n').filter((line: string) => line.trim())
          songTitles = lines
            .map((line: string) => line.replace(/^[-•*]\s*/, '').replace(/"/g, '').trim())
            .filter((title: string) => title.length > 0)
            .slice(0, 10)
        }

        // Match recommended titles to actual songs
        recommendations = songTitles
          .map((title) => {
            const song = allSongs.find(
              (s) => s.title.toLowerCase().includes(title.toLowerCase()) ||
                    title.toLowerCase().includes(s.title.toLowerCase())
            )
            return song ? { ...song, reason: `Recommended based on your preferences` } : null
          })
          .filter((s): s is any => s !== null && !currentSongs?.includes(s.id))
          .slice(0, 10)

        if (recommendations.length > 0) {
          return NextResponse.json({
            recommendations,
            message: 'AI-powered recommendations',
          })
        }
      } catch (error: any) {
        console.error(`Error with Groq model ${modelName}:`, error)
        lastError = error
        continue
      }
    }

    // Fallback to genre-based recommendations
    const recommended = allSongs
      .filter((song) => !currentSongs?.includes(song.id))
      .filter((song) => genre ? song.genre === genre : true)
      .slice(0, 10)
      .map((song) => ({ ...song, reason: `Based on ${song.genre || 'your'} preferences` }))

    return NextResponse.json({
      recommendations: recommended,
      message: 'Recommendations based on genre',
    })
  } catch (error: any) {
    console.error('Error in POST /api/music/recommendations:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}


