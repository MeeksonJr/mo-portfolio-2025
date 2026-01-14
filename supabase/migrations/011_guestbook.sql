-- Guestbook System
-- Allows visitors to leave messages that can be moderated by admins

-- Guestbook Table
CREATE TABLE IF NOT EXISTS guestbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT, -- Optional, for moderation contact
  message TEXT NOT NULL,
  website_url TEXT, -- Optional website URL
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  ip_address TEXT, -- For spam prevention
  user_agent TEXT, -- For spam prevention
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ
);

-- Guestbook Reactions Table
CREATE TABLE IF NOT EXISTS guestbook_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guestbook_id UUID NOT NULL REFERENCES guestbook(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'heart', 'smile')),
  ip_address TEXT, -- For preventing duplicate reactions
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional, if user is logged in
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(guestbook_id, ip_address, reaction_type) -- Prevent duplicate reactions from same IP
);

-- Add missing columns if table already exists (for existing tables)
DO $$ 
BEGIN
  -- Add guestbook_id if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'guestbook_reactions' AND column_name = 'guestbook_id'
  ) THEN
    -- First add as nullable
    ALTER TABLE guestbook_reactions 
    ADD COLUMN guestbook_id UUID REFERENCES guestbook(id) ON DELETE CASCADE;
    
    -- If table is empty, we can make it NOT NULL, otherwise leave it nullable
    -- (We'll handle NOT NULL constraint in a separate step if needed)
  END IF;

  -- Add reaction_type if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'guestbook_reactions' AND column_name = 'reaction_type'
  ) THEN
    ALTER TABLE guestbook_reactions 
    ADD COLUMN reaction_type TEXT CHECK (reaction_type IN ('like', 'heart', 'smile'));
  END IF;

  -- Add ip_address if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'guestbook_reactions' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE guestbook_reactions 
    ADD COLUMN ip_address TEXT;
  END IF;

  -- Add user_id if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'guestbook_reactions' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE guestbook_reactions 
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  -- Add created_at if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'guestbook_reactions' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE guestbook_reactions 
    ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;

  -- Add unique constraint if it doesn't exist and all required columns exist
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'guestbook_reactions' AND column_name = 'guestbook_id'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'guestbook_reactions' AND column_name = 'ip_address'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'guestbook_reactions' AND column_name = 'reaction_type'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'guestbook_reactions_guestbook_id_ip_address_reaction_type_key'
  ) THEN
    ALTER TABLE guestbook_reactions 
    ADD CONSTRAINT guestbook_reactions_guestbook_id_ip_address_reaction_type_key 
    UNIQUE(guestbook_id, ip_address, reaction_type);
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_guestbook_status ON guestbook(status);
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guestbook_email ON guestbook(email);
CREATE INDEX IF NOT EXISTS idx_guestbook_reactions_guestbook_id ON guestbook_reactions(guestbook_id);
CREATE INDEX IF NOT EXISTS idx_guestbook_reactions_type ON guestbook_reactions(reaction_type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_guestbook_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_guestbook_updated_at
  BEFORE UPDATE ON guestbook
  FOR EACH ROW
  EXECUTE FUNCTION update_guestbook_updated_at();

-- RLS Policies
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook_reactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Everyone can view approved guestbook entries" ON guestbook;
DROP POLICY IF EXISTS "Everyone can submit guestbook entries" ON guestbook;
DROP POLICY IF EXISTS "Admins can view all guestbook entries" ON guestbook;
DROP POLICY IF EXISTS "Admins can update guestbook entries" ON guestbook;
DROP POLICY IF EXISTS "Admins can delete guestbook entries" ON guestbook;
DROP POLICY IF EXISTS "Everyone can view reactions" ON guestbook_reactions;
DROP POLICY IF EXISTS "Everyone can add reactions" ON guestbook_reactions;
DROP POLICY IF EXISTS "Users can delete their own reactions" ON guestbook_reactions;

-- Policy: Everyone can view approved guestbook entries
CREATE POLICY "Everyone can view approved guestbook entries"
  ON guestbook
  FOR SELECT
  TO public
  USING (status = 'approved');

-- Policy: Everyone can insert guestbook entries (they start as pending)
CREATE POLICY "Everyone can submit guestbook entries"
  ON guestbook
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Admins can view all guestbook entries
CREATE POLICY "Admins can view all guestbook entries"
  ON guestbook
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Policy: Admins can update guestbook entries
CREATE POLICY "Admins can update guestbook entries"
  ON guestbook
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

-- Policy: Admins can delete guestbook entries
CREATE POLICY "Admins can delete guestbook entries"
  ON guestbook
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Policy: Everyone can view reactions on approved entries
CREATE POLICY "Everyone can view reactions"
  ON guestbook_reactions
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM guestbook
      WHERE guestbook.id = guestbook_reactions.guestbook_id
      AND guestbook.status = 'approved'
    )
  );

-- Policy: Everyone can add reactions to approved entries
CREATE POLICY "Everyone can add reactions"
  ON guestbook_reactions
  FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM guestbook
      WHERE guestbook.id = guestbook_reactions.guestbook_id
      AND guestbook.status = 'approved'
    )
  );

-- Policy: Users can delete their own reactions (by IP or user_id)
CREATE POLICY "Users can delete their own reactions"
  ON guestbook_reactions
  FOR DELETE
  TO public
  USING (
    ip_address = (
      SELECT ip_address FROM guestbook_reactions gr
      WHERE gr.id = guestbook_reactions.id
    )
    OR (
      auth.uid() IS NOT NULL
      AND user_id = auth.uid()
    )
  );

