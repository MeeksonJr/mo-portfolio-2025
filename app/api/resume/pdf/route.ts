import { NextRequest, NextResponse } from 'next/server'
import React from 'react'
import { pdf } from '@react-pdf/renderer'
import { ResumePDF } from '@/components/resume/resume-pdf'

// @react-pdf/renderer requires Node.js runtime (not Edge)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { format, data } = body

    if (!data) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 })
    }

    // Guard against missing nested fields that crash the renderer
    const safeData = {
      ...data,
      personal: {
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        github: '',
        linkedin: '',
        website: '',
        summary: '',
        ...(data.personal ?? {}),
      },
      experience: Array.isArray(data.experience) ? data.experience : [],
      education: Array.isArray(data.education) ? data.education : [],
      skills: {
        frontend: [],
        backend: [],
        tools: [],
        ai: [],
        other: [],
        ...(data.skills ?? {}),
      },
      projects: Array.isArray(data.projects) ? data.projects : [],
      certifications: Array.isArray(data.certifications) ? data.certifications : [],
    }

    // Generate PDF using @react-pdf/renderer
    const doc = React.createElement(ResumePDF, { data: safeData, format })
    const instance = pdf(doc as any)
    const blob = await instance.toBlob()

    // Convert blob to buffer
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Mohamed-Datt-Resume-${format}-${new Date().getFullYear()}.pdf"`,
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

