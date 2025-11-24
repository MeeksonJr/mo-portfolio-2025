/**
 * Input Sanitization Utility
 * Provides XSS prevention, SQL injection prevention, and content filtering
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * Basic implementation - can be enhanced with DOMPurify if needed
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') {
    return ''
  }

  // Remove script tags and event handlers
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '')

  // Remove dangerous protocols
  sanitized = sanitized.replace(
    /(href|src|action|formaction)=["'](javascript|data|vbscript):/gi,
    ''
  )

  return sanitized
}

/**
 * Sanitize plain text input
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') {
    return ''
  }

  return text
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

/**
 * Sanitize SQL input to prevent SQL injection
 * Note: Always use parameterized queries in production
 */
export function sanitizeSql(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  // Remove SQL keywords and special characters
  const dangerous = [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER',
    'EXEC', 'EXECUTE', 'UNION', 'SCRIPT', '--', ';', '/*', '*/',
    "'", '"', '`', '\\', '/', '*'
  ]

  let sanitized = input
  dangerous.forEach((keyword) => {
    const regex = new RegExp(keyword, 'gi')
    sanitized = sanitized.replace(regex, '')
  })

  return sanitized.trim()
}

/**
 * Validate and sanitize file upload
 */
export interface FileValidationOptions {
  allowedTypes?: string[]
  maxSize?: number // in bytes
  allowedExtensions?: string[]
}

export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): { valid: boolean; error?: string } {
  const {
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'],
  } = options

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    }
  }

  // Check file extension
  const fileName = file.name.toLowerCase()
  const hasValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext.toLowerCase())
  )

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `File extension is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`,
    }
  }

  // Check for dangerous file names
  const dangerousPatterns = [
    /\.\./, // Path traversal
    /[<>:"|?*]/, // Invalid filename characters
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Reserved Windows names
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(fileName)) {
      return {
        valid: false,
        error: 'Invalid file name',
      }
    }
  }

  return { valid: true }
}

/**
 * Sanitize URL to prevent XSS and malicious redirects
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return ''
  }

  const trimmed = url.trim()

  // Only allow http, https, and relative URLs
  if (!/^(https?:\/\/|\/|#)/.test(trimmed)) {
    return ''
  }

  // Remove javascript: and data: protocols
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return ''
  }

  return trimmed
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return ''
  }

  const trimmed = email.trim().toLowerCase()

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return ''
  }

  // Remove dangerous characters
  return trimmed.replace(/[<>'"`]/g, '')
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  options: {
    sanitizeStrings?: boolean
    sanitizeUrls?: boolean
    sanitizeEmails?: boolean
  } = {}
): T {
  const { sanitizeStrings = true, sanitizeUrls = false, sanitizeEmails = false } = options

  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, options)) as unknown as T
  }

  const sanitized = { ...obj }

  for (const key in sanitized) {
    const value = sanitized[key]

    if (typeof value === 'string') {
      if (sanitizeEmails && key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value) as T[Extract<keyof T, string>]
      } else if (sanitizeUrls && (key.toLowerCase().includes('url') || key.toLowerCase().includes('link'))) {
        sanitized[key] = sanitizeUrl(value) as T[Extract<keyof T, string>]
      } else if (sanitizeStrings) {
        sanitized[key] = sanitizeText(value) as T[Extract<keyof T, string>]
      }
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, options) as T[Extract<keyof T, string>]
    }
  }

  return sanitized
}

