import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/ai-providers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { personalInfo, experiences, educations, skills, certifications } = body

    if (!personalInfo) {
      return NextResponse.json(
        { error: 'Personal information is required' },
        { status: 400 }
      )
    }

    // Build context from resume data
    const experienceText = experiences
      ?.map((exp: any) => `${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})`)
      .join('\n') || 'No experience listed'

    const educationText = educations
      ?.map((edu: any) => `${edu.degree} from ${edu.institution}`)
      .join('\n') || 'No education listed'

    const skillsText = skills
      ?.map((skill: any) => `${skill.name} (${skill.level})`)
      .join(', ') || 'No skills listed'

    const prompt = `Generate a professional resume summary (2-3 sentences) for:
    
Name: ${personalInfo.fullName || 'Candidate'}
Location: ${personalInfo.location || 'Not specified'}
Email: ${personalInfo.email || 'Not specified'}

Experience:
${experienceText}

Education:
${educationText}

Skills:
${skillsText}

Generate a compelling professional summary that highlights key strengths, experience level, and value proposition. Keep it concise (2-3 sentences) and professional.`

    const aiResponse = await callAI({
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 200,
    })

    return NextResponse.json({
      summary: aiResponse.content.trim(),
    })
  } catch (error) {
    console.error('Error generating AI summary:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

