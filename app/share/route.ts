import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

/**
 * Share Target Handler for PWA
 * Allows users to share content from other apps to this PWA
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const text = formData.get('text') as string
    const url = formData.get('url') as string

    // Store shared content in sessionStorage (will be handled client-side)
    // For now, redirect to home with share parameters
    const shareParams = new URLSearchParams()
    if (title) shareParams.set('title', title)
    if (text) shareParams.set('text', text)
    if (url) shareParams.set('url', url)

    // Redirect to a share handler page or home
    return redirect(`/?${shareParams.toString()}`)
  } catch (error) {
    console.error('Share target error:', error)
    return redirect('/')
  }
}

