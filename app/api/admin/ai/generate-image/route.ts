import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'
import { uploadImageToStorage, base64ToArrayBuffer } from '@/lib/supabase/storage'

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

    // Check if user is admin
    const { isAdminUser } = await import('@/lib/supabase/api-helpers')
    const isAdmin = await isAdminUser(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { readmeContent, contentType, repoName, repoDescription, saveToStorage } = await request.json()

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

    // Generate image using Hugging Face Inference API
    // Updated to use working models (2025)
    const hfModels = [
      { id: 'stabilityai/stable-diffusion-xl-base-1.0', params: { num_inference_steps: 50, guidance_scale: 7.5 } },
      { id: 'runwayml/stable-diffusion-v1-5', params: { num_inference_steps: 50, guidance_scale: 7.5 } },
      { id: 'CompVis/stable-diffusion-v1-4', params: { num_inference_steps: 50, guidance_scale: 7.5 } },
      { id: 'stabilityai/sdxl-turbo', params: { num_inference_steps: 4, guidance_scale: 0 } },
    ]

    let imageBlob = null
    let hfError = null

    for (const model of hfModels) {
      try {
        console.log(`🔄 Trying Hugging Face model: ${model.id}`)
        
        // Use Hugging Face Inference API (standard endpoint)
        const inferenceEndpoints = [
          `https://api-inference.huggingface.co/models/${model.id}`, // Standard Inference API
          `https://api-inference.huggingface.co/pipeline/text-to-image/${model.id}`, // Pipeline format
        ]
        
        let hfResponse = null
        let retryCount = 0
        const maxRetries = 2
        
        for (const endpoint of inferenceEndpoints) {
          try {
            console.log(`  Trying inference endpoint: ${endpoint}`)
            
            while (retryCount <= maxRetries) {
              try {
                if (retryCount > 0) {
                  console.log(`  Retry attempt ${retryCount} for ${model.id}...`)
                  await new Promise(resolve => setTimeout(resolve, 10000)) // Wait 10 seconds
                }
                
                // Standard Hugging Face Inference API format
                const requestBody = {
                  inputs: imageDescription,
                  parameters: model.params,
                }
                
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
                  console.log(`  ✅ Inference endpoint ${endpoint} succeeded!`)
                  break // Success
                }
                
                const errorText = await testResponse.text()
                console.log(`  ❌ Endpoint failed: ${testResponse.status} - ${errorText.substring(0, 100)}`)
                
                // If 503 (model loading), retry
                if (testResponse.status === 503 && retryCount < maxRetries) {
                  retryCount++
                  continue
                }
                
                // If 401/404, try next endpoint
                if (testResponse.status === 401 || testResponse.status === 404) {
                  break // Try next endpoint
                }
                
                // If 503 (model loading), retry
                if (testResponse.status === 503 && retryCount < maxRetries) {
                  retryCount++
                  continue
                }
                
                // If 401/404, try next endpoint
                if (testResponse.status === 401 || testResponse.status === 404) {
                  break // Try next endpoint
                }
                
                // Other errors, try next endpoint
                hfError = errorText
                break
              } catch (fetchError: any) {
                console.log(`  ❌ Fetch error:`, fetchError.message)
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
            continue // Try next endpoint
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
    
    let imageUrl = `data:${mimeType};base64,${base64Image}`
    let storageUrl: string | null = null
    let storagePath: string | null = null

    // Optionally save to Supabase Storage
    if (saveToStorage) {
      try {
        const fileName = `${contentType || 'generated'}-${Date.now()}.${mimeType.split('/')[1] || 'png'}`
        const result = await uploadImageToStorage(imageBuffer, fileName, mimeType)
        storageUrl = result.url
        storagePath = result.path
        imageUrl = storageUrl // Use storage URL if available
      } catch (storageError: any) {
        console.error('Error uploading to storage:', storageError)
        // Continue with data URL if storage upload fails
      }
    }

    return NextResponse.json({
      success: true,
      imageDescription,
      imageUrl,
      imageBase64: base64Image,
      storageUrl,
      storagePath,
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

