# Debugging Role Check Issue

## The Problem

You're getting "Access denied. Admin privileges required." even though you set your role to admin.

## Possible Causes

1. **User ID Mismatch** - The user_id in `user_roles` table doesn't match your actual user ID
2. **RLS Blocking** - Row Level Security is blocking the query
3. **Session Not Established** - The session isn't being passed correctly to the API

## Debugging Steps

### Step 1: Verify Your User ID

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find your user
3. **Copy the UUID** (this is your user_id)

### Step 2: Verify Role in Database

1. Go to Supabase Dashboard → **Table Editor** → `user_roles`
2. Check if there's a row with:
   - `user_id` = (your user UUID from Step 1)
   - `role` = `admin`

**If the row doesn't exist or user_id doesn't match:**
- Delete the existing row (if wrong)
- Insert a new row with the correct user_id

### Step 3: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try logging in
4. Look for any error messages
5. Check the Network tab for the `/api/admin/check-role` request
6. See what response it returns

### Step 4: Manual SQL Check

Run this in Supabase SQL Editor:

```sql
-- Replace 'YOUR_USER_ID' with your actual user ID
SELECT 
  u.id as user_id,
  u.email,
  ur.role
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'your-email@example.com';
```

This will show:
- Your user ID
- Your email
- Your role (should be 'admin')

### Step 5: Fix If Role Missing

If the query shows `role` as NULL:

```sql
-- Replace 'YOUR_USER_ID' with the actual user_id from the query above
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Quick Fix Script

Run this in Supabase SQL Editor (replace with your email):

```sql
-- Set admin role for your user
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Testing

After fixing, try logging in again. The API route now logs to the server console, so check your terminal for:
- "Role check for user: [user-id] Role: admin Error: null"

If you see "Role: null" or an error, the issue is with the database entry.

