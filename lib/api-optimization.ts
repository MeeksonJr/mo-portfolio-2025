import { NextRequest, NextResponse } from 'next/server'

/**
 * Cache configuration for different route types
 */
export const cacheConfigs = {
  static: {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
  },
  dynamic: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
  },
  noCache: {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  },
  api: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  },
} as const

/**
 * Request deduplication cache (in-memory, resets on server restart)
 */
const requestCache = new Map<string, { data: any; timestamp: number; ttl: number }>()

/**
 * Deduplicate requests within a time window
 */
export function deduplicateRequest<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5000 // 5 seconds default
): Promise<T> {
  const cached = requestCache.get(key)
  const now = Date.now()

  // Return cached result if still valid
  if (cached && now - cached.timestamp < cached.ttl) {
    return Promise.resolve(cached.data)
  }

  // Fetch new data
  return fetcher().then((data) => {
    requestCache.set(key, { data, timestamp: now, ttl })
    return data
  })
}

/**
 * Clean up expired cache entries (call periodically)
 */
export function cleanupRequestCache() {
  const now = Date.now()
  for (const [key, value] of requestCache.entries()) {
    if (now - value.timestamp >= value.ttl) {
      requestCache.delete(key)
    }
  }
}

/**
 * Standardized error response
 */
export interface ApiError {
  error: string
  message?: string
  code?: string
  details?: Record<string, any>
  timestamp?: string
}

export function createErrorResponse(
  error: string | Error,
  status: number = 500,
  code?: string,
  details?: Record<string, any>
): NextResponse<ApiError> {
  const errorMessage = error instanceof Error ? error.message : error
  const errorStack = error instanceof Error ? error.stack : undefined

  const response: ApiError = {
    error: errorMessage,
    code: code || `ERR_${status}`,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
  }

  // Log error for monitoring
  console.error(`[API Error ${status}]`, {
    error: errorMessage,
    code,
    details,
    ...(errorStack && { stack: errorStack }),
  })

  return NextResponse.json(response, {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...cacheConfigs.noCache,
    },
  })
}

/**
 * Standardized success response with optional caching
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200,
  cacheType: keyof typeof cacheConfigs = 'api'
): NextResponse<T> {
  return NextResponse.json(data, {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...cacheConfigs[cacheType],
    },
  })
}

/**
 * Performance monitoring wrapper
 */
export async function withPerformanceMonitoring<T>(
  operation: string,
  handler: () => Promise<T>
): Promise<T> {
  const startTime = Date.now()
  try {
    const result = await handler()
    const duration = Date.now() - startTime

    // Log slow operations (>1 second)
    if (duration > 1000) {
      console.warn(`[Performance] Slow operation: ${operation} took ${duration}ms`)
    }

    return result
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[Performance] Failed operation: ${operation} took ${duration}ms`, error)
    throw error
  }
}

/**
 * Rate limit error response
 */
export function createRateLimitResponse(retryAfter?: number): NextResponse {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...cacheConfigs.noCache,
  }

  if (retryAfter) {
    headers['Retry-After'] = retryAfter.toString()
  }

  return NextResponse.json(
    {
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter,
    },
    {
      status: 429,
      headers,
    }
  )
}

/**
 * Validate request method
 */
export function validateMethod(
  request: NextRequest,
  allowedMethods: string[]
): NextResponse | null {
  const method = request.method
  if (!allowedMethods.includes(method)) {
    return createErrorResponse(
      `Method ${method} not allowed`,
      405,
      'METHOD_NOT_ALLOWED',
      { allowedMethods }
    )
  }
  return null
}

/**
 * Parse and validate JSON body
 */
export async function parseJsonBody<T = any>(request: NextRequest): Promise<T> {
  try {
    const body = await request.json()
    return body as T
  } catch (error) {
    throw new Error('Invalid JSON body')
  }
}

/**
 * Get request metadata for logging
 */
export function getRequestMetadata(request: NextRequest) {
  return {
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    referer: request.headers.get('referer'),
  }
}

