'use client'

import { Calendar, Eye, Clock, ArrowLeft, Share2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { useEffect } from 'react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  category: string | null
  tags: string[] | null
  published_at: string | null
  reading_time: number | null
  views: number
  seo_title: string | null
  seo_description: string | null
}

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  published_at: string | null
}

interface BlogPostContentProps {
  post: BlogPost
  relatedPosts: RelatedPost[]
}

export default function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0)
  }, [])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || '',
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Blog</span>
      </Link>

      {/* Header */}
      <header className="mb-8">
        {post.category && (
          <Badge variant="outline" className="mb-4">
            {post.category}
          </Badge>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
        {post.excerpt && (
          <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          {post.published_at && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(post.published_at), 'MMMM d, yyyy')}</span>
            </div>
          )}
          {post.reading_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.reading_time} min read</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{post.views || 0} views</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="ml-auto"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-lg prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:border prose-pre:border-border">
        <ReactMarkdown
          components={{
            // Custom styling for code blocks
            code: ({ node, inline, className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto border border-border">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              )
            },
            // Custom styling for headings
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>
            ),
            // Custom styling for links
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-primary hover:underline font-medium"
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {children}
              </a>
            ),
            // Custom styling for images
            img: ({ src, alt }) => (
              <img
                src={src || ''}
                alt={alt || ''}
                className="rounded-lg my-6 w-full"
              />
            ),
            // Custom styling for blockquotes
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                {children}
              </blockquote>
            ),
            // Custom styling for lists
            ul: ({ children }) => (
              <ul className="list-disc list-inside my-4 space-y-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside my-4 space-y-2">{children}</ol>
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className="group glass rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {relatedPost.featured_image && (
                  <div className="relative w-full h-32 overflow-hidden">
                    <img
                      src={relatedPost.featured_image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  {relatedPost.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

