import { streamText } from "ai"
import { google } from "@ai-sdk/google"
import { groq } from "@ai-sdk/groq"
import { getGitHubData, formatGitHubDataForAI } from "@/lib/github-data"

// Update the MOHAMED_PROFILE_DATA to be a function that includes GitHub data
async function getMohamedProfileData(): Promise<string> {
  const githubData = await getGitHubData()
  const githubInfo = formatGitHubDataForAI(githubData)

  return `
You are an AI assistant representing Mohamed Datt, a Full Stack Developer. Here's comprehensive information about Mohamed:

PERSONAL BACKGROUND:
- Full name: Mohamed Datt
- Born in Guinea, raised in NYC, currently in Norfolk, Virginia
- Height: 6'2"
- Location: Norfolk, Virginia, USA
- Learned English in 3 months using cartoons like Dora after facing early bullying and setbacks
- Grew into a resilient, self-driven developer with a passion for creative, AI-powered web experiences

EDUCATION:
- Currently enrolled: B.S. in Computer Science at Old Dominion University (Jan 2025 - Present)
- Graduated: A.S. in Computer Science from Tidewater Community College (Sep 2022 - Dec 2024)
- Relevant courses: Object Oriented Programming (OOP), Data Structures and Algorithms, Engineering Design

EXPERIENCE:
- Software Developer Intern at Product Manager Accelerator (Sep 2024 - Dec 2025)
- Won 1st place out of 13 teams for best final app
- Gained valuable insights into full-stack development and project management
- Actively contributed to team discussions and collaborative problem-solving

TECHNICAL SKILLS:
Frontend: React, Next.js, TailwindCSS, Vite, Framer Motion
Backend: Node.js, Supabase, PostgreSQL, MongoDB, Firebase
AI Tools: Gemini 2.0, Groq, Hugging Face
Other: Git, GitHub API, PayPal Integration, RapidAPI, AWS, CI/CD, GraphQL API

MAJOR PROJECTS:
1. EduSphere AI - AI-powered dashboard for students
   - Stack: Next.js, Supabase, Gemini, Hugging Face, TailwindCSS
   - Features: AI assistant for assignments, blog generator, multi-platform support, PayPal subscriptions

2. Interview Prep AI - AI-driven interview practice platform
   - Stack: Next.js, Firebase Auth, PostgreSQL, Gemini, Vapi Voice
   - Features: Mock interviews with AI feedback, resume analysis, job matching, voice-based answering

3. AI Content Generator - SaaS tool for content generation
   - Stack: Next.js 14, Supabase, Gemini, Hugging Face, Recharts
   - Features: Blog/social/product content generation, sentiment analysis, analytics dashboard

INTERESTS: Gaming, AI, HealthTech, Frontend Development, EdTech

CONTACT:
- Email: d.mohamed1504@gmail.com
- Phone: +1 518-704-9000
- GitHub: github.com/MeeksonJr
- LinkedIn: linkedin.com/in/mohamed-datt
- Portfolio: mohameddatt.com

PERSONALITY TRAITS: Resilient, Creative, Resourceful, Self-taught

${githubInfo}

Answer questions about Mohamed in first person as if you are him, but make it clear you're an AI assistant representing him. Be conversational, enthusiastic, and highlight his journey from Guinea to becoming a developer in Norfolk, Virginia.

When discussing GitHub repositories, projects, or coding work, reference the live GitHub data provided above.
`
}

// Update the tryGroqModels function to use the dynamic profile data
async function tryGroqModels(messages: any[]) {
  const systemPrompt = await getMohamedProfileData()

  for (let i = 0; i < GROQ_MODELS.length; i++) {
    const modelName = GROQ_MODELS[i]
    try {
      console.log(`🔄 Trying Groq model ${i + 1}/${GROQ_MODELS.length}: ${modelName}`)

      const result = await streamText({
        model: groq(modelName),
        system: systemPrompt,
        messages,
      })

      console.log(`✅ Groq model ${modelName} succeeded!`)
      return result
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`❌ Groq model ${modelName} failed:`, errorMessage)

      if (i === GROQ_MODELS.length - 1) {
        console.error("💥 All Groq models failed!")
        throw new Error(`All Groq models failed. Last error: ${errorMessage}`)
      }
    }
  }
}

