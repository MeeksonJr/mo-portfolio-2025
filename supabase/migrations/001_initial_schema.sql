-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- MDX content
  featured_image TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  reading_time INTEGER,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  github_repo_id INTEGER,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Case Studies Table
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  github_repo_id INTEGER,
  tech_stack TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  problem_statement TEXT,
  solution_overview TEXT,
  challenges TEXT[] DEFAULT '{}',
  results TEXT,
  lessons_learned TEXT[] DEFAULT '{}'
);

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  url TEXT,
  type TEXT CHECK (type IN ('tool', 'course', 'book', 'article', 'video', 'other')),
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  views INTEGER DEFAULT 0
);

-- Projects Table (Linked to GitHub)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_repo_id INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  featured_image TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  homepage_url TEXT,
  github_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  views INTEGER DEFAULT 0
);

-- GitHub Repos Cache Table
CREATE TABLE IF NOT EXISTS github_repos_cache (
  id INTEGER PRIMARY KEY, -- GitHub repo ID
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT,
  html_url TEXT NOT NULL,
  homepage TEXT,
  language TEXT,
  languages JSONB, -- Full language breakdown
  topics TEXT[] DEFAULT '{}',
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  watchers INTEGER DEFAULT 0,
  open_issues INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT false,
  is_fork BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  default_branch TEXT,
  license TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  pushed_at TIMESTAMP,
  last_synced_at TIMESTAMP DEFAULT NOW(),
  readme_content TEXT,
  content_created BOOLEAN DEFAULT false -- Has content been created from this repo?
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT CHECK (content_type IN ('blog_post', 'case_study', 'resource', 'project')),
  content_id UUID,
  event_type TEXT NOT NULL, -- view, click, share, etc.
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Generation Logs Table
CREATE TABLE IF NOT EXISTS ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL, -- blog_post, image, enhancement, etc.
  model TEXT NOT NULL, -- gemini, huggingface, etc.
  prompt TEXT,
  result TEXT,
  metadata JSONB DEFAULT '{}',
  tokens_used INTEGER,
  cost DECIMAL(10, 4),
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_github_repo_id ON blog_posts(github_repo_id);

CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON case_studies(status);
CREATE INDEX IF NOT EXISTS idx_case_studies_github_repo_id ON case_studies(github_repo_id);

CREATE INDEX IF NOT EXISTS idx_resources_slug ON resources(slug);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);

CREATE INDEX IF NOT EXISTS idx_projects_github_repo_id ON projects(github_repo_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects(is_featured);

CREATE INDEX IF NOT EXISTS idx_github_repos_cache_name ON github_repos_cache(name);
CREATE INDEX IF NOT EXISTS idx_github_repos_cache_content_created ON github_repos_cache(content_created);

CREATE INDEX IF NOT EXISTS idx_analytics_content ON analytics(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_generations_type ON ai_generations(type);
CREATE INDEX IF NOT EXISTS idx_ai_generations_created_at ON ai_generations(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_repos_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published blog posts" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published case studies" ON case_studies
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published resources" ON resources
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published projects" ON projects
  FOR SELECT USING (status = 'published');

-- Admin full access (using service role key bypasses RLS, but we'll add policies for admin users)
-- For now, we'll use service role for admin operations
-- Later, we can add admin role checking

-- Allow authenticated users (admins) full access
-- This will be configured after we set up admin authentication
-- For now, service role key will be used for admin operations

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('github_sync_enabled', 'true'::jsonb),
  ('github_sync_frequency', '"daily"'::jsonb),
  ('default_ai_model', '"gemini"'::jsonb),
  ('image_generation_model', '"stabilityai/stable-diffusion-xl-base-1.0"'::jsonb)
ON CONFLICT (key) DO NOTHING;

