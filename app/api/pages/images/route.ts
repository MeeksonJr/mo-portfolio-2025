import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Public API to fetch page images (with fallback support)
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
      .from('page_images')
      .select('*')
      .eq('page_key', pageKey)
      .eq('section_key', sectionKey)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    // If database fails, return empty array (frontend will use fallback)
    if (error) {
      return NextResponse.json({ data: [], fallback: true })
    }

    return NextResponse.json({ data: data || [], fallback: false })
  } catch (error) {
    console.error('Error in GET /api/pages/images:', error)
    // Return empty array on error - frontend will use fallback
    return NextResponse.json({ data: [], fallback: true })
  }
}

