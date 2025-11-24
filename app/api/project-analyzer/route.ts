import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  createSuccessResponse,
  createErrorResponse,
  withPerformanceMonitoring,
  validateMethod,
  parseJsonBody,
} from '@/lib/api-optimization'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export const maxDuration = 60

interface AnalyzeRequest {
  repoUrl: string
  includeCodeQuality?: boolean
  includeSuggestions?: boolean
  includeDocumentation?: boolean
}

interface ProjectAnalysis {
  repoUrl: string
  techStack: {
    languages: string[]
    frameworks: string[]
    databases: string[]
    tools: string[]
  }
  codeQuality: {
    score: number
    metrics: {
      testCoverage?: string
      documentation?: string
      codeStyle?: string
      dependencies?: string
    }
  }
  insights: {
    strengths: string[]
    improvements: string[]
    recommendations: string[]
  }
  documentation?: {
    readme: string
    apiDocs?: string
  }
  analyzedAt: string
}

export async function POST(request: NextRequest) {
  const methodError = validateMethod(request, ['POST'])
  if (methodError) return methodError

  return withPerformanceMonitoring('project-analyzer', async () => {
    try {
      const body = await parseJsonBody<AnalyzeRequest>(request)
      const { repoUrl, includeCodeQuality = true, includeSuggestions = true, includeDocumentation = false } = body

      if (!repoUrl) {
        return createErrorResponse('Repository URL is required', 400, 'MISSING_REPO_URL')
      }

      // Extract owner and repo from URL
      const repoMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
      if (!repoMatch) {
        return createErrorResponse('Invalid GitHub repository URL', 400, 'INVALID_REPO_URL')
      }

      const [, owner, repo] = repoMatch

      // Fetch repository data from GitHub API
      const githubHeaders: HeadersInit = {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'portfolio-app',
      }

      if (process.env.GITHUB_TOKEN) {
        githubHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
      }

      const [repoResponse, languagesResponse, readmeResponse] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: githubHeaders,
          next: { revalidate: 300 },
        }),
        fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
          headers: githubHeaders,
          next: { revalidate: 300 },
        }),
        fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
          headers: githubHeaders,
          next: { revalidate: 300 },
        }).catch(() => null), // README is optional
      ])

      if (!repoResponse.ok) {
        return createErrorResponse(
          `Failed to fetch repository: ${repoResponse.statusText}`,
          repoResponse.status,
          'GITHUB_API_ERROR'
        )
      }

      const repoData = await repoResponse.json()
      const languagesData = languagesResponse.ok ? await languagesResponse.json() : {}
      const readmeData = readmeResponse?.ok ? await readmeResponse.json() : null

      // Prepare context for AI analysis
      const analysisContext = `
Repository: ${repoData.full_name}
Description: ${repoData.description || 'No description'}
Language: ${repoData.language || 'Unknown'}
Languages Used: ${Object.keys(languagesData).join(', ')}
Stars: ${repoData.stargazers_count}
Forks: ${repoData.forks_count}
Open Issues: ${repoData.open_issues_count}
Created: ${repoData.created_at}
Updated: ${repoData.updated_at}
Has Wiki: ${repoData.has_wiki}
Has Pages: ${repoData.has_pages}
License: ${repoData.license?.name || 'None'}
Topics: ${repoData.topics?.join(', ') || 'None'}
${readmeData ? `\nREADME Preview: ${Buffer.from(readmeData.content, 'base64').toString('utf-8').substring(0, 1000)}` : ''}
`

      // Generate AI analysis
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

      const analysisPrompt = `
Analyze this GitHub repository and provide a comprehensive analysis in JSON format.

Repository Information:
${analysisContext}

Please provide a detailed analysis including:
1. Tech Stack Detection: Identify all languages, frameworks, databases, and tools used
2. ${includeCodeQuality ? 'Code Quality Metrics: Assess code quality, test coverage, documentation, code style, and dependencies' : ''}
3. ${includeSuggestions ? 'Insights: List strengths, areas for improvement, and actionable recommendations' : ''}
4. ${includeDocumentation ? 'Documentation: Generate or improve README and API documentation suggestions' : ''}

Return the analysis as a JSON object with this structure:
{
  "techStack": {
    "languages": ["array of languages"],
    "frameworks": ["array of frameworks"],
    "databases": ["array of databases"],
    "tools": ["array of tools"]
  },
  ${includeCodeQuality ? `"codeQuality": {
    "score": 0-100,
    "metrics": {
      "testCoverage": "assessment",
      "documentation": "assessment",
      "codeStyle": "assessment",
      "dependencies": "assessment"
    }
  },` : ''}
  ${includeSuggestions ? `"insights": {
    "strengths": ["array of strengths"],
    "improvements": ["array of improvements"],
    "recommendations": ["array of recommendations"]
  },` : ''}
  ${includeDocumentation ? `"documentation": {
    "readme": "improved README suggestions",
    "apiDocs": "API documentation suggestions"
  },` : ''}
}

Be specific, actionable, and professional. Focus on practical insights that would help improve the repository.
`

      const result = await model.generateContent(analysisPrompt)
      const response = await result.response
      const text = response.text()

      // Parse AI response (handle markdown code blocks)
      let analysisJson = text
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        analysisJson = jsonMatch[1]
      }

      let analysis: Partial<ProjectAnalysis>
      try {
        analysis = JSON.parse(analysisJson)
      } catch (parseError) {
        // If JSON parsing fails, try to extract structured data from text
        console.warn('Failed to parse AI response as JSON, attempting text extraction')
        analysis = {
          techStack: {
            languages: extractArray(text, 'languages'),
            frameworks: extractArray(text, 'frameworks'),
            databases: extractArray(text, 'databases'),
            tools: extractArray(text, 'tools'),
          },
          insights: {
            strengths: extractArray(text, 'strengths'),
            improvements: extractArray(text, 'improvements'),
            recommendations: extractArray(text, 'recommendations'),
          },
        }
      }

      const fullAnalysis: ProjectAnalysis = {
        repoUrl,
        techStack: analysis.techStack || {
          languages: Object.keys(languagesData),
          frameworks: [],
          databases: [],
          tools: [],
        },
        codeQuality: analysis.codeQuality || {
          score: 70,
          metrics: {},
        },
        insights: analysis.insights || {
          strengths: [],
          improvements: [],
          recommendations: [],
        },
        documentation: analysis.documentation,
        analyzedAt: new Date().toISOString(),
      }

      return createSuccessResponse(fullAnalysis, 200, 'dynamic')
    } catch (error) {
      return createErrorResponse(
        error instanceof Error ? error : new Error('Failed to analyze project'),
        500,
        'ANALYSIS_ERROR'
      )
    }
  })
}

// Helper to extract arrays from text
function extractArray(text: string, key: string): string[] {
  const regex = new RegExp(`${key}[\\s]*:[\\s]*\\[([^\\]]+)\\]`, 'i')
  const match = text.match(regex)
  if (match) {
    return match[1]
      .split(',')
      .map((item) => item.trim().replace(/['"]/g, ''))
      .filter(Boolean)
  }
  return []
}

