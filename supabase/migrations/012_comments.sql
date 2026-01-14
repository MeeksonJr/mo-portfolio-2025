-- Comments System
-- Allows users to comment on blog posts, case studies, projects, and resources
-- Supports threaded comments (replies)

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('blog_post', 'case_study', 'project', 'resource')),
  content_id UUID NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For threaded replies
  author_name TEXT NOT NULL,
  author_email TEXT, -- Optional, for moderation and notifications
  author_website TEXT, -- Optional website URL
  content TEXT NOT NULL, -- Markdown supported
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  ip_address TEXT, -- For spam prevention
  user_agent TEXT, -- For spam prevention
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL -- Optional, if user is logged in
);

-- Comment Reactions Table
CREATE TABLE IF NOT EXISTS comment_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'helpful', 'love', 'insightful')),
  ip_address TEXT, -- For preventing duplicate reactions
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional, if user is logged in
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- Note: Unique constraint will be added after column checks
);

-- Add missing columns if table already exists (for existing tables)
DO $$ 
BEGIN
  -- Add parent_id if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE comments 
    ADD COLUMN parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;
  END IF;

  -- Add author_name if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'author_name'
  ) THEN
    ALTER TABLE comments 
    ADD COLUMN author_name TEXT NOT NULL DEFAULT 'Anonymous';
  END IF;

  -- Add author_email if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'author_email'
  ) THEN
    ALTER TABLE comments 
    ADD COLUMN author_email TEXT;
  END IF;

  -- Add author_website if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'author_website'
  ) THEN
    ALTER TABLE comments 
    ADD COLUMN author_website TEXT;
  END IF;

  -- Add status if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'status'
  ) THEN
    ALTER TABLE comments 
    ADD COLUMN status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam'));
  END IF;

  -- Add ip_address if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE comments 
    ADD COLUMN ip_address TEXT;
  END IF;

  -- Add user_agent if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'user_agent'
  ) THEN
    ALTER TABLE comments 
    ADD COLUMN user_agent TEXT;
  END IF;

  -- Add approved_by if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'approved_by'
  ) THEN
    ALTER TABLE comments 
    ADD COLUMN approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  -- Add approved_at if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'approved_at'
  ) THEN
    ALTER TABLE comments 
    ADD COLUMN approved_at TIMESTAMPTZ;
  END IF;

  -- Add user_id if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE comments 
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  -- Add missing columns to comment_reactions table if it exists
  -- Add ip_address if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comment_reactions' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE comment_reactions 
    ADD COLUMN ip_address TEXT;
  END IF;

  -- Add user_id if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comment_reactions' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE comment_reactions 
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  -- Add created_at if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comment_reactions' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE comment_reactions 
    ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;

  -- Add unique constraint if it doesn't exist and all required columns exist
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comment_reactions' AND column_name = 'comment_id'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comment_reactions' AND column_name = 'ip_address'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comment_reactions' AND column_name = 'reaction_type'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'comment_reactions_comment_id_ip_address_reaction_type_key'
  ) THEN
    ALTER TABLE comment_reactions 
    ADD CONSTRAINT comment_reactions_comment_id_ip_address_reaction_type_key 
    UNIQUE(comment_id, ip_address, reaction_type);
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_content ON comments(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment_id ON comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_type ON comment_reactions(reaction_type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comments_updated_at();

-- RLS Policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Everyone can view approved comments" ON comments;
DROP POLICY IF EXISTS "Everyone can submit comments" ON comments;
DROP POLICY IF EXISTS "Users can edit their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;
DROP POLICY IF EXISTS "Admins can view all comments" ON comments;
DROP POLICY IF EXISTS "Admins can update comments" ON comments;
DROP POLICY IF EXISTS "Admins can delete comments" ON comments;
DROP POLICY IF EXISTS "Everyone can view reactions" ON comment_reactions;
DROP POLICY IF EXISTS "Everyone can add reactions" ON comment_reactions;
DROP POLICY IF EXISTS "Users can delete their own reactions" ON comment_reactions;

-- Policy: Everyone can view approved comments
CREATE POLICY "Everyone can view approved comments"
  ON comments
  FOR SELECT
  TO public
  USING (status = 'approved');

-- Policy: Everyone can submit comments (they start as pending)
CREATE POLICY "Everyone can submit comments"
  ON comments
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Users can edit their own comments (if logged in)
CREATE POLICY "Users can edit their own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can delete their own comments (if logged in)
CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: Admins can view all comments
CREATE POLICY "Admins can view all comments"
  ON comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Policy: Admins can update comments
CREATE POLICY "Admins can update comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Policy: Admins can delete comments
CREATE POLICY "Admins can delete comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Policy: Everyone can view reactions on approved comments
CREATE POLICY "Everyone can view reactions"
  ON comment_reactions
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM comments
      WHERE comments.id = comment_reactions.comment_id
      AND comments.status = 'approved'
    )
  );

-- Policy: Everyone can add reactions to approved comments
CREATE POLICY "Everyone can add reactions"
  ON comment_reactions
  FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM comments
      WHERE comments.id = comment_reactions.comment_id
      AND comments.status = 'approved'
    )
  );

-- Policy: Users can delete their own reactions (by IP or user_id)
CREATE POLICY "Users can delete their own reactions"
  ON comment_reactions
  FOR DELETE
  TO public
  USING (
    ip_address = (
      SELECT ip_address FROM comment_reactions cr
      WHERE cr.id = comment_reactions.id
    )
    OR (
      auth.uid() IS NOT NULL
      AND user_id = auth.uid()
    )
  );

