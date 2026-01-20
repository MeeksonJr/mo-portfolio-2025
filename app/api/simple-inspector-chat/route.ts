import { GoogleGenerativeAI } from "@google/generative-ai"
import { getGitHubData, formatGitHubDataForAI } from "@/lib/github-data"

export const maxDuration = 30

export async function POST(req: Request) {
  console.log("🔍 Simple Inspector API: Request received")

  try {
    const body = await req.json()
    console.log("📝 Simple Inspector API: Request body:", {
      message: body.message?.substring(0, 100),
      model: body.model,
      elementTitle: body.elementInfo?.title,
      historyLength: body.history?.length || 0,
    })

    const { message, model = "gemini", elementInfo, history = [] } = body

    if (!message) {
      console.error("❌ Simple Inspector API: No message provided")
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    if (!elementInfo) {
      console.error("❌ Simple Inspector API: No element info provided")
      return Response.json({ error: "Element info is required" }, { status: 400 })
    }

    console.log(`🤖 Simple Inspector API: Using model: ${model}`)

    let response: string

    if (model.startsWith("groq")) {
      console.log("🦙 Simple Inspector API: Using Groq")
      response = await handleGroqRequest(message, elementInfo, history)
    } else {
      console.log("🌟 Simple Inspector API: Using Gemini")
      response = await handleGeminiRequest(message, elementInfo, history)
    }

    console.log("✅ Simple Inspector API: Response generated:", response.substring(0, 100) + "...")

    return Response.json({
      response,
      model,
      element: elementInfo.title,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error("💥 Simple Inspector API Error:", {
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

async function handleGeminiRequest(message: string, elementInfo: any, history: any[]): Promise<string> {
  console.log("🌟 Inspector Gemini: Initializing Google GenAI")

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured")
  }

  // Fetch GitHub data
  const githubData = await getGitHubData()
  const githubInfo = formatGitHubDataForAI(githubData)

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

  // Try different models in order
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]

  for (const modelName of models) {
    try {
      console.log(`🔄 Inspector Gemini: Trying ${modelName}`)

      const model = genAI.getGenerativeModel({ model: modelName })

      const systemPrompt = `
You are Mohamed Datt, a Full Stack Developer from Norfolk, Virginia. Answer questions about your portfolio website in first person, as if you're personally explaining your work to someone.

Current Element Information:
- Title: ${elementInfo.title}
- Description: ${elementInfo.description}
- Technical Details: ${elementInfo.details}
- Technologies: ${elementInfo.tech.join(", ")}
- Design Inspiration: ${elementInfo.inspiration}

${githubInfo}

Answer questions about this specific element naturally and conversationally. Explain your implementation choices, design decisions, and how this showcases your skills. Be technical but approachable.

You can discuss:
- Why you chose certain technologies
- How you implemented specific features
- Design patterns you used
- Best practices you followed
- User experience considerations
- Responsive design approaches
- Animation and interaction details
- Your development process
- How this relates to your GitHub projects

Keep responses focused and conversational, like you're talking to a potential employer or collaborator.
`

      // Build conversation context
      let conversationContext = systemPrompt + "\n\nConversation:\n"

      // Add recent history
      for (const msg of history.slice(-2)) {
        conversationContext += `${msg.role === "user" ? "User" : "Mohamed"}: ${msg.content}\n`
      }

      conversationContext += `User: ${message}\nMohamed:`

      const result = await model.generateContent(conversationContext)
      const response = await result.response
      const text = response.text()

      if (!text || text.trim().length === 0) {
        throw new Error("Empty response from model")
      }

      console.log(`✅ Inspector Gemini: ${modelName} succeeded!`)
      return text.trim()
    } catch (modelError: unknown) {
      const errorMessage = modelError instanceof Error ? modelError.message : String(modelError)
      console.error(`❌ Inspector Gemini: ${modelName} failed:`, errorMessage)
      continue
    }
  }

  throw new Error("All Gemini models failed")
}

async function handleGroqRequest(message: string, elementInfo: any, history: any[]): Promise<string> {
  console.log("🦙 Inspector Groq: Making request")

  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured")
  }

  // Fetch GitHub data
  const githubData = await getGitHubData()
  const githubInfo = formatGitHubDataForAI(githubData)

  const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"] // Updated deprecated model

  const systemPrompt = `
You are Mohamed Datt, a Full Stack Developer from Norfolk, Virginia. Answer questions about your portfolio website in first person, as if you're personally explaining your work to someone.

Current Element Information:
- Title: ${elementInfo.title}
- Description: ${elementInfo.description}
- Technical Details: ${elementInfo.details}
- Technologies: ${elementInfo.tech.join(", ")}
- Design Inspiration: ${elementInfo.inspiration}

${githubInfo}

Answer questions about this specific element naturally and conversationally. Explain your implementation choices, design decisions, and how this showcases your skills. Be technical but approachable.

Keep responses focused and conversational, like you're talking to a potential employer or collaborator.
`

  for (const modelName of models) {
    try {
      console.log(`🔄 Inspector Groq: Trying ${modelName}`)

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
            ...history.slice(-2).map((msg: any) => ({
              role: msg.role === "user" ? "user" : "assistant",
              content: msg.content,
            })),
            { role: "user", content: message },
          ],
          max_tokens: 400,
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

      console.log(`✅ Inspector Groq: ${modelName} succeeded!`)
      return data.choices[0].message.content.trim()
    } catch (modelError: unknown) {
      const errorMessage = modelError instanceof Error ? modelError.message : String(modelError)
      console.error(`❌ Inspector Groq: ${modelName} failed:`, errorMessage)
      continue
    }
  }

  throw new Error("All Groq models failed")
}
