import { createClient } from '../../../lib/supabase/server';

export async function GET(request: any) {
  const { searchParams, origin } = new URL(request?.url || 'http://localhost:3000');
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return { redirectUrl: `${origin}${next}` };
    }
  }

  // return the user to an error page with instructions or dashboard
  return { redirectUrl: `${origin}/dashboard` };
}
