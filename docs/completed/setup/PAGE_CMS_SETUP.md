# Page CMS Setup Guide

## Database Migration

The database migration has been completed successfully. The following tables are now available:
- `page_content` - Stores page content
- `page_images` - Stores image metadata
- `content_versions` - Version history for content
- `image_versions` - Archived images

## Storage Setup

### Create Storage Bucket for Page Images

1. **Go to Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Open Storage**
   - Click on "Storage" in the left sidebar
   - Click "New bucket"

3. **Create `page-images` Bucket**
   - **Name:** `page-images`
   - **Public:** Yes (for public page images)
   - **File size limit:** 10MB (or as needed)
   - **Allowed MIME types:** `image/png`, `image/jpeg`, `image/jpg`, `image/webp`, `image/gif`
   - Click "Create bucket"

## Usage

### Access the CMS

1. Navigate to `/admin/pages` in your admin dashboard
2. Select a page (Timeline, About, Work, Services, Home)
3. Select a section within that page
4. Edit content or upload images

### Managing Content

**Content Editor:**
- Choose content type: Text, HTML, or MDX
- Use AI tools to improve, shorten, lengthen, or rewrite content
- All changes are automatically versioned

**Image Management:**
- Upload images with alt text and captions
- Toggle images active/inactive
- Delete images (they're archived, not permanently deleted)
- Images are stored in Supabase Storage

### Public Pages Integration

The CMS provides public API endpoints that automatically fall back to default content if the database is unavailable:

- `/api/pages/content?page_key=timeline&section_key=milestone-1`
- `/api/pages/images?page_key=timeline&section_key=milestone-1`

Use the utility functions in `lib/cms/page-content.ts` to fetch content in your page components.

## Features

✅ **Version History** - All content changes are tracked
✅ **Image Archiving** - Deleted images are preserved in history
✅ **AI Content Improvement** - 6 different AI enhancement modes
✅ **Fallback Support** - Site works even if database is down
✅ **Multi-format Support** - Text, HTML, and MDX content types
✅ **Image Gallery** - Manage multiple images per section

## Next Steps

1. Create the `page-images` storage bucket (see above)
2. Start uploading images and editing content in `/admin/pages`
3. Integrate CMS content into your public pages using `lib/cms/page-content.ts`

