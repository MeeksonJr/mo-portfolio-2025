import { NextResponse } from 'next/server'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'
import { createSlug, generateUniqueSlug } from '@/lib/slug-utils'

export async function POST(request: Request) {
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
    const {
      title,
      slug,
      description,
      url,
      type,
      category,
      tags,
      status,
      featured_image,
      published_at,
    } = body

    // Generate unique slug if not provided or if it already exists
    let finalSlug = slug || createSlug(title)
    
    // Check if slug exists and generate unique one
    const checkSlugExists = async (slugToCheck: string) => {
      const { data } = await adminClient
        .from('resources')
        .select('id')
        .eq('slug', slugToCheck)
        .single()
      return !!data
    }
    
    finalSlug = await generateUniqueSlug(finalSlug, checkSlugExists)

    // If status is published and published_at is not set, set it to now
    const finalStatus = status || 'draft'
    let finalPublishedAt = published_at ? new Date(published_at).toISOString() : null
    if (finalStatus === 'published' && !finalPublishedAt) {
      finalPublishedAt = new Date().toISOString()
    }

    const { data, error } = await adminClient.from('resources').insert({
      title,
      slug: finalSlug,
      description,
      url: url || null,
      type: type || 'tool',
      category,
      tags: tags || [],
      status: finalStatus,
      featured_image,
      published_at: finalPublishedAt,
    }).select().single()

    if (error) {
      console.error('Error creating resource:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    console.error('Error in resource creation:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

