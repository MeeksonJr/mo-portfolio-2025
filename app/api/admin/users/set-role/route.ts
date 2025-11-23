import { NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/supabase/auth-helpers'

export async function POST(request: Request) {
  try {
    // Check if requester is admin
    const supabase = await createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await isUserAdmin(session.user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get request body
    const body = await request.json()
    const { userId, role } = body

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'userId and role are required' },
        { status: 400 }
      )
    }

    if (!['admin', 'user', 'moderator'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Set user role
    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('user_roles')
      .upsert(
        {
          user_id: userId,
          role,
        },
        {
          onConflict: 'user_id',
        }
      )

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error setting user role:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to set user role' },
      { status: 500 }
    )
  }
}

