import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

export type Promotion = Pick<Database['public']['Tables']['promotions']['Row'], 'id'|'title'|'category'|'theme'|'headline'|'subline'|'highlights'|'details'>;

export const getPromotions = createServerFn({ method: 'GET' }).handler(async (): Promise<Promotion[]> => {
 const url = process.env['SUPABASE_URL'] ?? process.env['VITE_SUPABASE_URL'];
 const key = process.env['SUPABASE_PUBLISHABLE_KEY'] ?? process.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
 if (!url || !key) { console.error('Promotions: backend env missing'); return []; }
 try {
 const client = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
  const headers = new Headers(init?.headers);
  if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
  headers.set('apikey', key);
  return fetch(input, { ...init, headers });
 } } });
 const { data, error } = await client.from('promotions').select('id,title,category,theme,headline,subline,highlights,details').eq('active', true).order('sort_order');
 if (error) { console.error('Promotions load failed', error); return []; }
 return data ?? [];
 } catch (e) { console.error('Promotions load failed', e); return []; }
});
