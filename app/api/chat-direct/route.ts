import { GoogleGenerativeAI } from "@google/generative-ai"

const MOHAMED_PROFILE_DATA = `
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

EXPERIENCE:
- Software Developer Intern at Product Manager Accelerator (Sep 2024 - Dec 2025)
- Won 1st place out of 13 teams for best final app

TECHNICAL SKILLS:
Frontend: React, Next.js, TailwindCSS, Vite, Framer Motion
Backend: Node.js, Supabase, PostgreSQL, MongoDB, Firebase
AI Tools: Gemini 2.0, Groq, Hugging Face

MAJOR PROJECTS:
1. EduSphere AI - AI-powered dashboard for students
2. Interview Prep AI - AI-driven interview practice platform  
3. AI Content Generator - SaaS tool for content generation

INTERESTS: Gaming, AI, HealthTech, Frontend Development, EdTech
CONTACT: d.mohamed1504@gmail.com, github.com/MeeksonJr, linkedin.com/in/mohamed-datt

Answer questions about Mohamed in first person as if you are him, but make it clear you're an AI assistant representing him. Be conversational, enthusiastic, and highlight his journey from Guinea to becoming a developer in Norfolk, Virginia.
`

export const maxDuration = 30

export async function POST(req: Request) {
  console.log("🚀 Direct Chat API: Request received")

  try {
    const body = await req.json()
    console.log("📝 Direct Chat API: Request body parsed:", {
      messagesCount: body.messages?.length,
      lastMessage: body.messages?.[body.messages.length - 1]?.content?.substring(0, 100) + "...",
    })

    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      console.error("❌ Direct Chat API: Invalid messages format")
      throw new Error("Invalid messages format")
    }

    // Get the latest user message
    const userMessage = messages[messages.length - 1]?.content
    if (!userMessage) {
      throw new Error("No user message found")
    }

    console.log("🌟 Direct Chat API: Initializing Google GenAI")

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

    // Try different models
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]

    for (const modelName of models) {
      try {
        console.log(`🔄 Direct Chat API: Trying ${modelName}`)

        const model = genAI.getGenerativeModel({ model: modelName })

        const prompt = `${MOHAMED_PROFILE_DATA}\n\nUser: ${userMessage}\nAssistant:`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        console.log("✅ Direct Chat API: Response generated:", text.substring(0, 100) + "...")

        // Return in the format expected by useChat
        return new Response(
          JSON.stringify({
            id: Date.now().toString(),
            role: "assistant",
            content: text,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
      } catch (modelError) {
        console.error(`❌ Direct Chat API: ${modelName} failed:`, modelError.message)
        continue
      }
    }

    throw new Error("All Gemini models failed")
  } catch (error) {
    console.error("💥 Direct Chat API Error:", {
      message: error.message,
      stack: error.stack,
    })

    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
