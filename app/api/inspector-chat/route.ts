import { streamText } from "ai"
import { google } from "@ai-sdk/google"
import { groq } from "@ai-sdk/groq"

// Groq model fallback chain
const GROQ_MODELS = [
  "llama-3.3-70b-versatile", // Updated from deprecated llama-3.1-70b-versatile
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
        maxOutputTokens: 400,
      })

      console.log(`✅ Inspector: Groq model ${modelName} succeeded!`)
      return result
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`❌ Inspector: Groq model ${modelName} failed:`, errorMessage)

      if (i === GROQ_MODELS.length - 1) {
        console.error("💥 Inspector: All Groq models failed!")
        throw new Error(`All Groq models failed. Last error: ${errorMessage}`)
      }
    }
  }
}

export const maxDuration = 30

export async function POST(req: Request) {
  console.log("🔍 Inspector Chat API: Request received")

  let body: any = {}
  try {
    body = await req.json()
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
              maxOutputTokens: 400,
            })
            console.log("✅ Inspector: Gemini 2.0 Flash succeeded!")
          } catch (gemini2Error: unknown) {
            const gemini2ErrorMsg = gemini2Error instanceof Error ? gemini2Error.message : String(gemini2Error)
            console.error("❌ Inspector: Gemini 2.0 Flash failed:", gemini2ErrorMsg)
            console.log("🔄 Inspector: Falling back to Gemini 1.5 Flash...")

            try {
              result = await streamText({
                model: google("gemini-1.5-flash"),
                system: systemPrompt,
                messages,
                maxOutputTokens: 400,
              })
              console.log("✅ Inspector: Gemini 1.5 Flash succeeded!")
            } catch (gemini15Error: unknown) {
              const gemini15ErrorMsg = gemini15Error instanceof Error ? gemini15Error.message : String(gemini15Error)
              console.error("❌ Inspector: Gemini 1.5 Flash failed:", gemini15ErrorMsg)
              throw new Error(`Both Gemini models failed. 2.0: ${gemini2ErrorMsg}, 1.5: ${gemini15ErrorMsg}`)
            }
          }
      }

      if (!result) {
        throw new Error("No result from model")
      }

      console.log("📤 Inspector Chat API: Returning streaming response")
      const response = result.toTextStreamResponse()
      console.log("🎯 Inspector Chat API: Response created successfully")
      return response
    } catch (modelError: unknown) {
      const errorMessage = modelError instanceof Error ? modelError.message : String(modelError)
      const errorStack = modelError instanceof Error ? modelError.stack : undefined
      console.error("🔥 Inspector Chat API: Model-specific error:", {
        model,
        error: errorMessage,
        stack: errorStack,
      })
      throw modelError
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    const errorName = error instanceof Error ? error.name : 'Unknown'
    
    // Use body already parsed above, or default
    const modelName = body?.model || "unknown"

    console.error("💥 Inspector Chat API Error:", {
      message: errorMessage,
      stack: errorStack,
      name: errorName,
    })

    return new Response(
      JSON.stringify({
        error: "Failed to process inspector chat request",
        details: errorMessage,
        timestamp: new Date().toISOString(),
        model: modelName,
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
