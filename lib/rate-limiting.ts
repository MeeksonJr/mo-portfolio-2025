/**
 * Rate Limiting Utility
 * Simple in-memory rate limiting (can be enhanced with Redis for production)
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  identifier?: string // Custom identifier (defaults to IP)
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

/**
 * Check if request is within rate limit
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const { windowMs, maxRequests } = options
  const now = Date.now()
  const key = identifier

  // Get or create rate limit entry
  let entry = store[key]

  // If entry doesn't exist or window has expired, create new entry
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    }
    store[key] = entry
  }

  // Increment count
  entry.count++

  // Check if limit exceeded
  const allowed = entry.count <= maxRequests
  const remaining = Math.max(0, maxRequests - entry.count)
  const retryAfter = !allowed ? Math.ceil((entry.resetTime - now) / 1000) : undefined

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
    retryAfter,
  }
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'

  return ip.trim()
}

/**
 * Create rate limit middleware
 */
export function createRateLimitMiddleware(options: RateLimitOptions) {
  return async (request: Request): Promise<Response | null> => {
    const identifier = getClientIdentifier(request)
    const result = checkRateLimit(identifier, options)

    if (!result.allowed) {
      const response = new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: result.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': options.maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
            ...(result.retryAfter && {
              'Retry-After': result.retryAfter.toString(),
            }),
          },
        }
      )
      return response
    }

    return null // Continue with request
  }
}

/**
 * Clean up expired entries (run periodically)
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000)
}

/**
 * Predefined rate limit configurations
 */
export const rateLimitConfigs = {
  // Strict - for sensitive endpoints
  strict: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,
  },
  // Standard - for most API endpoints
  standard: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  // Lenient - for public endpoints
  lenient: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1000,
  },
  // Chat/AI endpoints - more restrictive
  ai: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50,
  },
}

