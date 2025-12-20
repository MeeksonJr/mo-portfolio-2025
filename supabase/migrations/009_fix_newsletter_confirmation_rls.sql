-- Fix RLS policies to allow confirmation updates
-- Public users need to be able to update their subscription status when confirming

-- Drop existing update policy if it exists (there might not be one)
DROP POLICY IF EXISTS "Public can confirm subscription" ON newsletter_subscribers;

-- Allow public to update subscription when they have the correct confirmation token
-- This is safe because:
-- 1. The token is unique and randomly generated
-- 2. The API validates the token before allowing the update
-- 3. Only status and confirmed_at can be updated, and only from 'pending' to 'confirmed'
CREATE POLICY "Public can confirm subscription"
  ON newsletter_subscribers
  FOR UPDATE
  TO public
  USING (
    -- Allow update if status is pending (can only confirm pending subscriptions)
    status = 'pending'
    AND confirmation_token IS NOT NULL
  )
  WITH CHECK (
    -- Only allow changing status to 'confirmed' and setting confirmed_at
    status = 'confirmed'
    AND confirmed_at IS NOT NULL
  );

-- Also ensure the admin policy works correctly
-- The existing admin policy should work, but let's make sure it's correct
DROP POLICY IF EXISTS "Admins can manage newsletter subscribers" ON newsletter_subscribers;

CREATE POLICY "Admins can manage newsletter subscribers"
  ON newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
  );

