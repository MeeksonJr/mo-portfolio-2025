-- Page Content Management System
-- This migration creates tables for managing page content and images across the site

-- Page Content Table
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT NOT NULL, -- 'timeline', 'about', 'work', 'services', etc.
  section_key TEXT NOT NULL, -- 'hero', 'bio', 'milestone-1', etc.
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'html', 'mdx', 'json')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- Additional metadata (order, visibility, etc.)
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(page_key, section_key, version)
);

-- Page Images Table
CREATE TABLE IF NOT EXISTS page_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT NOT NULL,
  section_key TEXT NOT NULL,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}', -- width, height, file_size, etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Content Versions Table (for version history)
CREATE TABLE IF NOT EXISTS content_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_content_id UUID REFERENCES page_content(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  version INTEGER NOT NULL,
  change_note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Image Versions Table (for old image storage)
CREATE TABLE IF NOT EXISTS image_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_image_id UUID REFERENCES page_images(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  version INTEGER NOT NULL,
  replaced_at TIMESTAMP DEFAULT NOW(),
  replaced_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_content_page_key ON page_content(page_key);
CREATE INDEX IF NOT EXISTS idx_page_content_section_key ON page_content(section_key);
CREATE INDEX IF NOT EXISTS idx_page_content_active ON page_content(is_active);
CREATE INDEX IF NOT EXISTS idx_page_images_page_key ON page_images(page_key);
CREATE INDEX IF NOT EXISTS idx_page_images_section_key ON page_images(section_key);
CREATE INDEX IF NOT EXISTS idx_page_images_active ON page_images(is_active);
CREATE INDEX IF NOT EXISTS idx_content_versions_page_content_id ON content_versions(page_content_id);
CREATE INDEX IF NOT EXISTS idx_image_versions_page_image_id ON image_versions(page_image_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON page_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_images_updated_at BEFORE UPDATE ON page_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

