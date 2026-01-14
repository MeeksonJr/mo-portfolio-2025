-- Admin Notifications Table
-- Stores persistent admin notifications that survive page refreshes

CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('success', 'error', 'info', 'warning')),
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  action_label TEXT,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  auto_dismiss BOOLEAN DEFAULT true,
  dismiss_after INTEGER, -- milliseconds
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Add missing columns if table already exists (for existing tables)
DO $$ 
BEGIN
  -- Add created_by if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'admin_notifications' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE admin_notifications 
    ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  -- Add action_label if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'admin_notifications' AND column_name = 'action_label'
  ) THEN
    ALTER TABLE admin_notifications 
    ADD COLUMN action_label TEXT;
  END IF;

  -- Add action_url if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'admin_notifications' AND column_name = 'action_url'
  ) THEN
    ALTER TABLE admin_notifications 
    ADD COLUMN action_url TEXT;
  END IF;

  -- Add metadata if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'admin_notifications' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE admin_notifications 
    ADD COLUMN metadata JSONB DEFAULT '{}';
  END IF;

  -- Add auto_dismiss if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'admin_notifications' AND column_name = 'auto_dismiss'
  ) THEN
    ALTER TABLE admin_notifications 
    ADD COLUMN auto_dismiss BOOLEAN DEFAULT true;
  END IF;

  -- Add dismiss_after if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'admin_notifications' AND column_name = 'dismiss_after'
  ) THEN
    ALTER TABLE admin_notifications 
    ADD COLUMN dismiss_after INTEGER;
  END IF;

  -- Add read_at if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'admin_notifications' AND column_name = 'read_at'
  ) THEN
    ALTER TABLE admin_notifications 
    ADD COLUMN read_at TIMESTAMPTZ;
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_notifications_user_id ON admin_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(type);

-- RLS Policies
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Admins can create notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON admin_notifications;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON admin_notifications
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = created_by);

-- Policy: Admins can create notifications for any user
CREATE POLICY "Admins can create notifications"
  ON admin_notifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Policy: Users can update their own notifications (mark as read, etc.)
CREATE POLICY "Users can update their own notifications"
  ON admin_notifications
  FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = created_by)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = created_by);

-- Policy: Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON admin_notifications
  FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = created_by);

-- Function to automatically set read_at when read is set to true
CREATE OR REPLACE FUNCTION update_admin_notification_read_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.read = true AND OLD.read = false THEN
    NEW.read_at = NOW();
  ELSIF NEW.read = false THEN
    NEW.read_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_admin_notification_read_at ON admin_notifications;

-- Trigger to update read_at
CREATE TRIGGER update_admin_notification_read_at
  BEFORE UPDATE ON admin_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_notification_read_at();

