import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

// Create next-intl middleware
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed' // Don't add /en prefix for default locale
})

export function middleware(request: NextRequest) {
  // First run next-intl middleware to handle locale detection
  const intlResponse = intlMiddleware(request)
  const response = intlResponse || NextResponse.next()

  // Build CSP directives with better organization
  const cspDirectives = [
    "default-src 'self'",
    // Scripts - allow inline for Next.js and analytics
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel-analytics.com https://*.googletagmanager.com https://www.googletagmanager.com",
    // Styles - allow inline for Tailwind and component styles
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Fonts
    "font-src 'self' https://fonts.gstatic.com data:",
    // Images - allow all HTTPS for external images (Supabase, GitHub, etc.)
    "img-src 'self' data: https: blob:",
    // Connections - API endpoints
    "connect-src 'self' https://*.vercel-analytics.com https://*.supabase.co https://api.github.com https://*.googleapis.com https://*.groq.com https://api-inference.huggingface.co wss://*.supabase.co",
    // Frames - embedded content (allow all HTTPS for project demos)
    "frame-src 'self' https: http:",
    // Media - allow Supabase storage for music files
    "media-src 'self' data: blob: https://*.supabase.co",
    // Disallow object/embed
    "object-src 'none'",
    // Base URI
    "base-uri 'self'",
    // Form actions
    "form-action 'self'",
    // Frame ancestors
    "frame-ancestors 'self'",
    // Upgrade insecure requests
    "upgrade-insecure-requests",
  ]

  // Security Headers
  const securityHeaders = {
    // Content Security Policy
    'Content-Security-Policy': cspDirectives.join('; '),
    
    // XSS Protection (legacy but still useful)
    'X-XSS-Protection': '1; mode=block',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Clickjacking protection
    'X-Frame-Options': 'SAMEORIGIN',
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy (formerly Feature Policy)
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()',
      'payment=()',
      'usb=()',
    ].join(', '),
    
    // Strict Transport Security (HSTS) - Only in production
    ...(process.env.NODE_ENV === 'production' && {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    }),
    
    // Cross-Origin Embedder Policy (optional, can be relaxed if needed)
    'Cross-Origin-Embedder-Policy': 'require-corp',
    
    // Cross-Origin Opener Policy
    'Cross-Origin-Opener-Policy': 'same-origin',
    
    // Cross-Origin Resource Policy
    'Cross-Origin-Resource-Policy': 'same-origin',
  }

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value)
    }
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

