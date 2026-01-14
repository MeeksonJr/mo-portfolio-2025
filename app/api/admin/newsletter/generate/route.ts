import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createServerClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    // Check for Authorization header first
    const authHeader = request.headers.get('authorization')
    let session = null

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      const supabase = await createServerClient()
      const { data: { session: sessionData } } = await supabase.auth.getSession()
      // Verify token matches session
      if (sessionData?.access_token === token) {
        session = sessionData
      }
    } else {
      const supabase = await createServerClient()
      const { data: { session: sessionData } } = await supabase.auth.getSession()
      session = sessionData
    }

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminClient = createAdminClient()
    const { data: userRole } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!userRole || userRole.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, subject, content_type, content_id } = body

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

    // Generate newsletter content using AI (Gemini)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
    
    let content_html = ''
    let content_text = ''
    let preview_text = ''
    let generatedSubject = subject || title

    // Try to use Gemini AI for enhanced generation
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (geminiApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

        let prompt = `Create a professional newsletter email for a full-stack developer portfolio. `
        
        if (contentData) {
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

        prompt += `Return a JSON object with:
        - subject: Email subject line (engaging, under 60 characters)
        - preview_text: Preview text for email clients (under 150 characters)
        - content_html: HTML content for the newsletter (professional, responsive, include a call-to-action button)
        - content_text: Plain text version of the content

        Make it engaging, professional, and include a clear call-to-action.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Try to parse JSON from response
        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            if (parsed.subject) generatedSubject = parsed.subject
            if (parsed.preview_text) preview_text = parsed.preview_text
            if (parsed.content_html) content_html = parsed.content_html
            if (parsed.content_text) content_text = parsed.content_text
          } else {
            // If no JSON, use the text as content
            content_html = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><p style="font-size: 16px; line-height: 1.6; color: #484848;">${text.replace(/\n/g, '<br>')}</p></div>`
            content_text = text
          }
        } catch (parseError) {
          console.error('Error parsing Gemini response:', parseError)
          // Fall through to default generation
        }
      } catch (geminiError) {
        console.error('Error using Gemini AI:', geminiError)
        // Fall through to default generation
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

