import { createAdminClient } from './server'

/**
 * Check if a user is an admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single()

    return !error && !!data
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Get user role
 */
export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()

    if (error || !data) return null
    return data.role
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

/**
 * Set user role (admin only operation)
 */
export async function setUserRole(
  userId: string,
  role: 'admin' | 'user' | 'moderator'
): Promise<boolean> {
  try {
    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('user_roles')
      .upsert(
        {
          user_id: userId,
          role,
        },
        {
          onConflict: 'user_id',
        }
      )

    return !error
  } catch (error) {
    console.error('Error setting user role:', error)
    return false
  }
}