// Groq model fallback chain
const GROQ_MODELS = [
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
  "llama3-70b-8192",
  "llama3-8b-8192",
]

export const maxDuration = 30

// Update the main POST function to use dynamic profile data
export async function POST(req: Request) {
  console.log("🚀 Chat API: Request received")

  try {
    const body = await req.json()
    console.log("📝 Chat API: Request body parsed:", {
      messagesCount: body.messages?.length,
      model: body.model,
      lastMessage: body.messages?.[body.messages.length - 1]?.content?.substring(0, 100) + "...",
    })

    const { messages, model = "gemini" } = body

    if (!messages || !Array.isArray(messages)) {
      console.error("❌ Chat API: Invalid messages format")
      throw new Error("Invalid messages format")
    }

    console.log(`🤖 Chat API: Using model: ${model}`)

    let result

    try {
      switch (model) {
        case "groq-llama":
        case "groq-mixtral":
        case "groq-gemma":
          console.log("🦙 Chat API: Initializing Groq models with fallback")
          result = await tryGroqModels(messages)
          console.log("✅ Chat API: Groq response generated")
          break

        default:
          // Priority: Groq first, then Gemini, then HuggingFace
          console.log("🦙 Chat API: Trying Groq first (primary)")
          try {
            result = await tryGroqModels(messages)
            console.log("✅ Chat API: Groq response generated")
          } catch (groqError) {
            console.log("🔄 Groq failed, trying Gemini...")
            const profileData = await getMohamedProfileData()

            // Try different Gemini models in order
            const geminiModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]
            let geminiSuccess = false

            for (const geminiModel of geminiModels) {
              try {
                console.log(`🔄 Trying Gemini model: ${geminiModel}`)
                result = await streamText({
                  model: google(geminiModel),
                  system: profileData,
                  messages,
                  temperature: 0.7,
                })
                console.log(`✅ Gemini model ${geminiModel} succeeded!`)
                geminiSuccess = true
                break
              } catch (geminiError: unknown) {
                const errorMessage = geminiError instanceof Error ? geminiError.message : 'Unknown error'
                console.error(`❌ Gemini model ${geminiModel} failed:`, errorMessage)
                continue
              }
            }

            if (!geminiSuccess) {
              throw new Error("All AI providers failed")
            }
          }
      }

      console.log("📤 Chat API: Returning streaming response")
      console.log("🔍 Result type:", typeof result)
      console.log("🔍 Result constructor:", result?.constructor?.name)
      
      // Use toTextStreamResponse - this is the standard method for StreamTextResult
      if (result && typeof result.toTextStreamResponse === 'function') {
        console.log("✅ Using toTextStreamResponse method")
        return result.toTextStreamResponse()
      } else if (result && typeof result.toUIMessageStreamResponse === 'function') {
        console.log("✅ Using toUIMessageStreamResponse method")
        return result.toUIMessageStreamResponse()
      } else if (result instanceof Response) {
        console.log("✅ Result is already a Response object")
        return result
      } else {
        console.log("❌ No valid response method found, creating fallback response")
        // Fallback: create a simple streaming response
        return new Response(JSON.stringify({ error: 'Invalid response format' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    } catch (modelError: unknown) {
      const errorMessage = modelError instanceof Error ? modelError.message : 'Unknown error'
      const errorStack = modelError instanceof Error ? modelError.stack : undefined
      console.error("🔥 Chat API: Model-specific error:", {
        model,
        error: errorMessage,
        stack: errorStack,
      })
      
      // Return a user-friendly error response instead of throwing
      return new Response(JSON.stringify({
        error: "AI service is temporarily unavailable",
        message: "Our AI assistant is currently experiencing issues. Please try again later or contact us directly through the contact form below.",
        suggestion: "You can also reach out via email or use the contact form for immediate assistance."
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    const errorName = error instanceof Error ? error.name : 'Error'
    console.error("💥 Chat API Error:", {
      message: errorMessage,
      stack: errorStack,
      name: errorName,
    })

    return new Response(
      JSON.stringify({
        error: "AI service is temporarily unavailable",
        message: "Our AI assistant is currently experiencing issues. Please try again later or contact us directly through the contact form below.",
        suggestion: "You can also reach out via email or use the contact form for immediate assistance."
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
