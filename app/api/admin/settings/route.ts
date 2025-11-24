import { NextResponse } from 'next/server'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = await isAdminUser(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('settings')
      .select('key, value')

    if (error) {
      console.error('Error fetching settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ settings: data || [] })
  } catch (error: any) {
    console.error('Error in settings GET:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = await isAdminUser(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const adminClient = createAdminClient()
    const body = await request.json()
    const { settings } = body

    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json(
        { error: 'Settings array is required' },
        { status: 400 }
      )
    }

    // Upsert each setting
    const results = []
    for (const setting of settings) {
      const { key, value } = setting

      if (!key) {
        continue // Skip invalid settings
      }

      // Convert value to JSONB format
      let jsonbValue: any = value
      if (typeof value === 'string') {
        try {
          jsonbValue = JSON.parse(value)
        } catch {
          // If it's not valid JSON, treat as string
          jsonbValue = value
        }
      }

      const { data, error } = await adminClient
        .from('settings')
        .upsert(
          {
            key,
            value: jsonbValue,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'key',
          }
        )
        .select()
        .single()

      if (error) {
        console.error(`Error upserting setting ${key}:`, error)
        results.push({ key, error: error.message })
      } else {
        results.push({ key, success: true, data })
      }
    }

    // Check if any failed
    const failures = results.filter((r) => r.error)
    if (failures.length > 0) {
      return NextResponse.json(
        { error: 'Some settings failed to save', failures },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    console.error('Error in settings PUT:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

