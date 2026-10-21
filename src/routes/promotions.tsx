import type React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, Gift, Wallet, Heart, UserRound } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { usePlayer } from '@/hooks/use-player';
import { supabase } from '@/integrations/supabase/client';
import { getPromotions } from '@/lib/promotions.functions';
import mystery from '@/assets/promo-mystery.jpg';
import vip from '@/assets/promo-vip.jpg';
import invite from '@/assets/promo-invite.jpg';

const art: Record<string, string> = { mystery, vip, invite };
const promotionsQuery = queryOptions({ queryKey: ['promotions'], queryFn: () => getPromotions() });
const filters = [{ id: 'all', label: 'All' }, { id: 'app', label: 'APP Download' }, { id: 'partner', label: 'জোট সহযোগিতা' }] as const;

export const Route = createFileRoute('/promotions')({
 validateSearch: (search:Record<string,unknown>)=>({detail:typeof search['detail']==='string'?search['detail']:undefined}),
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
 const search=Route.useSearch();
 const [detail, setDetail] = useState<string | null>(null);
 const [deepLinkClosed,setDeepLinkClosed]=useState(false);
 const selectDetail=(id:string|null)=>{setDeepLinkClosed(true);setDetail(id);};
 const detailPromo = data.find(p => p.id === detail || (!detail&&!deepLinkClosed&&p.theme===search.detail));
 if (detailPromo?.theme === 'invite') return <div className="promo-page"><header className="promo-top"><button onClick={() => selectDetail(null)} aria-label="Back to promotions" className="promo-back"><ChevronLeft /></button><h1>Promotion</h1></header><InviteDetail /></div>;
 if (detailPromo?.theme === 'vip') return <div className="promo-page"><header className="promo-top"><button onClick={() => selectDetail(null)} aria-label="Back to promotions" className="promo-back"><ChevronLeft /></button><h1>Promotion</h1></header><VipDetail /></div>;
 if (detailPromo?.theme === 'mystery') return <div className="promo-page"><header className="promo-top"><button onClick={() => selectDetail(null)} aria-label="Back to promotions" className="promo-back"><ChevronLeft /></button><h1>Promotion</h1></header><MysteryDetail /></div>;
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
    <div className="promo-foot"><h3>{p.title}</h3><button className="promo-more" onClick={() => p.theme === 'mystery' || p.theme === 'vip' || p.theme === 'invite' ? selectDetail(p.id) : setOpen(open === p.id ? null : p.id)} aria-expanded={open === p.id}>More <ChevronRight /></button></div>
    {open === p.id && p.details && <p className="promo-details">{p.details}</p>}
   </article>)}
  </main>
  <nav className="promo-nav" aria-label="Mobile navigation">
   <Link to="/"><Home /><span>Home</span></Link>
   <Link to="/promotions" className="is-active"><Gift /><span>Promotion</span></Link>
   <Link to="/"><Wallet /><span>Deposit</span></Link>
   <Link to="/"><Heart /><span>Favorites</span></Link>
   <Link to="/member"><UserRound /><span>Members</span></Link>
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

