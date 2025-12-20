import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminClient = createAdminClient()
    const { data: userRole } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!userRole || userRole.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: settings, error } = await adminClient
      .from('newsletter_settings')
      .select('*')

    if (error) {
      console.error('Error fetching settings:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    // Convert to key-value object
    const settingsObj: Record<string, any> = {}
    settings?.forEach((setting) => {
      settingsObj[setting.setting_key] = setting.setting_value
    })

    return NextResponse.json({ settings: settingsObj })
  } catch (error) {
    console.error('Error in GET settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminClient = createAdminClient()
    const { data: userRole } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!userRole || userRole.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { setting_key, setting_value, description } = body

    if (!setting_key || !setting_value) {
      return NextResponse.json(
        { error: 'setting_key and setting_value are required' },
        { status: 400 }
      )
    }

    const { data: setting, error } = await adminClient
      .from('newsletter_settings')
      .upsert(
        {
          setting_key,
          setting_value,
          description: description || null,
          updated_by: session.user.id,
        },
        {
          onConflict: 'setting_key',
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Error updating setting:', error)
      return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 })
    }

    return NextResponse.json({ setting })
  } catch (error) {
    console.error('Error in PUT settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

