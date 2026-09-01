import { createServerClient } from '@supabase/ssr';

export async function updateSession(request: any) {
  let supabaseResponse = {
    cookies: {
      set: () => {},
    },
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://buvjeybfvuiidcfmsunt.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dmpleWJmdnVpaWRjZm1zdW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMTUyODEsImV4cCI6MjEwMzU5MTI4MX0.Reg-7m5Yoz5TMhE-_tP3lWyhU-E0Z9-ieGa3Q59_0TI';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request?.cookies?.getAll ? request.cookies.getAll() : [];
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request?.cookies?.set?.(name, value));
        if (typeof (supabaseResponse as any).cookies?.set === 'function') {
          cookiesToSet.forEach(({ name, value, options }) =>
            (supabaseResponse as any).cookies.set(name, value, options)
          );
        }
      },
    },
  });

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request?.nextUrl?.pathname || '';

  // 1. If user is authenticated and visits login/signup or landing root, redirect to dashboard
  if (user && (pathname === '/login' || pathname === '/register' || pathname === '/sign-up' || pathname === '/sign-in' || pathname === '/')) {
    if (request?.nextUrl) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return { redirect: true, url: url.toString() };
    }
  }

  // 2. If user is unauthenticated and tries to access protected routes (/dashboard, /admin, /vault, etc.)
  if (
    !user &&
    (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/vault') ||
      pathname.startsWith('/profile'))
  ) {
    if (request?.nextUrl) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', pathname);
      return { redirect: true, url: url.toString() };
    }
  }

  return { supabaseResponse, user };
}
