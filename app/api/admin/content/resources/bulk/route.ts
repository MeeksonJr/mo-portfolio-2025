import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ids, action, value } = await request.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No items selected' }, { status: 400 })
    }

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    switch (action) {
      case 'delete':
        const { error: deleteError } = await adminClient
          .from('resources')
          .delete()
          .in('id', ids)

        if (deleteError) {
          return NextResponse.json({ error: deleteError.message }, { status: 500 })
        }
        return NextResponse.json({ success: true, deleted: ids.length })

      case 'update_status':
        if (!value || !['draft', 'published', 'scheduled'].includes(value)) {
          return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
        }

        const { error: updateError } = await adminClient
          .from('resources')
          .update({ status: value, updated_at: new Date().toISOString() })
          .in('id', ids)

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 500 })
        }
        return NextResponse.json({ success: true, updated: ids.length })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Error in bulk operation:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to perform bulk operation' },
      { status: 500 }
    )
  }
}

