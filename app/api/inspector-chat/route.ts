import { streamText } from "ai"
import { google } from "@ai-sdk/google"
import { groq } from "@ai-sdk/groq"

// Groq model fallback chain
const GROQ_MODELS = [
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
  "llama3-70b-8192",
  "llama3-8b-8192",
]

async function tryGroqModels(messages: any[], systemPrompt: string) {
  for (let i = 0; i < GROQ_MODELS.length; i++) {
    const modelName = GROQ_MODELS[i]
    try {
      console.log(`🔄 Inspector: Trying Groq model ${i + 1}/${GROQ_MODELS.length}: ${modelName}`)

      const result = await streamText({
        model: groq(modelName),
        system: systemPrompt,
        messages,
        maxTokens: 400,
      })

      console.log(`✅ Inspector: Groq model ${modelName} succeeded!`)
      return result
    } catch (error) {
      console.error(`❌ Inspector: Groq model ${modelName} failed:`, error.message)

      if (i === GROQ_MODELS.length - 1) {
        console.error("💥 Inspector: All Groq models failed!")
        throw new Error(`All Groq models failed. Last error: ${error.message}`)
      }
    }
  }
}

export const maxDuration = 30

export async function POST(req: Request) {
  console.log("🔍 Inspector Chat API: Request received")

  try {
    const body = await req.json()
    console.log("📝 Inspector Chat API: Request body parsed:", {
      messagesCount: body.messages?.length,
      model: body.model,
      elementTitle: body.elementInfo?.title,
      lastMessage: body.messages?.[body.messages.length - 1]?.content?.substring(0, 100) + "...",
    })

    const { messages, elementInfo, model = "gemini" } = body

    if (!messages || !Array.isArray(messages)) {
      console.error("❌ Inspector Chat API: Invalid messages format")
      throw new Error("Invalid messages format")
    }

    if (!elementInfo) {
      console.error("❌ Inspector Chat API: Missing element info")
      throw new Error("Element info is required")
    }

    const systemPrompt = `
You are an AI assistant helping users understand the technical details of Mohamed Datt's portfolio website. 

Current Element Information:
- Title: ${elementInfo.title}
- Description: ${elementInfo.description}
- Technical Details: ${elementInfo.details}
- Technologies: ${elementInfo.tech.join(", ")}
- Design Inspiration: ${elementInfo.inspiration}

Answer questions about this specific element, its implementation, design decisions, and how it relates to Mohamed's skills and experience. Be technical but accessible, and always relate back to Mohamed's expertise and journey.

You can discuss:
- Code implementation details
- Design patterns used
- Why certain technologies were chosen
- How this showcases Mohamed's skills
- Best practices demonstrated
- User experience considerations
- Responsive design approaches
- Animation and interaction details

Keep responses focused on the selected element while connecting to Mohamed's overall technical expertise.
`

    console.log(`🤖 Inspector Chat API: Using model: ${model}`)

    let result

    try {
      switch (model) {
        case "groq-llama":
        case "groq-mixtral":
        case "groq-gemma":
          console.log("🦙 Inspector Chat API: Initializing Groq models with fallback")
          result = await tryGroqModels(messages, systemPrompt)
          console.log("✅ Inspector Chat API: Groq response generated")
          break

        default:
          console.log("🌟 Inspector Chat API: Initializing Gemini model")
          try {
            // Try Gemini 2.0 Flash first
            console.log("🔄 Inspector: Trying Gemini 2.0 Flash...")
            result = await streamText({
              model: google("gemini-2.0-flash"),
              system: systemPrompt,
              messages,
              maxTokens: 400,
            })
            console.log("✅ Inspector: Gemini 2.0 Flash succeeded!")
          } catch (gemini2Error) {
            console.error("❌ Inspector: Gemini 2.0 Flash failed:", gemini2Error.message)
            console.log("🔄 Inspector: Falling back to Gemini 1.5 Flash...")

            try {
              result = await streamText({
                model: google("gemini-1.5-flash"),
                system: systemPrompt,
                messages,
                maxTokens: 400,
              })
              console.log("✅ Inspector: Gemini 1.5 Flash succeeded!")
            } catch (gemini15Error) {
              console.error("❌ Inspector: Gemini 1.5 Flash failed:", gemini15Error.message)
              throw new Error(`Both Gemini models failed. 2.0: ${gemini2Error.message}, 1.5: ${gemini15Error.message}`)
            }
          }
      }

      console.log("📤 Inspector Chat API: Returning streaming response")
      const response = result.toDataStreamResponse()
      console.log("🎯 Inspector Chat API: Response created successfully")
      return response
    } catch (modelError) {
      console.error("🔥 Inspector Chat API: Model-specific error:", {
        model,
        error: modelError.message,
        stack: modelError.stack,
      })
      throw modelError
    }
  } catch (error) {
    console.error("💥 Inspector Chat API Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })

    return new Response(
      JSON.stringify({
        error: "Failed to process inspector chat request",
        details: error.message,
        timestamp: new Date().toISOString(),
        model: req.body?.model || "unknown",
      }),
      {
        status: 500,
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
