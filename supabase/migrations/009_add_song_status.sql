-- Add status field to songs table for approval workflow
-- Similar to testimonials, songs can be pending, approved, or rejected

-- Add status column
ALTER TABLE songs 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add submitted_by fields for public submissions
ALTER TABLE songs
ADD COLUMN IF NOT EXISTS submitter_name TEXT,
ADD COLUMN IF NOT EXISTS submitter_email TEXT;

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_songs_status ON songs(status);

-- Update existing songs to be approved
UPDATE songs SET status = 'approved' WHERE status IS NULL;

-- Update RLS policy to allow public submissions
-- Drop existing insert policy
DROP POLICY IF EXISTS "Only admins can insert songs" ON songs;

-- New policy: Allow anyone to insert songs (they'll be pending)
CREATE POLICY "Anyone can submit songs"
ON songs FOR INSERT
TO public
WITH CHECK (status = 'pending');

-- Policy: Only admins can insert approved songs directly
CREATE POLICY "Admins can insert approved songs"
ON songs FOR INSERT
TO authenticated
WITH CHECK (
  is_admin(auth.uid()) AND
  (status = 'approved' OR status = 'pending')
);

-- Update the public songs API to only show approved songs
-- This is handled in the API route, but we can also add a policy
-- Policy: Only show approved songs to public
DROP POLICY IF EXISTS "Songs are viewable by everyone" ON songs;

CREATE POLICY "Approved songs are viewable by everyone"
ON songs FOR SELECT
TO public
USING (status = 'approved');

-- Admins can see all songs
CREATE POLICY "Admins can view all songs"
ON songs FOR SELECT
TO authenticated
USING (
  is_admin(auth.uid()) OR status = 'approved'
);

