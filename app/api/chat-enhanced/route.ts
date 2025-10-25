import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { groq } from "@ai-sdk/groq"
import { getGitHubData, formatGitHubDataForAI } from "@/lib/github-data"

export const maxDuration = 30

const SERVICES_DATA = `
MOHAMED'S SERVICES & PRICING:

1. QUICK FIX ($150 - $300)
   - Bug fixes, small features, or quick consultations
   - 1-2 hour response time
   - Code review & debugging
   - Small feature additions
   - Performance optimization
   - Delivery: 1-3 days

2. STARTER SITE ($300 - $700) ⭐ MOST POPULAR
   - Professional landing pages and portfolio sites
   - Responsive design
   - SEO optimization
   - Contact form integration
   - GitHub deployment
   - 1 month support
   - Delivery: 1-2 weeks

3. SAAS SETUP ($1,500+)
   - Full-stack applications with AI integration
   - Complete app development
   - Authentication & database
   - AI/API integrations
   - Payment processing
   - Deployment & hosting
   - 3 months support & maintenance
   - Delivery: 4-8 weeks

SOLD PROJECT EXAMPLE:
- InterviewPrep AI: Sold for $500
- Full mock-interview platform with voice feedback
- Delivered in 6 weeks
- Ongoing maintenance contracted

WHEN A USER ASKS ABOUT SERVICES:
1. Ask clarifying questions about their needs:
   - What type of project? (website, app, feature, bug fix)
   - Timeline requirements?
   - Budget range?
   - Specific features needed?

2. Provide a personalized recommendation based on their answers

3. Give a quote estimate if you have enough information

4. Encourage them to email d.mohamed1504@gmail.com for detailed discussion
`

async function tryGenerateText(messages: any[], githubContext: string) {
  const systemPrompt = `You are Mohamed Datt's AI assistant on his portfolio website. You are knowledgeable, helpful, and professional.

${SERVICES_DATA}

${githubContext}

MOHAMED'S BACKGROUND:
- Born in Guinea, raised in NYC
- Learned English in 3 months using cartoons after facing early challenges
- Resilient, self-driven developer passionate about AI-powered web experiences
- Currently: B.S. Computer Science at Old Dominion University
- A.S. Computer Science from Tidewater Community College (Dec 2024)
- Won 1st place out of 13 teams in Fall 2024 internship
- 6'2", located in Norfolk, Virginia

YOUR PERSONALITY:
- Friendly but professional
- Ask clarifying questions when users inquire about services
- Provide detailed, helpful responses
- When discussing services, be consultative - understand their needs first
- Always end service discussions with: "Email d.mohamed1504@gmail.com to discuss further!"

IMPORTANT INTERACTION RULES:
1. If user asks about services/pricing: Ask about their project type, timeline, and needs
2. If user wants a quote: Gather requirements, then provide estimate with appropriate tier
3. If user asks about projects: Use the GitHub data to give accurate, detailed information
4. Keep responses conversational but informative
5. Use emojis occasionally to be friendly (but not excessive)

Be helpful, ask good questions, and guide users toward contacting Mohamed for work!`

  const messageHistory = [
    {
      role: "system" as const,
      content: systemPrompt,
    },
    ...messages,
  ]

  // Try models in order with correct identifiers (updated to current models)
  const models = [
    { provider: "google", model: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    { provider: "google", model: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
    { provider: "google", model: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
    { provider: "groq", model: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (Groq)" },
    { provider: "groq", model: "llama-3.1-70b-versatile", name: "Llama 3.1 70B (Groq)" },
    { provider: "groq", model: "mixtral-8x7b-32768", name: "Mixtral 8x7B (Groq)" },
  ]

  let lastError: any = null

  for (const modelConfig of models) {
    try {
      console.log(`🔄 Trying ${modelConfig.name}...`)

      const modelInstance = modelConfig.provider === "google" ? google(modelConfig.model) : groq(modelConfig.model)

      const result = await generateText({
        model: modelInstance,
        messages: messageHistory,
        temperature: 0.7,
        maxTokens: 1000,
      })

      console.log(`✅ Successfully using ${modelConfig.name}`)
      return result
    } catch (error: any) {
      console.error(`❌ ${modelConfig.name} failed:`, error.message)
      lastError = error
      // Continue to next model
    }
  }

  // If all models fail, throw the last error
  throw new Error(`All models failed. Last error: ${lastError?.message || "Unknown error"}`)
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Fetch GitHub data
    const githubData = await getGitHubData()
    const githubContext = formatGitHubDataForAI(githubData)

    const result = await tryGenerateText(messages, githubContext)
    
    // Return simple JSON response
    return new Response(JSON.stringify({
      text: result.text,
      usage: result.usage,
      finishReason: result.finishReason,
    }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error("Chat Enhanced API Error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
