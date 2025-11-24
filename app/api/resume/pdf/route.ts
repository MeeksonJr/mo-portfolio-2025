import { NextRequest, NextResponse } from 'next/server'
import React from 'react'
import { pdf } from '@react-pdf/renderer'
import { ResumePDF } from '@/components/resume/resume-pdf'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { format, data } = body

    if (!data) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 })
    }

    // Generate PDF - using type assertion to work around @react-pdf/renderer type issues
    const doc = React.createElement(ResumePDF, { data, format })
    const asBlob = await pdf(doc as any).toBlob()
    
    // Convert blob to buffer
    const arrayBuffer = await asBlob.arrayBuffer()
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
