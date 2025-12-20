import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'
// Excel export requires xlsx package - install with: npm install xlsx
// For now, Excel export is disabled. Uncomment when xlsx is installed.
// import * as XLSX from 'xlsx'

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get('type') // blog, case-study, project, resource
    const format = searchParams.get('format') || 'json' // json, csv, pdf, excel, xml
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

    const content = data || []

    switch (format.toLowerCase()) {
      case 'csv':
        return exportCSV(content, contentType)
      case 'excel':
      case 'xlsx':
        return NextResponse.json(
          { error: 'Excel export requires xlsx package. Install with: npm install xlsx' },
          { status: 501 }
        )
        // return exportExcel(content, contentType)
      case 'xml':
        return exportXML(content, contentType)
      case 'json':
      default:
        return exportJSON(content, contentType)
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

function exportJSON(data: any[], contentType: string) {
  return NextResponse.json(
    {
      type: contentType,
      exported_at: new Date().toISOString(),
      count: data.length,
      data,
    },
    {
      headers: {
        'Content-Disposition': `attachment; filename="${contentType}-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    }
  )
}

function exportCSV(data: any[], contentType: string) {
  if (!data || data.length === 0) {
    return new NextResponse('', {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${contentType}-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  }

  const allKeys = new Set<string>()
  data.forEach((item) => {
    Object.keys(item).forEach((key) => allKeys.add(key))
  })

  const headers = Array.from(allKeys)
  const csvRows = [headers.map((h) => escapeCSV(h)).join(',')]

  data.forEach((item) => {
    const row = headers.map((header) => {
      const value = item[header]
      if (value === null || value === undefined) {
        return ''
      }
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

  return new NextResponse(csvRows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${contentType}-export-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}

// Excel export function - requires xlsx package
// Uncomment when xlsx is installed
/*
function exportExcel(data: any[], contentType: string) {
  if (!data || data.length === 0) {
    return new NextResponse('', {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${contentType}-export-${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    })
  }

  // Flatten nested objects and arrays for Excel
  const flattenedData = data.map((item) => {
    const flat: any = {}
    Object.keys(item).forEach((key) => {
      const value = item[key]
      if (value === null || value === undefined) {
        flat[key] = ''
      } else if (Array.isArray(value)) {
        flat[key] = value.join('; ')
      } else if (typeof value === 'object') {
        flat[key] = JSON.stringify(value)
      } else {
        flat[key] = String(value)
      }
    })
    return flat
  })

  const worksheet = XLSX.utils.json_to_sheet(flattenedData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Content')

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${contentType}-export-${new Date().toISOString().split('T')[0]}.xlsx"`,
    },
  })
}
*/

function exportXML(data: any[], contentType: string) {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  const rootStart = `<${contentType}_export exported_at="${new Date().toISOString()}" count="${data.length}">`
  const rootEnd = `</${contentType}_export>`

  const items = data.map((item, index) => {
    const itemStart = `<item index="${index}">`
    const itemEnd = '</item>'
    const fields = Object.keys(item)
      .map((key) => {
        const value = item[key]
        if (value === null || value === undefined) {
          return `<${key}></${key}>`
        }
        if (Array.isArray(value)) {
          return `<${key}><![CDATA[${value.join('; ')}]]></${key}>`
        }
        if (typeof value === 'object') {
          return `<${key}><![CDATA[${JSON.stringify(value)}]]></${key}>`
        }
        return `<${key}><![CDATA[${String(value)}]]></${key}>`
      })
      .join('\n    ')

    return `  ${itemStart}\n    ${fields}\n  ${itemEnd}`
  })

  const xml = `${xmlHeader}\n${rootStart}\n${items.join('\n')}\n${rootEnd}`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Content-Disposition': `attachment; filename="${contentType}-export-${new Date().toISOString().split('T')[0]}.xml"`,
    },
  })
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
