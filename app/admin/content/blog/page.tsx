import { createAdminClient } from '@/lib/supabase/server'
import BlogPostsTable from '@/components/admin/blog-posts-table'

export default async function BlogPostsPage() {
  let blogPosts = []
  
  try {
    const adminClient = createAdminClient()

    // Fetch blog posts
    const { data, error } = await adminClient
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching blog posts:', error)
    } else {
      blogPosts = data || []
    }
  } catch (error: any) {
    console.error('Error in BlogPostsPage:', error)
    // Return page with empty posts - component will handle it
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground mt-2">
            Manage your blog posts
          </p>
        </div>
      </div>

      <BlogPostsTable initialPosts={blogPosts} />
    </div>
  )
}

