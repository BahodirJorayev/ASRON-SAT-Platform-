import { createServerClient } from '@supabase/ssr';

// Next.js 15 App Router Server Client helper
export async function createClient(cookieStorePromise?: any) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://buvjeybfvuiidcfmsunt.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dmpleWJmdnVpaWRjZm1zdW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMTUyODEsImV4cCI6MjEwMzU5MTI4MX0.Reg-7m5Yoz5TMhE-_tP3lWyhU-E0Z9-ieGa3Q59_0TI';

  // In Next.js 15, cookies() returns a Promise<ReadonlyRequestCookies>
  let cookieStore = cookieStorePromise;
  if (!cookieStore) {
    try {
      // Dynamic import to avoid build errors when not running in Next.js runtime
      const { cookies } = await import('next/headers' as any);
      cookieStore = await cookies();
    } catch {
      cookieStore = {
        getAll: () => [],
        set: () => {},
      };
    }
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return typeof cookieStore?.getAll === 'function' ? cookieStore.getAll() : [];
      },
      setAll(cookiesToSet) {
        try {
          if (typeof cookieStore?.set === 'function') {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          }
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}
