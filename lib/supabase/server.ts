import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Get project ref from URL for cookie names
const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''

// Server-side Supabase client with user session
export const createServerClient = async () => {
  const cookieStore = await cookies()
  
  // Supabase stores the auth token in a cookie with this pattern:
  // sb-{project-ref}-auth-token
  const authCookieName = `sb-${projectRef}-auth-token`
  
  // Get all cookies and find the auth token
  const getAllCookies = () => {
    const allCookies: Record<string, string> = {}
    cookieStore.getAll().forEach((cookie) => {
      allCookies[cookie.name] = cookie.value
    })
    return allCookies
  }
  
  const allCookies = getAllCookies()
  
  // Try to find auth token in various cookie formats
  const findAuthToken = () => {
    // Try the standard format
    if (allCookies[authCookieName]) {
      try {
        return JSON.parse(allCookies[authCookieName])
      } catch {
        return allCookies[authCookieName]
      }
    }
    
    // Try with .0, .1 suffixes (Supabase sometimes splits large cookies)
    for (let i = 0; i < 10; i++) {
      const cookieName = `${authCookieName}.${i}`
      if (allCookies[cookieName]) {
        try {
          return JSON.parse(allCookies[cookieName])
        } catch {
          return allCookies[cookieName]
        }
      }
    }
    
    // Try any cookie that starts with sb-
    for (const [name, value] of Object.entries(allCookies)) {
      if (name.startsWith('sb-') && name.includes('auth')) {
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      }
    }
    
    return null
  }
  
  const authToken = findAuthToken()
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storage: {
        getItem: (key: string) => {
          // If we found an auth token cookie, return it for access_token/refresh_token keys
          if (authToken) {
            if (typeof authToken === 'object') {
              if (key.includes('access_token')) {
                return authToken.access_token || null
              }
              if (key.includes('refresh_token')) {
                return authToken.refresh_token || null
              }
              // Return the whole token object as JSON string
              return JSON.stringify(authToken)
            }
            return authToken
          }
          
          // Fallback: try to get cookie by key
          const cookie = allCookies[key]
          if (cookie) {
            try {
              return JSON.parse(cookie)
            } catch {
              return cookie
            }
          }
          
          return null
        },
        setItem: () => {
          // Cookies are set client-side
        },
        removeItem: () => {
          // Cookies are removed client-side
        },
      },
    },
    global: {
      headers: authToken && typeof authToken === 'object' && authToken.access_token
        ? {
            Authorization: `Bearer ${authToken.access_token}`,
          }
        : {},
    },
  } as any)
}

// Server-side Supabase client with service role (admin access)
export const createAdminClient = () => {
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }
  
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  })
}
