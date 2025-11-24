import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const adminClient = createAdminClient()
    
    // Fetch published blog posts
    const { data: posts, error } = await adminClient
      .from('blog_posts')
      .select('title, slug, excerpt, published_at, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching posts for RSS:', error)
      return new NextResponse('Error generating RSS feed', { status: 500 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
    const currentDate = new Date().toUTCString()

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Mohamed Datt - Blog</title>
    <link>${siteUrl}</link>
    <description>Creative Full Stack Developer specializing in AI-powered web applications, Next.js, TypeScript, and modern web technologies.</description>
    <language>en-US</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${siteUrl}/feed" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/og-image.png</url>
      <title>Mohamed Datt - Blog</title>
      <link>${siteUrl}</link>
    </image>
    ${posts?.map((post) => {
      const postDate = post.published_at 
        ? new Date(post.published_at).toUTCString()
        : new Date().toUTCString()
      const postUrl = `${siteUrl}/blog/${post.slug}`
      const description = post.excerpt || 'Read more on Mohamed Datt\'s blog'
      
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${postDate}</pubDate>
      <content:encoded><![CDATA[${description}]]></content:encoded>
    </item>`
    }).join('') || ''}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}

