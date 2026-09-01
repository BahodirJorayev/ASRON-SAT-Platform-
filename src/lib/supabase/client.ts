import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://buvjeybfvuiidcfmsunt.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dmpleWJmdnVpaWRjZm1zdW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMTUyODEsImV4cCI6MjEwMzU5MTI4MX0.Reg-7m5Yoz5TMhE-_tP3lWyhU-E0Z9-ieGa3Q59_0TI';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
