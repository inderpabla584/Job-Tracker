import { createBrowserClient } from '@supabase/ssr'

// Singleton browser client — session stored in cookies, readable server-side
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
