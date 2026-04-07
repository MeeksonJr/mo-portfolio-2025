# Music Storage Setup Guide

## Issue
When uploading music files directly from the client, you may encounter the error:
```
Upload failed: Failed to upload file: new row violates row-level security policy
```

This happens because the `music` storage bucket has no policies configured, blocking all uploads.

## Solution

### Step 1: Run the Storage Policies Migration

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `supabase/migrations/007_music_storage_policies.sql`
3. Click **"Run"**

This will create the following storage policies:
- **Admins can upload music files** - Allows authenticated admins to upload
- **Admins can update music files** - Allows authenticated admins to update
- **Admins can delete music files** - Allows authenticated admins to delete
- **Everyone can read music files** - Allows public read access (for playback)

### Step 2: Verify the Bucket is Public

1. Go to **Supabase Dashboard** → **Storage** → **Buckets**
2. Find the `music` bucket
3. Make sure it's set to **Public**
4. If not, click on the bucket → **Settings** → Toggle **Public bucket** to ON

### Step 3: Test Upload

1. Go to `/admin/music`
2. Try uploading a music file
3. It should now work without RLS errors

## How It Works

The storage policies check if the authenticated user has an `admin` role in the `user_roles` table. This ensures only admins can upload, update, or delete music files, while everyone can read them for playback.

## Troubleshooting

If you still get RLS errors after running the migration:

1. **Check your user role**: Make sure your user has `admin` role in the `user_roles` table
2. **Verify policies exist**: Go to **Storage** → **Policies** → Check that the policies are listed
3. **Check bucket settings**: Ensure the `music` bucket is set to **Public**
4. **Clear browser cache**: Sometimes cached auth tokens can cause issues

