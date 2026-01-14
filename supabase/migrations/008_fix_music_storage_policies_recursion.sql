-- Fix infinite recursion in music storage policies
-- The issue: Storage policies checking user_roles table causes RLS recursion
-- Solution: Use the existing SECURITY DEFINER is_admin() function from public schema

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can upload music files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update music files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete music files" ON storage.objects;
DROP POLICY IF EXISTS "Everyone can read music files" ON storage.objects;

-- Use the existing is_admin() function from public schema (created in 002_user_roles.sql)
-- This function is SECURITY DEFINER and bypasses RLS, preventing infinite recursion

-- Policy: Allow authenticated admins to upload files to music bucket
CREATE POLICY "Admins can upload music files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'music' AND
  is_admin(auth.uid())
);

-- Policy: Allow authenticated admins to update files in music bucket
CREATE POLICY "Admins can update music files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'music' AND
  is_admin(auth.uid())
);

-- Policy: Allow authenticated admins to delete files from music bucket
CREATE POLICY "Admins can delete music files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'music' AND
  is_admin(auth.uid())
);

-- Policy: Allow everyone to read files from music bucket (public bucket)
CREATE POLICY "Everyone can read music files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'music');