const fmt = (n: number) => n >= 1e7 ? `${n / 1e7} কোটি` : n.toLocaleString('en-IN');
const vipRows: [number, number, number, number][] = [[2000,10,5,20],[20000,60,15,40],[60000,100,30,60],[200000,200,60,120],[600000,500,120,300],[1200000,700,200,500],[2000000,1000,300,600],[6000000,2000,400,1000],[12000000,3000,600,1600],[20000000,4000,800,2000],[40000000,6000,1000,3000],[60000000,8000,1200,4000],[80000000,10000,1400,6000],[100000000,12000,1600,8000],[120000000,14000,2000,10000],[160000000,16000,2600,12000],[200000000,20000,3200,16000],[240000000,24000,4000,20000],[280000000,28000,5000,24000],[320000000,32000,6000,28000]];
const missionsList = [5,15,30,60,120,200,300,400,600,800,1000,1200,1400,1600,2000,2600,3200,4000,5000,6000,7000,8000,10000,12000,14000,16000,18000,20000,22000,24000,26000,30000,34000,40000,50000,60000,70000,80000,90000,100000,110000];
const missions = missionsList;
const allVipRows: [number, number, number, number][] = [...vipRows, ...missions.slice(20).map((m, i): [number, number, number, number] => [320000000 + (i + 1) * 40000000, 32000 + (i + 1) * 4000, m, 28000 + (i + 1) * 4000])];
function VipDetail() {
 return <article className="mystery-detail">
  <h2><Y>ঘটনার বিবরণ:</Y></h2>
  <p>আজ থেকেই সদস্যরা <Y>NG66 Bet</Y>-এ প্রতিটি বাজি রাখলে তা আজীবনের জন্য জমা হবে যা আপনার সদস্য অ্যাকাউন্টকে সর্বোচ্চ মূল্য প্রদান করবে।সদস্য অ্যাকাউন্ট = অর্থসাপ্তাহিক বোনাস: <Y>4,00,000</Y>, মাসিক বোনাস: <Y>20,00,000</Y>, আপনার সদস্য অ্যাকাউন্টে ইতিমধ্যেই <Y>1,52,35,570</Y> টাকার আপগ্রেড বোনাস জমা হয়েছে!সদস্য অ্যাকাউন্টের অভিজ্ঞতা উপভোগ করুন আজীবন উপকৃত হোন!</p>
  <p><Y>ভিআইপি পুরস্কার কীভাবে দাবি করবেন:</Y><br />আপগ্রেড পুরস্কার <Y>স্বয়ংক্রিয়ভাবে আপনার সদস্যপদ অ্যাকাউন্টে যোগ হয়ে যাবে।</Y><br />সাপ্তাহিক বোনাস <Y>ভাবে প্রতি সোমবার ভোর 06:00 টায় 【বাংলাদেশ সময়】</Y> স্বয়ংক্রিয়ভাবে জারি করা হয়েছে।<br />মাসিক বোনাস <Y>ভাবে প্রতি মাসের 1 তারিখ ভোর 06:00 টায় 【বাংলাদেশ সময়】</Y> স্বয়ংক্রিয়ভাবে জারি করা হয়েছে।</p>
  <table className="vip-table"><thead><tr><th>ভিআইপি লেভেল</th><th>প্রয়োজনীয় বাজি</th><th>আপগ্রেড বোনাস</th><th>সাপ্তাহিক</th><th>মাসিক</th></tr></thead>
   <tbody>{allVipRows.map((r, i) => <tr key={i}><td>VIP {i + 1}</td><td>{fmt(r[0])}</td><td>{fmt(r[1])}</td><td>{fmt(r[2])}</td><td>{fmt(r[3])}</td></tr>)}</tbody></table>
  <h2><Y>🎁শর্ত:</Y></h2>
  <table className="vip-table"><thead><tr><th>ভিআইপি লেভেল</th><th>সাপ্তাহিক টার্নওভার মিশন</th><th>মাসিক জমা মিশন</th></tr></thead>
   <tbody>{missions.map((m, i) => <tr key={i}><td>VIP {i + 1}</td><td>{fmt(m)}</td><td>100</td></tr>)}</tbody></table>
  <p>উদাহরণ: সদস্যরা ভিআইপি <Y>12</Y> স্তরে পৌঁছালে <Y>25,570</Y> টাকা বোনাস অর্জন করতে পারে</p>
  <h2><Y>কার্যকলাপের নিয়ম:</Y></h2>
  <ol>
   <li>প্রাপ্ত বোনাস উত্তোলনের আগে <Y>1</Y> বার বাজি সম্পন্ন করতে হবে</li>
   <li>অনুগ্রহ করে সময়মতো প্রচারমূলক বোনাস গ্রহণ করুন যদি এটির মেয়াদ শেষ হয়ে যায় তবে এটি প্রত্যাহার হিসাবে বিবেচিত হবে;</li>
   <li>আপনি যদি আপনার সদস্য অ্যাকাউন্ট/পাসওয়ার্ড ভুলে যান তাহলে আপনার অ্যাকাউন্টের তথ্য পুনরুদ্ধার করতে সাহায্য করার জন্য অনুগ্রহ করে "<Y>24-ঘন্টা অনলাইন গ্রাহক পরিষেবা</Y>" এর সাথে যোগাযোগ করুন;</li>
   <li>কার্যক্রমে সদস্যদের অংশগ্রহণ সিস্টেম দ্বারা স্বয়ংক্রিয়ভাবে গণনা করা হয় যদি কোন আপত্তি থাকে <Y>NG66 Bet</Y> বাজি এর তদন্তের ফলাফল প্রাধান্য পাবে।</li>
   <li><Y>NG66 Bet</Y> বাজি যেকোনো সময় এই প্রচারটি পরিবর্তন বন্ধ বা বাতিল করার অধিকার সংরক্ষণ করে।</li>
  </ol>
 </article>;
}

