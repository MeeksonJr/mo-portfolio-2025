-- Verification Query: Check if storage policies exist
-- Run this to verify the music storage policies were created

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
  AND policyname LIKE '%music%'
ORDER BY policyname;

-- Expected output: Should show 4 policies:
-- 1. "Admins can delete music files"
-- 2. "Admins can update music files"
-- 3. "Admins can upload music files"
-- 4. "Everyone can read music files"

