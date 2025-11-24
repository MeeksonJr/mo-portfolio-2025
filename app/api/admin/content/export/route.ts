import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get('type') // blog, case-study, project, resource
    const format = searchParams.get('format') || 'json' // json or csv
    const status = searchParams.get('status') // all, draft, published, etc.

    if (!contentType) {
      return NextResponse.json({ error: 'Content type is required' }, { status: 400 })
    }

    const adminClient = createAdminClient()
    let query = adminClient.from(getTableName(contentType)).select('*')

    // Apply status filter if provided
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (format === 'csv') {
      const csv = convertToCSV(data || [], contentType)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${contentType}-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    } else {
      return NextResponse.json(
        {
          type: contentType,
          exported_at: new Date().toISOString(),
          count: data?.length || 0,
          data: data || [],
        },
        {
          headers: {
            'Content-Disposition': `attachment; filename="${contentType}-export-${new Date().toISOString().split('T')[0]}.json"`,
          },
        }
      )
    }
  } catch (error: any) {
    console.error('Error exporting content:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to export content' },
      { status: 500 }
    )
  }
}

function getTableName(contentType: string): string {
  const tableMap: Record<string, string> = {
    blog: 'blog_posts',
    'case-study': 'case_studies',
    project: 'projects',
    resource: 'resources',
  }
  return tableMap[contentType] || contentType
}

function convertToCSV(data: any[], contentType: string): string {
  if (!data || data.length === 0) {
    return ''
  }

  // Get all unique keys from all objects
  const allKeys = new Set<string>()
  data.forEach((item) => {
    Object.keys(item).forEach((key) => allKeys.add(key))
  })

  const headers = Array.from(allKeys)

  // Create CSV header
  const csvRows = [headers.map((h) => escapeCSV(h)).join(',')]

  // Create CSV rows
  data.forEach((item) => {
    const row = headers.map((header) => {
      const value = item[header]
      if (value === null || value === undefined) {
        return ''
      }
      // Handle arrays and objects
      if (Array.isArray(value)) {
        return escapeCSV(value.join('; '))
      }
      if (typeof value === 'object') {
        return escapeCSV(JSON.stringify(value))
      }
      return escapeCSV(String(value))
    })
    csvRows.push(row.join(','))
  })

  return csvRows.join('\n')
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

