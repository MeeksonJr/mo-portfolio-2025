import { createServerClient, createAdminClient } from './server'
import { cookies, headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

/**
 * Get authenticated user in API routes
 * Tries multiple methods to get the session
 */
export async function getAuthenticatedUser(request?: Request) {
  try {
    // If request is provided, try reading cookies from request headers FIRST
    // This is important for FormData requests where Next.js cookies() might not work
    if (request) {
      const cookieHeader = request.headers.get('cookie') || ''
      
      if (cookieHeader) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
        
        // Parse cookies
        const cookies: Record<string, string> = {}
        cookieHeader.split(';').forEach((cookie) => {
          const [name, ...rest] = cookie.trim().split('=')
          if (name) {
            cookies[name] = decodeURIComponent(rest.join('='))
          }
        })
        
        // Try to find auth token
        const authCookieName = `sb-${projectRef}-auth-token`
        const authCookie = cookies[authCookieName] || cookies[`${authCookieName}.0`] || cookies[`${authCookieName}.1`]
        
        if (authCookie) {
          try {
            const parsed = typeof authCookie === 'string' ? JSON.parse(authCookie) : authCookie
            
            if (parsed?.access_token) {
              const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
                global: {
                  headers: {
                    Authorization: `Bearer ${parsed.access_token}`,
                  },
                },
              })
              const { data } = await tempClient.auth.getUser()
              if (data?.user) {
                return data.user
              }
            } else if (parsed?.user) {
              return parsed.user
            }
          } catch (e) {
            // Cookie might not be JSON, continue
          }
        }
      }
    }

    // Then try using createServerClient (works for server components)
    try {
      const supabase = await createServerClient()
      
      // Try getSession first
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData?.session?.user) {
        return sessionData.session.user
      }

      // Try getUser as fallback
      const { data: userData } = await supabase.auth.getUser()
      if (userData?.user) {
        return userData.user
      }
    } catch (error) {
    }

    // Try reading from cookies directly (from both cookies() and request headers)
    try {
      const cookieStore = await cookies()
      const headersList = await headers()
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
      
      // Get cookie header from request
      const cookieHeader = headersList.get('cookie') || ''
      const parseCookies = (cookieString: string) => {
        const cookies: Record<string, string> = {}
        cookieString.split(';').forEach((cookie) => {
          const [name, ...rest] = cookie.trim().split('=')
          if (name) {
            cookies[name] = rest.join('=')
          }
        })
        return cookies
      }
      
      const requestCookies = parseCookies(cookieHeader)
      
      // Try various cookie patterns
      const cookiePatterns = [
        `sb-${projectRef}-auth-token`,
        `sb-${projectRef}-auth-token.0`,
        `sb-${projectRef}-auth-token.1`,
      ]
      
      // Check both cookieStore and requestCookies
      const allCookies = { ...requestCookies }
      cookiePatterns.forEach((pattern) => {
        const cookieValue = cookieStore.get(pattern)?.value
        if (cookieValue) {
          allCookies[pattern] = cookieValue
        }
      })
      
      for (const pattern of cookiePatterns) {
        const authCookie = allCookies[pattern]
        if (authCookie) {
          try {
            // Decode URL-encoded cookie value
            const decoded = decodeURIComponent(authCookie)
            const parsed = JSON.parse(decoded)
            if (parsed?.user) {
              return parsed.user
            }
            // Sometimes the cookie contains access_token directly
            if (parsed?.access_token) {
              // Create a client with this token and get user
              const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
                global: {
                  headers: {
                    Authorization: `Bearer ${parsed.access_token}`,
                  },
                },
              })
              const { data } = await tempClient.auth.getUser()
              if (data?.user) {
                return data.user
              }
            }
          } catch (e) {
            // Cookie is not JSON, try as raw token
            try {
              const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
                global: {
                  headers: {
                    Authorization: `Bearer ${authCookie}`,
                  },
                },
              })
              const { data } = await tempClient.auth.getUser()
              if (data?.user) {
                return data.user
              }
            } catch {
              // Continue to next pattern
            }
          }
        }
      }
    } catch (error) {
      console.log('Cookie reading method failed:', error)
    }

    // If request is provided, try reading Authorization header
    if (request) {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })
        const { data } = await tempClient.auth.getUser()
        if (data?.user) {
          return data.user
        }
      }

    }

    return null
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return null
  }
}

/**
 * Check if user is admin
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  try {
    const adminClient = createAdminClient()
    const { data: userRole, error } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()

    return !error && userRole && userRole.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

