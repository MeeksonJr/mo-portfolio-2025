-- Content Templates Table
-- This migration creates a table for storing reusable content templates

CREATE TABLE IF NOT EXISTS content_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('blog', 'case-study', 'resource', 'project')),
  template_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_templates_content_type ON content_templates(content_type);
CREATE INDEX IF NOT EXISTS idx_content_templates_created_by ON content_templates(created_by);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_content_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
CREATE TRIGGER update_content_templates_updated_at BEFORE UPDATE ON content_templates
  FOR EACH ROW EXECUTE FUNCTION update_content_templates_updated_at();

-- RLS Policies
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all templates
CREATE POLICY "Users can view templates" ON content_templates
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can create templates
CREATE POLICY "Authenticated users can create templates" ON content_templates
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Users can update their own templates
CREATE POLICY "Users can update their own templates" ON content_templates
  FOR UPDATE
  USING (auth.uid() = created_by OR auth.role() = 'service_role');

-- Policy: Users can delete their own templates
CREATE POLICY "Users can delete their own templates" ON content_templates
  FOR DELETE
  USING (auth.uid() = created_by OR auth.role() = 'service_role');

