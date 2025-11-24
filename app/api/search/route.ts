import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all' // all, blog, project, case-study, resource

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const supabase = await createServerClient()
    const results: any[] = []

    // Search blog posts
    if (type === 'all' || type === 'blog') {
      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('id, title, excerpt, slug, category, tags, published_at')
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,tags.cs.{${query}}`)

      if (blogPosts) {
        blogPosts.forEach(post => {
          results.push({
            id: `blog-${post.id}`,
            type: 'blog',
            title: post.title,
            description: post.excerpt,
            url: `/blog/${post.slug}`,
            category: post.category,
            tags: post.tags,
            date: post.published_at,
          })
        })
      }
    }

    // Search projects
    if (type === 'all' || type === 'project') {
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name, description, slug, tech_stack, created_at')
        .eq('status', 'published')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,tech_stack.cs.{${query}}`)

      if (projects) {
        projects.forEach(project => {
          const slug = project.slug || project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          results.push({
            id: `project-${project.id}`,
            type: 'project',
            title: project.name,
            description: project.description,
            url: `/projects/${slug}`,
            tags: project.tech_stack,
            date: project.created_at,
          })
        })
      }
    }

    // Search case studies
    if (type === 'all' || type === 'case-study') {
      const { data: caseStudies } = await supabase
        .from('case_studies')
        .select('id, title, excerpt, slug, tags, published_at')
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,tags.cs.{${query}}`)

      if (caseStudies) {
        caseStudies.forEach(cs => {
          results.push({
            id: `case-study-${cs.id}`,
            type: 'case-study',
            title: cs.title,
            description: cs.excerpt,
            url: `/case-studies/${cs.slug}`,
            tags: cs.tags,
            date: cs.published_at,
          })
        })
      }
    }

    // Search resources
    if (type === 'all' || type === 'resource') {
      const { data: resources } = await supabase
        .from('resources')
        .select('id, title, description, slug, tags, created_at')
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)

      if (resources) {
        resources.forEach(resource => {
          results.push({
            id: `resource-${resource.id}`,
            type: 'resource',
            title: resource.title,
            description: resource.description,
            url: `/resources/${resource.slug}`,
            tags: resource.tags,
            date: resource.created_at,
          })
        })
      }
    }

    return NextResponse.json({ results: results.slice(0, 20) }) // Limit to 20 results
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

