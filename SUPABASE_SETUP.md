# Supabase Setup Guide

## Database Migration

To set up the database schema, you need to run the SQL migration file in your Supabase project.

### Steps:

1. **Go to Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project: `rlqwbcunfbaogoqixwwt`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration**
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Paste into the SQL editor
   - Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

4. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see these tables:
     - `blog_posts`
     - `case_studies`
     - `resources`
     - `projects`
     - `github_repos_cache`
     - `analytics`
     - `ai_generations`
     - `settings`

## Storage Setup

1. **Go to Storage**
   - Click on "Storage" in the left sidebar

2. **Create Buckets**
   - Click "New bucket"
   - Create these buckets:
     - **Name:** `blog-images`
     - **Public:** Yes (for public blog images)
     - Click "Create bucket"
   
   - Create another bucket:
     - **Name:** `generated-images`
     - **Public:** Yes (for AI-generated images)
     - Click "Create bucket"

3. **Set Bucket Policies** (Optional)
   - For now, public buckets will work
   - Later, we can add RLS policies for admin-only uploads

## Admin User Setup

1. **Go to Authentication**
   - Click on "Authentication" in the left sidebar
   - Click "Users"

2. **Create Admin User**
   - Click "Add user" → "Create new user"
   - Enter email and password
   - **Important:** Save these credentials - you'll use them to log into `/admin/login`

3. **Verify Email** (if email confirmation is enabled)
   - Check the email or disable email confirmation in Auth settings

## Environment Variables

Make sure these are in your `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://rlqwbcunfbaogoqixwwt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# GitHub
GITHUB_TOKEN=your_github_token

# AI Services
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
HUGGINGFACE_API_KEY=your_huggingface_token

# Email
RESEND_API_KEY=your_resend_key
```

## Testing

1. **Test Database Connection**
   - Start your dev server: `npm run dev`
   - Try accessing `/admin/login`
   - Log in with the admin user you created

2. **Test GitHub Sync**
   - Go to `/admin/github`
   - Click "Sync" button
   - Repositories should appear

## Troubleshooting

### Migration Errors

**Error: "permission denied to set parameter app.jwt_secret"**
- ✅ **FIXED!** This line has been removed from the migration
- Supabase handles JWT secrets automatically, so this setting is not needed
- If you still see this error, make sure you're using the updated migration file

**Other Permission Errors**
- If you get permission errors, make sure you're using the SQL Editor (not Table Editor)
- Check that the `uuid-ossp` extension is enabled (it should be by default)
- Make sure you're running the query as the project owner

### Authentication Issues
- Make sure email confirmation is disabled for testing, or verify the email
- Check that the user exists in the `auth.users` table

### GitHub Sync Issues
- Verify `GITHUB_TOKEN` is set in `.env.local`
- Check that the token has `repo` scope for private repos
- Check browser console and server logs for errors

