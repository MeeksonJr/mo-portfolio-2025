import { GoogleGenerativeAI } from "@google/generative-ai"
import { getGitHubData, formatGitHubDataForAI } from "@/lib/github-data"
import { createRateLimitMiddleware, rateLimitConfigs, getClientIdentifier } from "@/lib/rate-limiting"
import { sanitizeText } from "@/lib/input-sanitization"
import { logServerAnalyticsEvent } from "@/lib/analytics-server"

const MOHAMED_PROFILE_DATA = `
You are Mohamed Datt, a Full Stack Developer. Answer questions about yourself in first person, naturally and conversationally.

PERSONAL BACKGROUND:
- Born in Guinea, raised in NYC, currently in Norfolk, Virginia
- Height: 6'2"
- Learned English in 3 months using cartoons like Dora after facing early bullying and setbacks
- Grew into a resilient, self-driven developer with a passion for creative, AI-powered web experiences

EDUCATION:
- Currently enrolled: B.S. in Computer Science at Old Dominion University (Jan 2025 - Present)
- Graduated: A.S. in Computer Science from Tidewater Community College (Sep 2022 - Dec 2024)

EXPERIENCE:
- Software Developer Intern at Product Manager Accelerator (Sep 2024 - Dec 2025)
- Won 1st place out of 13 teams for best final app

TECHNICAL SKILLS:
Frontend: React, Next.js, TailwindCSS, Vite, Framer Motion
Backend: Node.js, Supabase, PostgreSQL, MongoDB, Firebase
AI Tools: Gemini 2.0, Groq, Hugging Face

MAJOR PROJECTS:
1. EduSphere AI - AI-powered dashboard for students
   - Stack: Next.js, Supabase, Gemini, Hugging Face, TailwindCSS
   - Features: AI assistant for assignments, blog generator, multi-platform support

2. Interview Prep AI - AI-driven interview practice platform
   - Stack: Next.js, Firebase Auth, PostgreSQL, Gemini, Vapi Voice
   - Features: Mock interviews with AI feedback, resume analysis, job matching

3. AI Content Generator - SaaS tool for content generation
   - Stack: Next.js 14, Supabase, Gemini, Hugging Face, Recharts
   - Features: Blog/social/product content generation, sentiment analysis, analytics dashboard

INTERESTS: Gaming, AI, HealthTech, Frontend Development, EdTech
CONTACT: d.mohamed1504@gmail.com, github.com/MeeksonJr, linkedin.com/in/mohamed-datt

Answer questions naturally and conversationally, as if you're talking to a potential employer or collaborator. Be enthusiastic about your journey from Guinea to becoming a developer in Norfolk, Virginia.

When asked about GitHub, repositories, or coding projects, provide detailed information from the live GitHub data.
`

export const maxDuration = 30

export async function POST(req: Request) {
  console.log("🚀 Simple Chat API: Request received")

  // Apply rate limiting
  const rateLimitMiddleware = createRateLimitMiddleware({
    ...rateLimitConfigs.ai,
    identifier: getClientIdentifier(req),
  })
  const rateLimitResponse = await rateLimitMiddleware(req)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const body = await req.json()
    console.log("📝 Simple Chat API: Request body:", {
      message: body.message?.substring(0, 100),
      model: body.model,
      historyLength: body.history?.length || 0,
    })

    // Sanitize input
    const { message: rawMessage, model = "gemini", history = [] } = body
    const message = sanitizeText(rawMessage || '')
    
    if (!message || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message is required and cannot be empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!message) {
      console.error("❌ Simple Chat API: No message provided")
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    console.log(`🤖 Simple Chat API: Using model: ${model}`)

    let response: string

    if (model === "groq") {
      console.log("🦙 Simple Chat API: Using Groq")
      response = await handleGroqRequest(message, history)
    } else {
      console.log("🌟 Simple Chat API: Using Gemini")
      response = await handleGeminiRequest(message, history)
    }

    console.log("✅ Simple Chat API: Response generated:", response.substring(0, 100) + "...")

    await logServerAnalyticsEvent({
      event_type: 'chat_usage',
      content_type: 'resource',
      content_id: 'ai-chatbot',
      metadata: {
        model,
        historyLength: history.length,
      },
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      user_agent: req.headers.get('user-agent'),
      referrer: req.headers.get('referer'),
    })

    return Response.json({
      response,
      model,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error("💥 Simple Chat API Error:", {
      message: errorMessage,
      stack: errorStack,
    })

    return Response.json(
      {
        error: `Failed to process request: ${errorMessage}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

async function handleGeminiRequest(message: string, history: any[]): Promise<string> {
  // Sanitize message
  const sanitizedMessage = sanitizeText(message)
  console.log("🌟 Gemini: Initializing Google GenAI")

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured")
  }

  // Fetch GitHub data with error handling
  let githubInfo = ""
  try {
    console.log("🐙 Gemini: Fetching GitHub data...")
    const githubData = await getGitHubData()
    githubInfo = formatGitHubDataForAI(githubData)
    console.log("✅ Gemini: GitHub data fetched successfully")
  } catch (error) {
    console.error("❌ Gemini: GitHub data fetch failed:", error)
    githubInfo =
      "GitHub data is temporarily unavailable, but I can still answer questions about Mohamed's projects and experience."
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

  // Try different models in order
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]

  for (const modelName of models) {
    try {
      console.log(`🔄 Gemini: Trying ${modelName}`)

      const model = genAI.getGenerativeModel({ model: modelName })

      // Build conversation context with GitHub data
      let conversationContext = MOHAMED_PROFILE_DATA + "\n\n" + githubInfo + "\n\nConversation:\n"

      // Add recent history
      for (const msg of history.slice(-3)) {
        conversationContext += `${msg.role === "user" ? "User" : "Mohamed"}: ${msg.content}\n`
      }

      conversationContext += `User: ${message}\nMohamed:`

      const result = await model.generateContent(conversationContext)
      const response = await result.response
      const text = response.text()

      if (!text || text.trim().length === 0) {
        throw new Error("Empty response from model")
      }

      console.log(`✅ Gemini: ${modelName} succeeded!`)
      return text.trim()
    } catch (modelError: unknown) {
      const errorMsg = modelError instanceof Error ? modelError.message : 'Unknown error'
      console.error(`❌ Gemini: ${modelName} failed:`, errorMsg)
      continue
    }
  }

  throw new Error("All Gemini models failed")
}

async function handleGroqRequest(message: string, history: any[]): Promise<string> {
  console.log("🦙 Groq: Making request")

  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured")
  }

  // Fetch GitHub data
  const githubData = await getGitHubData()
  const githubInfo = formatGitHubDataForAI(githubData)

  const models = ["llama-3.1-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"]

  const systemPrompt = MOHAMED_PROFILE_DATA + "\n\n" + githubInfo

  for (const modelName of models) {
    try {
      console.log(`🔄 Groq: Trying ${modelName}`)

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: "system", content: systemPrompt },
            ...history.slice(-3).map((msg: any) => ({
              role: msg.role === "user" ? "user" : "assistant",
              content: msg.content,
            })),
            { role: "user", content: message },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }

      const data = await response.json()

      if (!data.choices?.[0]?.message?.content) {
        throw new Error("Invalid response format from Groq")
      }

      console.log(`✅ Groq: ${modelName} succeeded!`)
      return data.choices[0].message.content.trim()
    } catch (modelError: unknown) {
      const errorMsg = modelError instanceof Error ? modelError.message : 'Unknown error'
      console.error(`❌ Groq: ${modelName} failed:`, errorMsg)
      continue
    }
  }

  throw new Error("All Groq models failed")
}
