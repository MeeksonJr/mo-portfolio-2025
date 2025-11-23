import { NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    // Try to get session first
    const supabase = await createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    let userId: string | null = null

    if (session && session.user) {
      userId = session.user.id
    } else {
      // Fallback: get userId from request body
      try {
        const body = await request.json()
        userId = body.userId
      } catch {
        // Request body might be empty
      }
    }

    if (!userId) {
      return NextResponse.json({ isAdmin: false, error: 'Not authenticated' }, { status: 401 })
    }

    // Use admin client to bypass RLS
    const adminClient = createAdminClient()
    const { data: userRole, error: roleError } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()

    console.log('Role check for user:', userId, 'Role:', userRole?.role, 'Error:', roleError)

    const isAdmin = !roleError && userRole && userRole.role === 'admin'

    return NextResponse.json({
      isAdmin,
      role: userRole?.role || null,
      userId,
      error: roleError?.message || null,
    })
  } catch (error: any) {
    console.error('Error checking role:', error)
    return NextResponse.json(
      { isAdmin: false, error: error.message || 'Failed to check role' },
      { status: 500 }
    )
  }
}
