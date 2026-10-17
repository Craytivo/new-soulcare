/** Server-side Supabase configuration. Keep service-role access in API routes only. */
export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return { url, anonKey, configured: Boolean(url && anonKey) }
}
