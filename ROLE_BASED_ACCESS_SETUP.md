# Role-Based Access Control Setup

## Overview

The system now has **role-based access control** with two types of users:

1. **Admin Users** - Full access to admin dashboard, content management, etc.
2. **Regular Users** - Can comment on blog posts, rate content, etc. (to be implemented)

## Database Migration

**IMPORTANT:** Run this migration in Supabase SQL Editor:

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `supabase/migrations/002_user_roles.sql`
3. Click "Run"

This creates:
- `user_roles` table
- Helper functions (`get_user_role`, `is_admin`)
- Auto-assigns 'user' role to new signups
- RLS policies

## Setting Up Your Admin Account

### Step 1: Create User in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email:** your admin email
   - **Password:** strong password
4. Click **"Create user"**
5. **Copy the User ID** (you'll need it in the next step)

### Step 2: Set Admin Role

**Option A: Via Supabase Dashboard (Easiest)**

1. Go to **Table Editor** → `user_roles`
2. Click **"Insert row"**
3. Enter:
   - **user_id:** (paste the User ID from Step 1)
   - **role:** `admin`
4. Click **"Save"**

**Option B: Via SQL**

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

Replace `YOUR_USER_ID_HERE` with the actual user ID from Step 1.

### Step 3: Test Login

1. Go to `/admin/login`
2. Log in with your admin credentials
3. You should be redirected to the admin dashboard!

## How It Works

### Admin Protection

- **Admin Layout** (`app/admin/layout.tsx`) checks:
  1. User is authenticated
  2. User has `admin` role in `user_roles` table
  3. If not admin → redirects to login with error

- **Admin Login** (`app/(auth)/admin/login/page.tsx`) checks:
  1. Validates credentials
  2. Checks if user has `admin` role
  3. If not admin → signs out and shows error

### Regular Users (Future)

- New signups automatically get `user` role
- Regular users can:
  - Comment on blog posts
  - Rate content
  - Access public features
- Regular users **CANNOT**:
  - Access `/admin/*` routes
  - Create/edit content
  - Manage users

## API Endpoint for Role Management

**POST** `/api/admin/users/set-role

**Body:**
```json
{
  "userId": "user-uuid-here",
  "role": "admin" | "user" | "moderator"
}
```

**Note:** Only admins can use this endpoint.

## Troubleshooting

### "Access denied. Admin privileges required."

- User doesn't have `admin` role in `user_roles` table
- Solution: Add admin role as shown in Step 2 above

### Login works but can't access admin pages

- Check that `user_roles` table exists
- Check that your user has `role = 'admin'` in the table
- Verify the migration ran successfully

### Can't find user_id

1. Go to Supabase Dashboard → Authentication → Users
2. Find your user
3. Click on it to see details
4. Copy the UUID (it's the `id` field)

## Security Notes

- ✅ Admin routes are protected by role check
- ✅ Regular users cannot access admin pages
- ✅ Service role key is used for admin operations (bypasses RLS)
- ✅ RLS policies protect `user_roles` table
- ✅ New signups automatically get `user` role (not admin)

---

**Status:** ✅ Role-based access control implemented!  
**Next:** Create regular user auth pages for blog comments

