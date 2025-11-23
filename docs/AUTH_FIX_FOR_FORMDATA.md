# Authorization Fix for FormData Requests

## Problem
When making FormData requests (file uploads) to Next.js API routes, cookies are not reliably sent or read. This causes authentication to fail with 401 errors.

## Solution
Use the `Authorization` header with the Supabase session access token instead of relying on cookies.

## Implementation Pattern

### Client-Side (React Component)
```typescript
import { supabase } from '@/lib/supabase/client'

// Get session token
const { data: { session } } = await supabase.auth.getSession()

if (!session) {
  // Handle no session
  return
}

// Include Authorization header in fetch request
const response = await fetch('/api/admin/endpoint', {
  method: 'POST',
  body: formData, // or JSON
  credentials: 'include',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
  },
})
```

### Server-Side (API Route)
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  // Try Authorization header first (most reliable for FormData)
  const authHeader = request.headers.get('authorization')
  let userId: string | null = null
  
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
    
    const { data: userData } = await tempClient.auth.getUser()
    if (userData?.user) {
      userId = userData.user.id
    }
  }
  
  // Fallback to cookies if Authorization header not present
  if (!userId) {
    // Try cookies() or createServerClient()...
  }
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Continue with authenticated request...
}
```

## When to Use This Pattern

1. **FormData requests** (file uploads) - Always use Authorization header
2. **API routes that fail with cookie-based auth** - Use as fallback
3. **Client-side fetch requests in admin pages** - More reliable than cookies

## Files Using This Pattern

- `app/api/admin/music/upload/route.ts` - File upload endpoint
- `components/admin/music-upload-manager.tsx` - Upload and list songs
- `app/api/admin/music/songs/route.ts` - Songs list endpoint (should use this)

## Notes

- The Authorization header approach is more reliable than cookies for:
  - FormData requests
  - Cross-origin requests
  - Mobile apps
  - Some browser configurations

- Always include `credentials: 'include'` as a fallback for cookie-based auth

- The access token from Supabase is a JWT that can be validated directly

