import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

export function InboxBell({ userId, onSignIn }: { userId?: string; onSignIn: () => void }) {
 const [open, setOpen] = useState(false);
 const qc = useQueryClient();
 const q = useQuery({
  queryKey: ['inbox', userId], enabled: !!userId, refetchInterval: 60000,
  queryFn: async () => { const { data, error } = await supabase.from('player_messages').select('id,title,body,read,created_at').eq('user_id', userId!).order('created_at', { ascending: false }).limit(100); if (error) throw error; return data; },
 });
 const unread = (q.data ?? []).filter(m => !m.read).length;
 async function openInbox() {
  if (!userId) { onSignIn(); return; }
  setOpen(true);
  if (unread) { await supabase.from('player_messages').update({ read: true }).eq('user_id', userId).eq('read', false); void qc.invalidateQueries({ queryKey: ['inbox', userId] }); }
 }
 return <>
  <Button variant="ghost" size="icon" aria-label="Inbox" title="অভ্যন্তরীণ বার্তা" className="relative" onClick={openInbox}><Bell />{unread > 0 && <span className="inbox-dot">{unread > 9 ? '9+' : unread}</span>}</Button>
  <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[80vh] overflow-y-auto">
   <DialogHeader><DialogTitle>অভ্যন্তরীণ বার্তা</DialogTitle><DialogDescription>বোনাস ও অ্যাকাউন্ট বিজ্ঞপ্তি</DialogDescription></DialogHeader>
   {q.isLoading && <p className="text-sm text-muted-foreground">লোড হচ্ছে…</p>}
   {q.data?.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground"><Mail className="mx-auto mb-2" />এখনো কোনো বার্তা নেই।</p>}
   <ul className="space-y-3">{q.data?.map(m => <li key={m.id} className="rounded-md border bg-card p-3"><div className="flex justify-between gap-2"><strong className="text-sm text-primary">{m.title}</strong><time className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString('bn-BD')}</time></div><p className="mt-1 text-sm">{m.body}</p></li>)}</ul>
  </DialogContent></Dialog>
 </>;
}
