/**
 * API Helper Utilities
 * Common utilities for API route handlers
 */

import { NextRequest, NextResponse } from 'next/server'
import { createRateLimitMiddleware, rateLimitConfigs, getClientIdentifier } from './rate-limiting'
import { sanitizeText, sanitizeObject, sanitizeEmail, sanitizeUrl } from './input-sanitization'

/**
 * Apply rate limiting to API route
 */
export async function withRateLimit(
  request: NextRequest,
  config: keyof typeof rateLimitConfigs | { windowMs: number; maxRequests: number }
) {
  const rateLimitOptions = typeof config === 'string' 
    ? { ...rateLimitConfigs[config], identifier: getClientIdentifier(request) }
    : { ...config, identifier: getClientIdentifier(request) }

  const rateLimitMiddleware = createRateLimitMiddleware(rateLimitOptions)
  const rateLimitResponse = await rateLimitMiddleware(request)

  if (rateLimitResponse) {
    return NextResponse.json(
      JSON.parse(await rateLimitResponse.text()),
      {
        status: rateLimitResponse.status,
        headers: Object.fromEntries(rateLimitResponse.headers.entries()),
      }
    )
  }

  return null
}

/**
 * Sanitize request body
 */
export function sanitizeRequestBody<T extends Record<string, any>>(
  body: T,
  options: {
    sanitizeStrings?: boolean
    sanitizeUrls?: boolean
    sanitizeEmails?: boolean
  } = {}
): T {
  return sanitizeObject(body, {
    sanitizeStrings: options.sanitizeStrings ?? true,
    sanitizeUrls: options.sanitizeUrls ?? true,
    sanitizeEmails: options.sanitizeEmails ?? true,
  })
}

/**
 * Validate and sanitize email from request
 */
export function validateEmail(email: string): { valid: boolean; sanitized?: string; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' }
  }

  const sanitized = sanitizeEmail(email)
  if (!sanitized) {
    return { valid: false, error: 'Invalid email format' }
  }

  return { valid: true, sanitized }
}

/**
 * Validate and sanitize URL from request
 */
export function validateUrl(url: string): { valid: boolean; sanitized?: string; error?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' }
  }

  const sanitized = sanitizeUrl(url)
  if (!sanitized) {
    return { valid: false, error: 'Invalid URL format' }
  }

  return { valid: true, sanitized }
}

/**
 * Create error response
 */
export function createErrorResponse(
  message: string,
  status: number = 400,
  details?: Record<string, any>
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      ...details,
    },
    { status }
  )
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  )
}

