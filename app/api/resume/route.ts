import { NextRequest } from 'next/server'
import { resumeData } from '@/lib/resume-data'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  withPerformanceMonitoring 
} from '@/lib/api-optimization'

export async function GET(request: NextRequest) {
  return withPerformanceMonitoring('resume-fetch', async () => {
    try {
      return createSuccessResponse(resumeData, 200, 'static')
    } catch (error) {
      return createErrorResponse(
        error instanceof Error ? error : new Error('Failed to fetch resume data'),
        500,
        'RESUME_FETCH_ERROR'
      )
    }
  })
}

