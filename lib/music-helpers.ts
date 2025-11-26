/**
 * Helper functions for music player
 */

/**
 * Convert Supabase storage URL to proxy URL
 * This avoids CORS/COEP issues by routing through Next.js API
 */
export const getProxyAudioUrl = (supabaseUrl: string | null | undefined): string | null => {
  if (!supabaseUrl) return null
  
  // If it's already a proxy URL, return as is
  if (supabaseUrl.includes('/api/music/stream')) {
    return supabaseUrl
  }
  
  // If it's a local file path, return as is
  if (supabaseUrl.startsWith('/')) {
    return supabaseUrl
  }
  
  // Convert Supabase storage URL to proxy URL
  const proxyUrl = `/api/music/stream?url=${encodeURIComponent(supabaseUrl)}`
  return proxyUrl
}

/**
 * Check if URL is from Supabase storage
 */
export const isSupabaseUrl = (url: string | null | undefined): boolean => {
  if (!url) return false
  return url.includes('supabase.co/storage') || url.includes('supabase.co/storage/v1')
}

