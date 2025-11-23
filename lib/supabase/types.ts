export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image: string | null
          category: string | null
          tags: string[]
          status: 'draft' | 'published' | 'scheduled'
          published_at: string | null
          created_at: string
          updated_at: string
          views: number
          reading_time: number | null
          seo_title: string | null
          seo_description: string | null
          og_image: string | null
          github_repo_id: number | null
          author_id: string | null
        }
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at'>>
      }
      case_studies: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          content: string
          featured_image: string | null
          github_repo_id: number | null
          tech_stack: string[]
          status: 'draft' | 'published' | 'scheduled'
          published_at: string | null
          created_at: string
          updated_at: string
          views: number
          problem_statement: string | null
          solution_overview: string | null
          challenges: string[]
          results: string | null
          lessons_learned: string[]
        }
        Insert: Omit<Database['public']['Tables']['case_studies']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Database['public']['Tables']['case_studies']['Row'], 'id' | 'created_at'>>
      }
      resources: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          url: string | null
          type: 'tool' | 'course' | 'book' | 'article' | 'video' | 'other'
          category: string | null
          tags: string[]
          featured_image: string | null
          status: 'draft' | 'published' | 'scheduled'
          published_at: string | null
          created_at: string
          updated_at: string
          views: number
        }
        Insert: Omit<Database['public']['Tables']['resources']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Database['public']['Tables']['resources']['Row'], 'id' | 'created_at'>>
      }
      projects: {
        Row: {
          id: string
          github_repo_id: number
          name: string
          description: string | null
          featured_image: string | null
          tech_stack: string[]
          homepage_url: string | null
          github_url: string
          is_featured: boolean
          display_order: number
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
          views: number
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at'>>
      }
      github_repos_cache: {
        Row: {
          id: number
          name: string
          full_name: string
          description: string | null
          html_url: string
          homepage: string | null
          language: string | null
          languages: Record<string, number> | null
          topics: string[]
          stars: number
          forks: number
          watchers: number
          open_issues: number
          is_private: boolean
          is_fork: boolean
          is_archived: boolean
          default_branch: string | null
          license: string | null
          created_at: string | null
          updated_at: string | null
          pushed_at: string | null
          last_synced_at: string
          readme_content: string | null
          content_created: boolean
        }
        Insert: Omit<Database['public']['Tables']['github_repos_cache']['Row'], 'last_synced_at'>
        Update: Partial<Database['public']['Tables']['github_repos_cache']['Row']>
      }
      analytics: {
        Row: {
          id: string
          content_type: 'blog_post' | 'case_study' | 'resource' | 'project' | null
          content_id: string | null
          event_type: string
          metadata: Record<string, any>
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['analytics']['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Database['public']['Tables']['analytics']['Row'], 'id' | 'created_at'>>
      }
      ai_generations: {
        Row: {
          id: string
          type: string
          model: string
          prompt: string | null
          result: string | null
          metadata: Record<string, any>
          tokens_used: number | null
          cost: number | null
          created_at: string
          user_id: string | null
        }
        Insert: Omit<Database['public']['Tables']['ai_generations']['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Database['public']['Tables']['ai_generations']['Row'], 'id' | 'created_at'>>
      }
      settings: {
        Row: {
          key: string
          value: Record<string, any>
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'updated_at'>
        Update: Partial<Database['public']['Tables']['settings']['Row']>
      }
    }
  }
}

