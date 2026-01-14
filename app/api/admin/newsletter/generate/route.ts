import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { getAuthenticatedUser, isAdminUser } = await import('@/lib/supabase/api-helpers')
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = await isAdminUser(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const adminClient = createAdminClient()
    const body = await request.json()
    const { title, subject, content_type, content_id, user_input, user_content } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // If content_id is provided, fetch the content
    let contentData = null
    if (content_id && content_type) {
      let table = ''
      switch (content_type) {
        case 'blog':
          table = 'blog_posts'
          break
        case 'project':
          table = 'projects'
          break
        case 'case-study':
          table = 'case_studies'
          break
        case 'music':
          table = 'songs'
          break
      }

      if (table) {
        const { data } = await adminClient.from(table).select('*').eq('id', content_id).single()
        contentData = data
      }
    }

    // Generate newsletter content using Groq AI (same as chatbot)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
    
    let content_html = ''
    let content_text = ''
    let preview_text = ''
    let generatedSubject = subject || title

    // Use Groq AI (same as chatbot) for enhanced generation
    const groqApiKey = process.env.GROQ_API_KEY
    const GROQ_MODELS = [
      'llama-3.3-70b-versatile', // Production - best quality
      'llama-3.1-70b-versatile', // Production - good quality
      'llama-3.1-8b-instant', // Production - fastest
    ]

    if (groqApiKey) {
      let lastError = null
      
      // Build prompt
      let prompt = `Create a professional newsletter email for a full-stack developer portfolio. `
      
      // If user provided input/content, use it as the foundation
      if (user_input || user_content) {
        prompt += `The user has provided the following content as a foundation:\n\n`
        if (user_input) {
          prompt += `User's input/instructions: "${user_input}"\n\n`
        }
        if (user_content) {
          prompt += `User's content to improve/expand: "${user_content}"\n\n`
        }
        prompt += `Please use this as a foundation to create, improve, expand, and enhance the newsletter content. `
        prompt += `Take what the user provided and build upon it to create a professional, engaging newsletter. `
        if (title) {
          prompt += `The newsletter title is: "${title}". `
        }
        if (subject) {
          prompt += `The subject line should be: "${subject}" or similar. `
        }
      } else if (contentData) {
        prompt += `The newsletter is about a new ${content_type}: "${contentData.title || contentData.name || title}". `
        if (contentData.description || contentData.excerpt) {
          prompt += `Description: ${contentData.description || contentData.excerpt}. `
        }
        prompt += `Generate an engaging newsletter that highlights this ${content_type} in a professional but friendly tone. `
      } else {
        prompt += `The newsletter title is: "${title}". `
        if (subject) {
          prompt += `Subject: "${subject}". `
        }
        prompt += `Generate an engaging newsletter that showcases updates from a full-stack developer portfolio. `
      }

      prompt += `\n\nIMPORTANT: You MUST respond with ONLY a valid JSON object. No markdown code blocks, no explanations, just pure JSON that can be parsed directly.

Return a JSON object with:
- subject: Email subject line (engaging, under 60 characters)
- preview_text: Preview text for email clients (under 150 characters)
- content_html: HTML content for the newsletter (professional, responsive, include a call-to-action button)
- content_text: Plain text version of the content

Make it engaging, professional, and include a clear call-to-action.`

      for (const modelName of GROQ_MODELS) {
        try {
          console.log(`🔄 Trying Groq model for newsletter: ${modelName}`)

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
                  content: 'You are a professional newsletter content generator. You MUST respond ONLY with valid JSON format. Do not include any markdown code blocks, explanations, or text outside the JSON object. Return pure JSON that can be parsed directly.',
                },
                {
                  role: 'user',
                  content: prompt,
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
            // Remove markdown code blocks if present
            let jsonText = text.trim()
            if (jsonText.startsWith('```')) {
              jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
            }
            
            const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0])
              if (parsed.subject) generatedSubject = parsed.subject
              if (parsed.preview_text) preview_text = parsed.preview_text
              if (parsed.content_html) content_html = parsed.content_html
              if (parsed.content_text) content_text = parsed.content_text
              
              console.log(`✅ Groq model ${modelName} succeeded!`)
              break // Success, exit loop
            } else {
              // If no JSON, use the text as content
              content_html = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><p style="font-size: 16px; line-height: 1.6; color: #484848;">${text.replace(/\n/g, '<br>')}</p></div>`
              content_text = text
              console.log(`✅ Groq model ${modelName} succeeded (non-JSON response)!`)
              break
            }
          } catch (parseError) {
            console.error(`Error parsing Groq response from ${modelName}:`, parseError)
            // Try next model
            lastError = parseError
            continue
          }
        } catch (modelError: any) {
          console.error(`❌ Groq model ${modelName} failed:`, modelError.message)
          lastError = modelError
          // Continue to next model
          continue
        }
      }
      
      // If all models failed, use fallback
      if (!content_html && lastError) {
        console.log('All Groq models failed, using fallback generation')
        // Fall through to default generation with user input if provided
        if (user_input || user_content) {
          // Use user input as base for fallback
          content_html = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px;">
                ${title}
              </h1>
              <div style="font-size: 16px; line-height: 1.6; color: #484848; margin-bottom: 24px;">
                ${user_content ? user_content.replace(/\n/g, '<br>') : user_input || 'Newsletter content based on your input.'}
              </div>
              <a href="${siteUrl}" style="display: inline-block; background-color: #22c55e; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: 600; margin-top: 16px;">
                Visit My Portfolio →
              </a>
            </div>
          `
          content_text = `${title}\n\n${user_content || user_input || 'Newsletter content based on your input.'}\n\nVisit: ${siteUrl}`
          preview_text = (user_input || user_content || `Updates from Mohamed Datt`).substring(0, 150)
          generatedSubject = subject || title
        }
      }
    }

    // Fallback to default generation if AI failed or not configured
    if (!content_html) {
      if (contentData) {
        // Generate based on content
        const contentTitle = contentData.title || contentData.name || title
        const contentDescription = contentData.description || contentData.excerpt || ''
        const contentUrl = `${siteUrl}/${content_type === 'case-study' ? 'case-studies' : content_type}s/${contentData.slug || contentData.id}`

        content_html = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px;">
              ${contentTitle}
            </h1>
            ${contentDescription ? `<p style="font-size: 16px; line-height: 1.6; color: #484848; margin-bottom: 24px;">${contentDescription}</p>` : ''}
            <a href="${contentUrl}" style="display: inline-block; background-color: #22c55e; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: 600; margin-top: 16px;">
              Read More →
            </a>
          </div>
        `

        content_text = `${contentTitle}\n\n${contentDescription}\n\nRead more: ${contentUrl}`
        preview_text = contentDescription.substring(0, 150) || `Check out my latest ${content_type}`
        generatedSubject = subject || `New ${content_type === 'case-study' ? 'Case Study' : content_type}: ${contentTitle}`
      } else {
        // Generate generic newsletter
        content_html = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px;">
              ${title}
            </h1>
            <p style="font-size: 16px; line-height: 1.6; color: #484848; margin-bottom: 24px;">
              Hi there! I wanted to share some exciting updates with you...
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #484848; margin-bottom: 24px;">
              [Your newsletter content goes here. You can edit this after generation.]
            </p>
            <a href="${siteUrl}" style="display: inline-block; background-color: #22c55e; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: 600; margin-top: 16px;">
              Visit My Portfolio
            </a>
          </div>
        `

        content_text = `${title}\n\nHi there! I wanted to share some exciting updates with you...\n\nVisit: ${siteUrl}`
        preview_text = `Updates from Mohamed Datt`
      }
    }

    return NextResponse.json({
      content_html,
      content_text,
      preview_text,
      subject: generatedSubject,
    })
  } catch (error) {
    console.error('Error in POST generate:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
