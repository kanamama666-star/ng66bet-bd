import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
export const getCms = createServerFn({ method: 'GET' }).handler(async () => {
 const empty = { notices: [] as {id:string;message:string}[], banners: [] as {id:string;title:string;storage_path:string}[], gateways: [] as {method:string;account_number:string;account_type:string}[] };
 const url = process.env['SUPABASE_URL'] ?? process.env['VITE_SUPABASE_URL'];
 const key = process.env['SUPABASE_PUBLISHABLE_KEY'] ?? process.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
 if (!url || !key) { console.error('CMS: backend env missing'); return empty; }
 try {
 const client = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
  const headers = new Headers(init?.headers);
  if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
  headers.set('apikey', key);
  return fetch(input, { ...init, headers });
 } } });
 const [notices, banners, gateways] = await Promise.all([
  client.from('site_notices').select('id,message').eq('active',true),
  client.from('content_banners').select('id,title,storage_path').eq('active',true).order('created_at'),
  client.from('payment_gateways').select('method,account_number,account_type').eq('active',true),
 ]);
 const error = notices.error || banners.error || gateways.error;
 if (error) { console.error('CMS load failed', error); return empty; }
 const visibleBanners = await Promise.all((banners.data ?? []).map(async banner => {
  if(banner.storage_path.startsWith('https://')) return banner;
  const {data} = await client.storage.from('admin-banners').createSignedUrl(banner.storage_path,3600);
  const browserUrl=import.meta.env['VITE_SUPABASE_URL'];
  const image=data?.signedUrl && browserUrl ? data.signedUrl.replace(url,browserUrl) : '';
  return {...banner,storage_path:image};
 }));
 return { notices: notices.data ?? [], banners: visibleBanners.filter(b=>b.storage_path), gateways: gateways.data ?? [] };
});
