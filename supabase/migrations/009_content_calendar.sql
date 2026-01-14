-- Content Calendar System
-- Manages content planning, scheduling, and tracking

CREATE TABLE IF NOT EXISTS content_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('blog_post', 'project', 'case_study', 'newsletter', 'social_media', 'other')),
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'review', 'scheduled', 'published', 'cancelled')),
  scheduled_date TIMESTAMPTZ,
  published_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  description TEXT,
  tags TEXT[],
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content_id UUID, -- References the actual content (blog_post, project, etc.)
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_calendar_type ON content_calendar(content_type);
CREATE INDEX IF NOT EXISTS idx_content_calendar_status ON content_calendar(status);
CREATE INDEX IF NOT EXISTS idx_content_calendar_scheduled_date ON content_calendar(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_content_calendar_due_date ON content_calendar(due_date);
CREATE INDEX IF NOT EXISTS idx_content_calendar_priority ON content_calendar(priority);
CREATE INDEX IF NOT EXISTS idx_content_calendar_created_at ON content_calendar(created_at);

-- Content Series Planning
CREATE TABLE IF NOT EXISTS content_series_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_name TEXT NOT NULL,
  series_slug TEXT NOT NULL UNIQUE,
  description TEXT,
  total_posts INTEGER DEFAULT 0,
  published_posts INTEGER DEFAULT 0,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'paused')),
  start_date TIMESTAMPTZ,
  target_completion_date TIMESTAMPTZ,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Series Posts Planning
CREATE TABLE IF NOT EXISTS content_series_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID REFERENCES content_series_plans(id) ON DELETE CASCADE,
  post_title TEXT NOT NULL,
  post_slug TEXT,
  order_number INTEGER NOT NULL,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'draft', 'review', 'published')),
  scheduled_date TIMESTAMPTZ,
  published_date TIMESTAMPTZ,
  content_id UUID, -- References actual blog_post when published
  outline TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_series_plans_slug ON content_series_plans(series_slug);
CREATE INDEX IF NOT EXISTS idx_content_series_plans_status ON content_series_plans(status);
CREATE INDEX IF NOT EXISTS idx_content_series_posts_series_id ON content_series_posts(series_id);
CREATE INDEX IF NOT EXISTS idx_content_series_posts_order ON content_series_posts(series_id, order_number);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_content_calendar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_content_calendar_updated_at
  BEFORE UPDATE ON content_calendar
  FOR EACH ROW
  EXECUTE FUNCTION update_content_calendar_updated_at();

CREATE TRIGGER update_content_series_plans_updated_at
  BEFORE UPDATE ON content_series_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_content_calendar_updated_at();

CREATE TRIGGER update_content_series_posts_updated_at
  BEFORE UPDATE ON content_series_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_content_calendar_updated_at();

