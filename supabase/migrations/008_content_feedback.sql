-- Content Feedback System
-- Allows users to provide feedback on content (blog posts, case studies, projects, resources)

CREATE TABLE IF NOT EXISTS content_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('blog_post', 'case_study', 'project', 'resource')),
  helpful BOOLEAN, -- true = helpful, false = not helpful, null = no response
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_feedback_content ON content_feedback(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_content_feedback_helpful ON content_feedback(helpful);
CREATE INDEX IF NOT EXISTS idx_content_feedback_rating ON content_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_content_feedback_created_at ON content_feedback(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_content_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_content_feedback_updated_at
  BEFORE UPDATE ON content_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_content_feedback_updated_at();

