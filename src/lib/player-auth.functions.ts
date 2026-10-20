import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { loginSchema, registerSchema, internalEmail } from '@/lib/player-auth-rules';

function publicClient() {
 const url = process.env['SUPABASE_URL'], key = process.env['SUPABASE_PUBLISHABLE_KEY'];
 if (!url || !key) throw new Error('Sign-in is unavailable');
 return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
  const headers = new Headers(init?.headers);
  if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
  headers.set('apikey', key);
  return fetch(input, { ...init, headers });
 } } });
}
async function signIn(email: string, password: string) {
 const { data, error } = await publicClient().auth.signInWithPassword({ email, password });
 if (error || !data.session) throw new Error('ইউজার নেম/মোবাইল নম্বর অথবা পাসওয়ার্ড ভুল');
 return { access_token: data.session.access_token, refresh_token: data.session.refresh_token };
}

export const playerLogin = createServerFn({ method: 'POST' }).inputValidator((d: unknown) => loginSchema.parse(d)).handler(async ({ data }) => {
 const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
 const { data: email } = await supabaseAdmin.rpc('player_login_email', { _identifier: data.identifier });
 if (!email) throw new Error('ইউজার নেম/মোবাইল নম্বর অথবা পাসওয়ার্ড ভুল');
 return signIn(email, data.password);
});

export const playerRegister = createServerFn({ method: 'POST' }).inputValidator((d: unknown) => registerSchema.parse(d)).handler(async ({ data }) => {
 const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
 const { data: taken } = await supabaseAdmin.rpc('player_identity_taken', { _handle: data.username, _phone: data.phone });
 if (taken) throw new Error('এই ইউজার নেম বা মোবাইল নম্বর আগে থেকেই ব্যবহৃত');
 const email = internalEmail(data.phone);
 const { error } = await supabaseAdmin.auth.admin.createUser({ email, password: data.password, email_confirm: true, user_metadata: { username: data.username, phone: data.phone } });
 if (error) throw new Error(/weak|pwned|guess/i.test(error.message) ? 'এই পাসওয়ার্ডটি খুব সহজ, আরও শক্তিশালী পাসওয়ার্ড দিন' : 'নিবন্ধন ব্যর্থ হয়েছে, আবার চেষ্টা করুন');
 return signIn(email, data.password);
});
