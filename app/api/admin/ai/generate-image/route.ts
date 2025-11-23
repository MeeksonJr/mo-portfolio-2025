import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'

// Groq models to try in order (using current production models)
const GROQ_MODELS = [
  'llama-3.3-70b-versatile', // Production - best quality
  'llama-3.1-8b-instant', // Production - fastest
  'openai/gpt-oss-20b', // Production - fast and capable
]

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      console.error('No authenticated user found in generate-image route')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { readmeContent, contentType, repoName, repoDescription } = await request.json()

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 })
    }

    const hfToken = process.env.HUGGINGFACE_API_TOKEN
    if (!hfToken) {
      return NextResponse.json({ error: 'Hugging Face API token not configured' }, { status: 500 })
    }

    // Generate image description using Groq
    const prompt = `Based on this GitHub repository, generate a detailed image description for a ${contentType === 'blog' ? 'blog post cover image' : contentType === 'case-study' ? 'case study featured image' : contentType === 'project' ? 'project showcase image' : 'resource thumbnail'}.

Repository Name: ${repoName}
Description: ${repoDescription || 'N/A'}

README Content:
${readmeContent?.substring(0, 2000) || 'N/A'}

Generate a detailed, creative image description (2-3 sentences) that would work well for image generation. Focus on:
- Visual style (modern, technical, minimalist, etc.)
- Key elements to include
- Color scheme
- Overall mood/atmosphere

Return only the image description text, nothing else.`

    // Try Groq models in order
    let imageDescription = null
    let lastError = null

    for (const modelName of GROQ_MODELS) {
      try {
        console.log(`🔄 Trying Groq model for image description: ${modelName}`)

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
                content: 'You are a helpful AI assistant that generates creative image descriptions for portfolio websites. Return only the image description text, nothing else.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            max_tokens: 300,
            temperature: 0.8,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Groq API error: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        imageDescription = data.choices?.[0]?.message?.content?.trim()

        if (imageDescription) {
          console.log(`✅ Groq model ${modelName} succeeded!`)
          break // Success, exit loop
        }
      } catch (modelError: any) {
        console.error(`❌ Groq model ${modelName} failed:`, modelError.message)
        lastError = modelError
        continue // Try next model
      }
    }

    if (!imageDescription) {
      throw new Error(`All Groq models failed. Last error: ${lastError?.message || 'Unknown error'}`)
    }

    // Generate image using Hugging Face Router API
    // Try multiple models in case one fails - using models from user's list
    const hfModels = [
      { id: 'stabilityai/stable-diffusion-xl-base-1.0', params: { num_inference_steps: 50, guidance_scale: 7.5 } },
      { id: 'CompVis/stable-diffusion-v1-4', params: { num_inference_steps: 50, guidance_scale: 7.5 } },
      { id: 'stabilityai/sdxl-turbo', params: { num_inference_steps: 4, guidance_scale: 0 } },
      { id: 'stabilityai/stable-diffusion-3-medium', params: { num_inference_steps: 50, guidance_scale: 7.5 } },
    ]

    let imageBlob = null
    let hfError = null

    for (const model of hfModels) {
      try {
        console.log(`🔄 Trying Hugging Face model: ${model.id}`)
        
        // Try different router endpoint formats
        // Based on Hugging Face documentation, the router might use different paths
        const routerEndpoints = [
          `https://router.huggingface.co/hf-inference/models/${model.id}`, // hf-inference format
          `https://router.huggingface.co/models/${model.id}`, // Direct model path
          `https://router.huggingface.co/v1/models/${model.id}`, // V1 API format
          `https://router.huggingface.co/inference/models/${model.id}`, // Alternative inference path
        ]
        
        let hfResponse = null
        let retryCount = 0
        const maxRetries = 2
        
        for (const endpoint of routerEndpoints) {
          try {
            console.log(`  Trying router endpoint: ${endpoint}`)
            
            while (retryCount <= maxRetries) {
              try {
                if (retryCount > 0) {
                  console.log(`  Retry attempt ${retryCount} for ${model.id}...`)
                  await new Promise(resolve => setTimeout(resolve, 15000)) // Wait 15 seconds
                }
                
                // Try different request body formats for router API
                const requestBodies = [
                  // Standard format
                  {
                    inputs: imageDescription,
                    parameters: model.params,
                  },
                  // Router API might expect different format
                  {
                    prompt: imageDescription,
                    ...model.params,
                  },
                  // Alternative format
                  {
                    text: imageDescription,
                    parameters: model.params,
                  },
                ]
                
                let lastBodyError = null
                let foundWorkingBody = false
                
                for (const requestBody of requestBodies) {
                  try {
                    const testResponse = await fetch(endpoint, {
                      headers: {
                        Authorization: `Bearer ${hfToken}`,
                        'Content-Type': 'application/json',
                      },
                      method: 'POST',
                      body: JSON.stringify(requestBody),
                    })
                    
                    if (testResponse.ok) {
                      hfResponse = testResponse
                      foundWorkingBody = true
                      console.log(`  ✅ Router endpoint ${endpoint} succeeded with body format!`)
                      break // Success with this body format
                    }
                    
                    const errorText = await testResponse.text()
                    lastBodyError = errorText
                    console.log(`  ❌ Body format failed: ${testResponse.status} - ${errorText.substring(0, 100)}`)
                    
                    // If 404, try next body format
                    if (testResponse.status === 404) {
                      continue
                    }
                    
                    // If 503, might need to retry
                    if (testResponse.status === 503 && retryCount < maxRetries) {
                      hfResponse = testResponse
                      break // Will retry in outer loop
                    }
                    
                    // Other errors, try next body format
                    hfResponse = testResponse
                    continue
                  } catch (bodyError: any) {
                    lastBodyError = bodyError.message
                    continue
                  }
                }
                
                if (foundWorkingBody && hfResponse) {
                  break // Success, exit retry loop
                }
                
                if (!hfResponse) {
                  hfError = lastBodyError || 'No response from any body format'
                  break
                }
                
                const errorText = lastBodyError || await hfResponse.text()
                console.log(`  ❌ Router endpoint ${endpoint} failed: ${hfResponse.status} - ${errorText.substring(0, 200)}`)
                
                // If it's a 503 (model loading), retry
                if (hfResponse.status === 503 && retryCount < maxRetries) {
                  console.log(`  Model ${model.id} is loading, will retry...`)
                  retryCount++
                  continue
                }
                
                // If it's a 404 (not found), try next endpoint format
                if (hfResponse.status === 404) {
                  console.log(`  Endpoint format ${endpoint} not found, trying next format...`)
                  break // Try next endpoint format
                }
                
                // Other errors, try next endpoint format
                hfError = errorText
                break
              } catch (fetchError: any) {
                console.log(`  ❌ Fetch error for ${endpoint}:`, fetchError.message)
                hfError = fetchError.message
                if (retryCount < maxRetries) {
                  retryCount++
                  continue
                }
                break
              }
            }
            
            // If we got a successful response, break out of endpoint loop
            if (hfResponse && hfResponse.ok) {
              break
            }
          } catch (endpointError: any) {
            console.log(`  ❌ Endpoint ${endpoint} error:`, endpointError.message)
            hfError = endpointError.message
            continue // Try next endpoint format
          }
        }
        
        if (!hfResponse || !hfResponse.ok) {
          continue // Try next model
        }

        imageBlob = await hfResponse.blob()
        console.log(`✅ Hugging Face model ${model.id} succeeded!`)
        break // Success, exit model loop
      } catch (modelError: any) {
        console.error(`❌ Hugging Face model ${model.id} failed:`, modelError.message)
        hfError = modelError.message
        continue // Try next model
      }
    }

    if (!imageBlob) {
      return NextResponse.json(
        { 
          error: `Image generation failed. All models failed. Last error: ${hfError || 'Unknown error'}`,
          suggestion: 'The models may be loading. Please try again in a few moments.'
        },
        { status: 500 }
      )
    }

    const imageBuffer = await imageBlob.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    
    // Detect the correct MIME type from the blob
    // Default to PNG, but check if it's JPEG or other format
    let mimeType = imageBlob.type || 'image/png'
    // If blob type is empty or generic, try to detect from buffer
    if (!mimeType || mimeType === 'application/octet-stream') {
      // Check for JPEG signature (FF D8 FF)
      const uint8Array = new Uint8Array(imageBuffer)
      if (uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[2] === 0xFF) {
        mimeType = 'image/jpeg'
      } else if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4E && uint8Array[3] === 0x47) {
        // PNG signature
        mimeType = 'image/png'
      } else {
        // Default to PNG
        mimeType = 'image/png'
      }
    }
    
    const imageDataUrl = `data:${mimeType};base64,${base64Image}`

    return NextResponse.json({
      success: true,
      imageDescription,
      imageUrl: imageDataUrl,
      imageBase64: base64Image,
    })
  } catch (error: any) {
    console.error('Error generating image:', error)
    
    // Handle quota/rate limit errors
    if (error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('rate limit')) {
      return NextResponse.json(
        { 
          error: 'AI generation quota exceeded. Please wait a few minutes or check your API plan.',
          quotaExceeded: true 
        },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    )
  }
}

