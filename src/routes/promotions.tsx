import type React from 'react';
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
 const [detail, setDetail] = useState<string | null>(null);
 const detailPromo = data.find(p => p.id === detail);
 if (detailPromo?.theme === 'mystery') return <div className="promo-page"><header className="promo-top"><button onClick={() => setDetail(null)} aria-label="Back to promotions" className="promo-back"><ChevronLeft /></button><h1>Promotion</h1></header><MysteryDetail /></div>;
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
    <div className="promo-foot"><h3>{p.title}</h3><button className="promo-more" onClick={() => p.theme === 'mystery' ? setDetail(p.id) : setOpen(open === p.id ? null : p.id)} aria-expanded={open === p.id}>More <ChevronRight /></button></div>
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

const Y = ({ children }: { children: React.ReactNode }) => <b className="promo-hl">{children}</b>;
function MysteryDetail() {
 return <article className="mystery-detail">
  <p><Y>2026</Y> সালে, <Y>NG66 Bet</Y>-এর সকল সদস্যের দীর্ঘায়ু ও সর্বাঙ্গীণ মঙ্গল কামনা করি!<br />প্রতি মাসের <Y>20</Y> তারিখে, <Y>NG66 Bet</Y>-এর সকল খেলোয়াড়দের জন্য কর্তৃক <Y>570 কোটি টাকার</Y> 【<Y>রহস্য পুরস্কার</Y>】 বিতরণ করা হবে।<br />রহস্য পুরস্কারের জন্য কোনো নিবন্ধনের প্রয়োজন নেই, বিতরণ সময় অনিয়মিত, শুধুমাত্র এক দফা বাজি সম্পন্ন করলেই পুরস্কার উত্তোলনযোগ্য হবে।<br /><Y>NG66 Bet</Y>-এ জমা/উত্তোলন এবং বাজির রেকর্ড রয়েছে এমন যে কোনো সদস্যই সিস্টেম দ্বারা এলোমেলোভাবে বিতরণকৃত রহস্য পুরস্কার পেতে পারেন!</p>
  <div className="mystery-box"><div><Y>রহস্য পুরস্কার</Y> বিনামূল্যে একচেটিয়া প্রদান · সিস্টেম স্বয়ংক্রিয়ভাবে বিতরণ করে</div><div><Y>রহস্য পুরস্কারের</Y> জন্য নিবন্ধনের প্রয়োজন নেই, সিস্টেম স্বয়ংক্রিয়ভাবে প্রতিটি সদস্যের অ্যাকাউন্টে এলোমেলোভাবে পুরস্কার বিতরণ করবে। বাজির পরিমাণ যত বেশি হবে, জমা তত বেশি হবে, পুরস্কার পাওয়ার সুযোগ তত বৃদ্ধি পাবে – কোনো উপরের সীমা নেই!</div></div>
  <p><Y>মনোযোগ দিন:</Y> 【<Y>রহস্য পুরস্কার</Y>】 বিতরণের পর, আমরা আপনার "অ্যাকাউন্টের অভ্যন্তরীণ বার্তা"তে বিজ্ঞপ্তি পাঠাবো। পুরস্কার সিস্টেম স্বয়ংক্রিয়ভাবে বিতরণ করা হয়। মেয়াদোত্তীর্ণ হলে এটি স্বয়ংক্রিয়ভাবে বাতিল বলে গণ্য হবে।</p>
  <h2><Y>অ্যাক্টিভিটির বিস্তারিত নিয়ম:</Y></h2>
  <ol>
   <li>প্রাপ্ত বোনাস উত্তোলনের আগে, আপনাকে প্রচারণার নির্ধারিত শর্তাবলী পূরণ করতে হবে।</li>
   <li>কোনো নিবন্ধন ছাড়াই পুরস্কার গ্রহণ করা যাবে, পুরস্কার প্রতি মাসের 20 তারিখে সিস্টেম দ্বারা এলোমেলোভাবে বিতরণ করা হবে।</li>
   <li>গ্রাহক পরিষেবা আপনার অ্যাকাউন্টটি পুরস্কার পাওয়ার শর্ত পূরণ করে কিনা তা পরীক্ষা করতে পারে না, এবং আমরা আপনার প্রাপ্ত পুরস্কারের পরিমাণও দেখতে পারি না। সদস্যদের পুরস্কারগুলি সিস্টেম দ্বারা এলোমেলোভাবে বিতরণ করা হবে।</li>
   <li>প্রতিটি সদস্য শুধুমাত্র একবার পুরস্কার গ্রহণ করতে পারবে, একই অ্যাকাউন্ট, একই নাম, একই ফোন নম্বর এবং একই আইপি অ্যাড্রেসের সীমাবদ্ধতা প্রযোজ্য।</li>
  </ol>
 </article>;
}
