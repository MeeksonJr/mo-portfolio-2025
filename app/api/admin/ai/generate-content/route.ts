import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'

// Groq models to try in order (using current production models)
const GROQ_MODELS = [
  'llama-3.3-70b-versatile', // Production - best quality
  'llama-3.1-8b-instant', // Production - fastest
  'openai/gpt-oss-20b', // Production - fast and capable
  'qwen/qwen3-32b', // Preview - good alternative
]

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      console.error('No authenticated user found in generate-content route')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { isAdminUser } = await import('@/lib/supabase/api-helpers')
    const isAdmin = await isAdminUser(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { readmeContent, contentType, repoName, repoDescription, techStack, fieldType = 'all' } = await request.json()

    if (!readmeContent) {
      return NextResponse.json({ error: 'README content is required' }, { status: 400 })
    }

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 })
    }

    // Generate prompt based on content type and field type
    let prompt = ''
    const fieldInstructions = getFieldInstructions(fieldType, contentType)
    
    switch (contentType) {
      case 'blog':
        prompt = `Based on the following GitHub repository README, ${fieldInstructions} for a blog post.

Repository Name: ${repoName}
Description: ${repoDescription || 'N/A'}
Tech Stack: ${techStack?.join(', ') || 'N/A'}

README Content:
${readmeContent.substring(0, 3000)}

${getFieldPrompt(fieldType, 'blog')}`
        break
      
      case 'case-study':
        prompt = `Based on the following GitHub repository README, ${fieldInstructions} for a case study.

Repository Name: ${repoName}
Description: ${repoDescription || 'N/A'}
Tech Stack: ${techStack?.join(', ') || 'N/A'}

README Content:
${readmeContent.substring(0, 3000)}

${getFieldPrompt(fieldType, 'case-study')}`
        break
      
      case 'resource':
        prompt = `Based on the following GitHub repository README, ${fieldInstructions} for a resource.

Repository Name: ${repoName}
Description: ${repoDescription || 'N/A'}

README Content:
${readmeContent.substring(0, 3000)}

${getFieldPrompt(fieldType, 'resource')}`
        break
      
      case 'project':
        prompt = `Based on the following GitHub repository README, ${fieldInstructions} for a project.

Repository Name: ${repoName}
Description: ${repoDescription || 'N/A'}

README Content:
${readmeContent.substring(0, 3000)}

${getFieldPrompt(fieldType, 'project')}`
        break
    }

    // Try Groq models in order
    let generatedData = null
    let lastError = null

    for (const modelName of GROQ_MODELS) {
      try {
        console.log(`🔄 Trying Groq model: ${modelName}`)

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
                content: 'You are a helpful AI assistant that generates content for portfolio websites. You MUST respond ONLY with valid JSON format. Do not include any markdown code blocks, explanations, or text outside the JSON object. Return pure JSON that can be parsed directly.',
              },
              {
                role: 'user',
                content: `${prompt}\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown, no explanations, just the JSON object.`,
              },
            ],
            max_tokens: 2000,
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

        // Try to parse JSON from response
        try {
          // Clean the text - remove markdown code blocks if present
          let cleanedText = text.trim()
          
          // Remove markdown code blocks
          const jsonMatch = cleanedText.match(/```json\n?([\s\S]*?)\n?```/) || cleanedText.match(/```\n?([\s\S]*?)\n?```/)
          if (jsonMatch) {
            cleanedText = jsonMatch[1].trim()
          }
          
          // Try direct JSON parse first
          try {
            generatedData = JSON.parse(cleanedText)
            console.log(`✅ Groq model ${modelName} succeeded!`)
            break // Success, exit loop
          } catch {
            // If that fails, try to extract JSON object from text
            const jsonObjectMatch = cleanedText.match(/\{[\s\S]*\}/)
            if (jsonObjectMatch) {
              generatedData = JSON.parse(jsonObjectMatch[0])
              console.log(`✅ Groq model ${modelName} succeeded (extracted JSON)!`)
              break
            }
            throw new Error('No valid JSON found in response')
          }
        } catch (parseError) {
          console.error(`JSON parsing error for ${modelName}:`, parseError)
          // Continue to next model instead of throwing
          continue
        }
      } catch (modelError: any) {
        console.error(`❌ Groq model ${modelName} failed:`, modelError.message)
        lastError = modelError
        continue // Try next model
      }
    }

    if (!generatedData) {
      throw new Error(`All Groq models failed. Last error: ${lastError?.message || 'Unknown error'}`)
    }

    return NextResponse.json({ success: true, data: generatedData })
  } catch (error: any) {
    console.error('Error generating content:', error)
    
    // Handle quota/rate limit errors
    if (error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('rate limit') || error.status === 429) {
      return NextResponse.json(
        { 
          error: 'AI generation quota exceeded. Please wait a few minutes or check your API plan. You can still manually fill in the fields.',
          quotaExceeded: true 
        },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    )
  }
}

