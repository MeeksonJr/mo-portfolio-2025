import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Public API to fetch page content (with fallback support)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageKey = searchParams.get('page_key')
    const sectionKey = searchParams.get('section_key')

    if (!pageKey || !sectionKey) {
      return NextResponse.json(
        { error: 'page_key and section_key are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Try to fetch from database
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_key', pageKey)
      .eq('section_key', sectionKey)
      .eq('is_active', true)
      .order('version', { ascending: false })
      .limit(1)
      .single()

    // If database fails or no content found, return null (frontend will use fallback)
    if (error || !data) {
      return NextResponse.json({ data: null, fallback: true })
    }

    return NextResponse.json({ data, fallback: false })
  } catch (error) {
    console.error('Error in GET /api/pages/content:', error)
    // Return null on error - frontend will use fallback
    return NextResponse.json({ data: null, fallback: true })
  }
}

