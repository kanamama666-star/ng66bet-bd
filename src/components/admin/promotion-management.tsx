import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Gift, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Row = Database['public']['Tables']['promotions']['Row'];
const blank = { title: '', category: 'all', theme: 'mystery', headline: '', subline: '', highlights: [] as string[], details: '', sort_order: 0, active: true };

export function PromotionManagement() {
 const qc = useQueryClient();
 const q = useQuery({ queryKey: ['admin-promotions'], queryFn: async () => { const { data, error } = await supabase.from('promotions').select('*').order('sort_order'); if (error) throw error; return data; } });
 return <section className="mt-10"><div className="mb-5 flex items-center gap-3 border-b pb-4"><Gift className="text-primary" /><h2 className="text-lg font-bold">Promotion page offers</h2></div>
  <div className="grid gap-5 lg:grid-cols-2">{(q.data ?? []).map(r => <PromoForm key={r.id} row={r} onDone={() => qc.invalidateQueries({ queryKey: ['admin-promotions'] })} />)}
   <PromoForm key={`new-${q.data?.length ?? 0}`} onDone={() => qc.invalidateQueries({ queryKey: ['admin-promotions'] })} /></div></section>;
}

function PromoForm({ row, onDone }: { row?: Row; onDone: () => void }) {
 const [f, setF] = useState(row ? { ...row } : { ...blank });
 const [busy, setBusy] = useState(false);
 const set = (k: string, v: unknown) => setF(p => ({ ...p, [k]: v }));
 async function save() {
  if (f.title.trim().length < 2) { toast.error('Add a promotion title.'); return; }
  setBusy(true);
  const payload = { title: f.title.trim(), category: f.category, theme: f.theme, headline: f.headline, subline: f.subline, highlights: f.highlights.map(h => h.trim()).filter(Boolean), details: f.details, sort_order: Number(f.sort_order) || 0, active: f.active };
  const { error } = row ? await supabase.from('promotions').update(payload).eq('id', row.id) : await supabase.from('promotions').insert(payload);
  setBusy(false);
  if (error) toast.error('Unable to save promotion.'); else { toast.success('Promotion saved.'); onDone(); }
 }
 async function remove() { if (!row || !confirm('Remove this promotion?')) return; const { error } = await supabase.from('promotions').delete().eq('id', row.id); if (error) toast.error('Unable to remove.'); else onDone(); }
 const sel = 'mt-1 h-9 w-full rounded-md border bg-card px-2 text-sm';
 return <form className="space-y-3 rounded-lg border bg-card p-4" onSubmit={e => { e.preventDefault(); void save(); }}>
  <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">{row ? row.title : 'New promotion'}</h3><label className="flex items-center gap-2 text-xs">Active<Switch checked={f.active} onCheckedChange={v => set('active', v)} /></label></div>
  <label className="block text-xs">Card title<Input className="mt-1" value={f.title} maxLength={80} onChange={e => set('title', e.target.value)} /></label>
  <div className="grid grid-cols-3 gap-2">
   <label className="text-xs">Tab<select className={sel} value={f.category} onChange={e => set('category', e.target.value)}><option value="all">All</option><option value="app">APP Download</option><option value="partner">জোট সহযোগিতা</option></select></label>
   <label className="text-xs">Artwork<select className={sel} value={f.theme} onChange={e => set('theme', e.target.value)}><option value="mystery">Mystery god</option><option value="vip">VIP trophy</option><option value="invite">Handshake</option></select></label>
   <label className="text-xs">Order<Input className="mt-1" type="number" value={f.sort_order} onChange={e => set('sort_order', e.target.value)} /></label>
  </div>
  <label className="block text-xs">Banner headline<Input className="mt-1" value={f.headline} maxLength={120} onChange={e => set('headline', e.target.value)} /></label>
  <label className="block text-xs">Offer badges (one per line)<textarea className="mt-1 min-h-20 w-full rounded-md border bg-card p-2 text-sm" value={f.highlights.join('\n')} onChange={e => set('highlights', e.target.value.split('\n'))} /></label>
  <label className="block text-xs">Banner footer line<Input className="mt-1" value={f.subline} maxLength={160} onChange={e => set('subline', e.target.value)} /></label>
  <label className="block text-xs">"More" details text<textarea className="mt-1 min-h-16 w-full rounded-md border bg-card p-2 text-sm" maxLength={2000} value={f.details} onChange={e => set('details', e.target.value)} /></label>
  <div className="flex justify-between">{row ? <Button type="button" variant="ghost" size="sm" onClick={remove}><Trash2 />Remove</Button> : <span />}<Button size="sm" disabled={busy}>{row ? <Save /> : <Plus />}{row ? 'Save' : 'Add promotion'}</Button></div>
 </form>;
}
