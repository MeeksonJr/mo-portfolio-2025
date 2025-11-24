import { NextResponse } from 'next/server'
import { resumeData } from '@/lib/resume-data'

export async function GET() {
  try {
    return NextResponse.json(resumeData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching resume data:', error)
    return NextResponse.json({ error: 'Failed to fetch resume data' }, { status: 500 })
  }
}

