-- Testimonials System
-- This migration creates tables for managing client testimonials and reviews

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  client_avatar_url TEXT,
  client_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  testimonial_text TEXT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  project_name TEXT, -- Denormalized for easier filtering
  testimonial_type TEXT DEFAULT 'client' CHECK (testimonial_type IN ('client', 'colleague', 'mentor', 'student')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  video_url TEXT, -- Optional video testimonial
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  metadata JSONB DEFAULT '{}', -- Additional metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP
);

-- Testimonial Tags Table (for filtering)
CREATE TABLE IF NOT EXISTS testimonial_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  testimonial_id UUID REFERENCES testimonials(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(testimonial_id, tag)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_type ON testimonials(testimonial_type);
CREATE INDEX IF NOT EXISTS idx_testimonials_project_id ON testimonials(project_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);
CREATE INDEX IF NOT EXISTS idx_testimonial_tags_testimonial_id ON testimonial_tags(testimonial_id);
CREATE INDEX IF NOT EXISTS idx_testimonial_tags_tag ON testimonial_tags(tag);

-- Function to update updated_at timestamp
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

