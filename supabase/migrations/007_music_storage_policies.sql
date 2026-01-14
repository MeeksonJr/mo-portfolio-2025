-- Storage Policies for Music Bucket
-- This migration adds storage policies to allow admins to upload music files

-- Note: Storage policies are managed on the storage.objects table
-- Make sure RLS is enabled on storage.objects (it should be by default)

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Admins can upload music files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update music files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete music files" ON storage.objects;
DROP POLICY IF EXISTS "Everyone can read music files" ON storage.objects;

-- Policy: Allow authenticated admins to upload files to music bucket
CREATE POLICY "Admins can upload music files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'music' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Policy: Allow authenticated admins to update files in music bucket
CREATE POLICY "Admins can update music files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'music' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Policy: Allow authenticated admins to delete files from music bucket
CREATE POLICY "Admins can delete music files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'music' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Policy: Allow everyone to read files from music bucket (public bucket)
CREATE POLICY "Everyone can read music files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'music');

