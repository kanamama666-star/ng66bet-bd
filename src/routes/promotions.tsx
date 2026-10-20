import { createFileRoute, Link } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, Gift, Wallet, Heart, UserRound } from 'lucide-react';
import { getPromotions } from '@/lib/promotions.functions';
import mystery from '@/assets/promo-mystery.jpg';
import vip from '@/assets/promo-vip.jpg';
import invite from '@/assets/promo-invite.jpg';

const art: Record<string, string> = { mystery, vip, invite };
const promotionsQuery = queryOptions({ queryKey: ['promotions'], queryFn: () => getPromotions() });
const filters = [{ id: 'all', label: 'All' }, { id: 'app', label: 'APP Download' }, { id: 'partner', label: 'জোট সহযোগিতা' }] as const;

export const Route = createFileRoute('/promotions')({
 head: () => ({ meta: [
  { title: 'Promotion — NG66 Bet' },
  { name: 'description', content: 'NG66 Bet promotions: রহস্য বোনাস, ভিআইপি সদস্য সুবিধা and invite-a-friend rewards.' },
  { property: 'og:title', content: 'Promotion — NG66 Bet' },
  { property: 'og:description', content: 'Mystery bonus, VIP member benefits and referral rewards at NG66 Bet.' },
  { property: 'og:type', content: 'website' },
  { name: 'twitter:card', content: 'summary_large_image' },
 ] }),
 loader: ({ context }) => context.queryClient.ensureQueryData(promotionsQuery),
 component: PromotionsPage,
});

function PromotionsPage() {
 const { data } = useSuspenseQuery(promotionsQuery);
 const [filter, setFilter] = useState<string>('all');
 const [open, setOpen] = useState<string | null>(null);
 const list = filter === 'all' ? data : data.filter(p => p.category === filter);
 return <div className="promo-page">
  <header className="promo-top"><Link to="/" aria-label="Back to lobby" className="promo-back"><ChevronLeft /></Link><h1>Promotion</h1></header>
  <div className="promo-filters" role="tablist">{filters.map(f => <button key={f.id} role="tab" aria-selected={filter === f.id} className={filter === f.id ? 'is-active' : ''} onClick={() => setFilter(f.id)}>{f.label}</button>)}</div>
  <main className="promo-list">
   {list.length === 0 && <p className="promo-empty">এই বিভাগে এখন কোনো প্রচার নেই।</p>}
   {list.map(p => <article key={p.id} className="promo-card">
    <div className="promo-art"><img src={art[p.theme] ?? mystery} alt="" width={1280} height={512} loading="lazy" />
     <div className={`promo-copy theme-${p.theme}`}>
      {p.headline && <h2>{p.headline}</h2>}
      {p.highlights.map((h, i) => <span key={i} className="promo-pill">{h}</span>)}
      {p.subline && <p>{p.subline}</p>}
     </div>
    </div>
    <div className="promo-foot"><h3>{p.title}</h3><button className="promo-more" onClick={() => setOpen(open === p.id ? null : p.id)} aria-expanded={open === p.id}>More <ChevronRight /></button></div>
    {open === p.id && p.details && <p className="promo-details">{p.details}</p>}
   </article>)}
  </main>
  <nav className="promo-nav" aria-label="Mobile navigation">
   <Link to="/"><Home /><span>Home</span></Link>
   <Link to="/promotions" className="is-active"><Gift /><span>Promotion</span></Link>
   <Link to="/"><Wallet /><span>Deposit</span></Link>
   <Link to="/"><Heart /><span>Favorites</span></Link>
   <Link to="/"><UserRound /><span>Members</span></Link>
  </nav>
 </div>;
}