// Helper function to get field-specific instructions
function getFieldInstructions(fieldType: string, contentType: string): string {
  if (fieldType === 'all') {
    return 'generate all content'
  }
  
  const fieldMap: Record<string, Record<string, string>> = {
    blog: {
      title: 'generate only a compelling title',
      excerpt: 'generate only an engaging excerpt (2-3 sentences)',
      content: 'generate only the full blog post content in Markdown format',
      seo: 'generate only SEO metadata (title and description)',
    },
    'case-study': {
      title: 'generate only a compelling title',
      description: 'generate only a description',
      content: 'generate only the full case study content',
      problem: 'generate only the problem statement',
      solution: 'generate only the solution overview',
      results: 'generate only the results section',
    },
    resource: {
      title: 'generate only a title',
      description: 'generate only a description',
    },
    project: {
      title: 'generate only a project name',
      description: 'generate only a description',
    },
  }
  
  return fieldMap[contentType]?.[fieldType] || 'generate the requested field'
}

// Helper function to get field-specific JSON format
function getFieldPrompt(fieldType: string, contentType: string): string {
  if (fieldType === 'all') {
    // Return full format for each content type
    switch (contentType) {
      case 'blog':
        return `Format the response as JSON:
{
  "title": "...",
  "excerpt": "...",
  "content": "...",
  "category": "...",
  "tags": ["tag1", "tag2", ...],
  "seo_title": "...",
  "seo_description": "..."
}`
      case 'case-study':
        return `Format the response as JSON:
{
  "title": "...",
  "description": "...",
  "content": "...",
  "problem_statement": "...",
  "solution_overview": "...",
  "challenges": ["challenge1", "challenge2", ...],
  "results": "...",
  "lessons_learned": ["lesson1", "lesson2", ...],
  "tech_stack": ["tech1", "tech2", ...]
}`
      case 'resource':
        return `Format the response as JSON:
{
  "title": "...",
  "description": "...",
  "type": "tool|course|book|article|video|other",
  "category": "...",
  "tags": ["tag1", "tag2", ...]
}`
      case 'project':
        return `Format the response as JSON:
{
  "name": "...",
  "description": "...",
  "tech_stack": ["tech1", "tech2", ...]
}`
    }
  }
  
  // Field-specific formats
  switch (contentType) {
    case 'blog':
      if (fieldType === 'title') {
        return `Format the response as JSON: { "title": "..." }`
      } else if (fieldType === 'excerpt') {
        return `Format the response as JSON: { "excerpt": "..." }`
      } else if (fieldType === 'content') {
        return `Format the response as JSON: { "content": "..." }`
      } else if (fieldType === 'seo') {
        return `Format the response as JSON: { "seo_title": "...", "seo_description": "..." }`
      }
      break
    case 'case-study':
      if (fieldType === 'title') {
        return `Format the response as JSON: { "title": "..." }`
      } else if (fieldType === 'description') {
        return `Format the response as JSON: { "description": "..." }`
      } else if (fieldType === 'content') {
        return `Format the response as JSON: { "content": "..." }`
      } else if (fieldType === 'problem') {
        return `Format the response as JSON: { "problem_statement": "..." }`
      } else if (fieldType === 'solution') {
        return `Format the response as JSON: { "solution_overview": "..." }`
      } else if (fieldType === 'results') {
        return `Format the response as JSON: { "results": "..." }`
      }
      break
    case 'resource':
      if (fieldType === 'title') {
        return `Format the response as JSON: { "title": "..." }`
      } else if (fieldType === 'description') {
        return `Format the response as JSON: { "description": "..." }`
      }
      break
    case 'project':
      if (fieldType === 'title') {
        return `Format the response as JSON: { "name": "..." }`
      } else if (fieldType === 'description') {
        return `Format the response as JSON: { "description": "..." }`
      }
      break
  }
  
  return `Format the response as JSON with the requested field.`
}