const milestones: [number, number][] = [[1,300],[2,300],[3,300],[4,300],[5,300],[10,1500],[15,1500],[20,1500],[30,3000],[40,3000],[50,3000],[60,3000],[70,3000],[80,3000],[90,3000],[100,3000],[150,15000],[200,15000],[250,15000],[300,15000],[350,15000],[400,15000],[450,15000],[500,15000],[600,30000],[700,30000],[800,30000],[1000,60000],[1500,150000],[2000,150000],[2500,150000],[3000,150000],[4000,300000],[5000,300000],[6000,300000],[7000,300000],[8000,300000],[9000,300000],[10000,300000],[11000,300000],[12000,300000],[13000,300000],[14000,300000],[15000,300000],[20000,1500000],[25000,1500000],[30000,1500000],[35000,1500000],[40000,1500000],[50000,3000000],[60000,3000000],[70000,3000000],[80000,3000000],[90000,3000000],[100000,3000000]];
const inr = (n: number) => n.toLocaleString('en-IN');
function MyInvite() {
 const { user, profile } = usePlayer();
 const stats = useQuery({ queryKey: ['my-referrals', user?.id], enabled: !!user, queryFn: async () => {
  const [r, w] = await Promise.all([supabase.from('referrals').select('status').eq('referrer_id', user!.id), supabase.from('referral_rewards').select('amount').eq('referrer_id', user!.id)]);
  const rows = r.data ?? [];
  return { total: rows.length, valid: rows.filter(x => x.status === 'valid').length, earned: (w.data ?? []).reduce((a, x) => a + Number(x.amount), 0) };
 } });
 const [copied, setCopied] = useState(false);
 if (!user || !profile?.referral_code) return <p className="invite-box">আপনার ব্যক্তিগত আমন্ত্রণ লিংক পেতে লগইন করুন।</p>;
 const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${profile.referral_code}`;
 return <div className="invite-box">
  <p>আপনার আমন্ত্রণ কোড: <Y>{profile.referral_code}</Y></p>
  <div className="invite-link"><input readOnly value={link} aria-label="আমন্ত্রণ লিংক" /><button className="promo-more" onClick={() => { void navigator.clipboard.writeText(link); setCopied(true); }}>{copied ? 'কপি হয়েছে' : 'কপি'}</button></div>
  <p>মোট আমন্ত্রণ: <Y>{stats.data?.total ?? 0}</Y> · বৈধ: <Y>{stats.data?.valid ?? 0}</Y> · মোট আয়: <Y>৳{inr(stats.data?.earned ?? 0)}</Y></p>
 </div>;
}
function InviteDetail() {
 return <article className="mystery-detail">
  <MyInvite />
  <p><Y>ইভেন্টের বিবরণ :</Y><br />যত বেশি বন্ধু আমন্ত্রণ করবেন, তত বেশি আয় করবেন। শূন্য বিনিয়োগে মিলিয়ন টাকা আয়ের সুযোগ! আপনার বন্ধুদের <Y>NG66 Bet</Y>-এ যোগ দিতে আমন্ত্রণ জানান এবং অনলাইনে বিনোদনের উত্তেজনা এবং সম্পদ ভাগাভাগি করুন!</p>
  <table className="vip-table"><thead><tr><th>জমার পরিমাণ</th><th>বৈধ বাজি</th><th>আমন্ত্রণ বোনাস</th></tr></thead><tbody><tr><td>≥300</td><td>3,000</td><td>300</td></tr><tr><td colSpan={3}>বোনাস <Y>3,00,00,000</Y> টাকা পর্যন্ত</td></tr></tbody></table>
  <table className="vip-table"><thead><tr><th>বৈধ আমন্ত্রণ</th><th>বোনাস</th></tr></thead><tbody>{milestones.map(([c, b]) => <tr key={c}><td>{inr(c)}</td><td>{inr(b)}</td></tr>)}</tbody></table>
  <p><Y>NG66 Bet</Y>-এ আপনাকে স্বাগতম। আপনার ব্যক্তিগত লিঙ্কটি অ্যাপ্লিকেশন এবং সামাজিক নেটওয়ার্কের মাধ্যমে শেয়ার করুন: ওয়েবসাইট, <Y>Facebook, Instagram, TikTok, Telegram, WhatsApp, YouTube</Y> ইত্যাদি। দ্রুত সবাইকে আমন্ত্রণ করুন! আপনার ব্যক্তিগত লিঙ্কের মাধ্যমে নিবন্ধন করা সদস্যরা আপনার সরাসরি এজেন্ট হবে। তবে মনে রাখবেন, আপনি যে নতুন সদস্যদের আমন্ত্রণ করবেন তারা অবশ্যই প্রকৃত এবং বৈধ হতে হবে।<br />
  <b className="promo-num">1</b>. দি আপনার বন্ধুরা প্রথমবার সফলভাবে জমা করে, তাহলে আপনি <Y>300</Y> টাকা বোনাস উপার্জন করতে পারবেন। আপনি যত বেশি আমন্ত্রণ করবেন, আপনার আয় তত বেশি হবে।<br />
  <b className="promo-num">2</b>.আপনার বন্ধুরা যদি মাত্র <Y>1 টাকা</Y> বা তার বেশি বাজি ধরেন, তাহলে আপনি উচ্চ কমিশন উপভোগ করতে পারবেন! আজীবনের জন্য আপনার আমন্ত্রিতদের থেকে সর্বোচ্চ <Y>1.0%</Y> কমিশন উপার্জন করুন। এটি একটি আজীবনের আমন্ত্রণ প্রক্রিয়া!<br />
  <Y>প্রবেশ করুন</Y> → আপনার "<Y>অ্যাকাউন্ট</Y>"-এ লগইন করুন - "<Y>বোনাস</Y>" - "<Y>বন্ধুকে আমন্ত্রণ করুন</Y>" - "<Y>পুরস্কার</Y>" - "<Y>সংগ্রহ করুন</Y>" এ ক্লিক করুন।<br />স্লট মেশিন/ফিশিং/স্পোর্টস গেমের কমিশন হার নিচে তালিকাভুক্ত করা হলো।:</p>
  <h2><Y>2. ডিপোজিট কমিশন :</Y></h2>
  <table className="vip-table"><thead><tr><th>ডিপোজিট কমিশন</th><th>শর্তাবলী</th><th>ডেলিভারি পদ্ধতি</th></tr></thead><tbody><tr><td>আয় করুন <Y>0.5%</Y></td><td>প্রতিটি আমন্ত্রিত খেলোয়াড়ের জমা</td><td>স্বয়ংক্রিয়ভাবে বিতরণ করুন</td></tr></tbody></table>
  <h2><Y>3. বাজি কমিশন :</Y></h2>
  <table className="vip-table"><thead><tr><th>অফলাইন সদস্য বাজি</th><th>স্লট/মাছ ধরা/স্পোর্টস</th></tr></thead><tbody><tr><td>1+</td><td>1.0%</td></tr></tbody></table>
  <p><Y>উদাহরণ:</Y> আপনার <Y>100</Y> জন অফলাইন সদস্য রয়েছে এবং প্রতিদিন তাদের মোট বাজির আনুমানিক মূল্য <Y>1,00,00,000</Y> টাকা। সেদিন আপনার প্রাপ্ত কমিশন হবে: <Y>1,00,00,000 × 1.0% = 1,00,000</Y> টাকা। মাসে <Y>30,00,000</Y> টাকা আয় করা খুবই সম্ভব।<br />
  <Y>মনে করিয়ে দেওয়া :</Y><br />একই আইপি, একই ডিভাইস, নাম, bKash/Nagad/Rocket অ্যাকাউন্ট ইত্যাদি তথ্য দিয়ে থাকা সদস্য অ্যাকাউন্ট শুধুমাত্র একবার অংশগ্রহণ করতে পারবে। নিয়ম লঙ্ঘনকারীরা এই বোনাসগুলি উপভোগ করতে পারবে না। যদি কোনো ব্যবহারকারী বা দল সন্দেহজনক বা অনিয়মিত কার্যক্রমে যুক্ত হয়, তবে তাদের এবং/অথবা তাদের দলের অ্যাকাউন্ট বাজেয়াপ্ত করা হবে এবং অ্যাকাউন্ট স্থায়ীভাবে ফ্রিজ করে দেওয়া হবে।<br />কমিশন প্রতি ঘন্টায় স্বয়ংক্রিয়ভাবে আপনার অ্যাকাউন্টে জমা করা হবে।</p>
  <h2><Y>ইভেন্টের নিয়মাবলী:</Y></h2>
  <ol>
   <li>যদি আপনি আপনার সদস্যপদ অ্যাকাউন্ট/পাসওয়ার্ড ভুলে যান, দয়া করে "<Y>24-ঘণ্টা অনলাইন গ্রাহক পরিষেবা</Y>" এর সাথে যোগাযোগ করুন এবং আপনার অ্যাকাউন্ট তথ্য পুনরুদ্ধার করুন।</li>
   <li><Y>NG66 Bet</Y> যে কোনো সময় প্রচার কার্যক্রম পরিবর্তন, স্থগিত বা বাতিল করার অধিকার সংরক্ষণ করে।</li>
  </ol>
 </article>;
}
