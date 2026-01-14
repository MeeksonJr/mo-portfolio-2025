-- Fix infinite recursion in music storage policies
-- The issue: Storage policies checking user_roles table causes RLS recursion
-- Solution: Use SECURITY DEFINER function to check admin role without RLS

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can upload music files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update music files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete music files" ON storage.objects;
DROP POLICY IF EXISTS "Everyone can read music files" ON storage.objects;

-- Create a SECURITY DEFINER function to check if user is admin
-- This bypasses RLS and prevents infinite recursion
CREATE OR REPLACE FUNCTION storage.is_admin_user(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = user_uuid 
    AND role = 'admin'
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION storage.is_admin_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION storage.is_admin_user(UUID) TO anon;

-- Policy: Allow authenticated admins to upload files to music bucket
CREATE POLICY "Admins can upload music files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'music' AND
  storage.is_admin_user(auth.uid())
);

-- Policy: Allow authenticated admins to update files in music bucket
CREATE POLICY "Admins can update music files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'music' AND
  storage.is_admin_user(auth.uid())
);

-- Policy: Allow authenticated admins to delete files from music bucket
CREATE POLICY "Admins can delete music files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'music' AND
  storage.is_admin_user(auth.uid())
);

-- Policy: Allow everyone to read files from music bucket (public bucket)
CREATE POLICY "Everyone can read music files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'music');

